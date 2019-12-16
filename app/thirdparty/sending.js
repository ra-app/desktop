const fs = require('fs');
const parseStringPromise = require('xml2js').parseStringPromise;
const StreamZip = require('node-stream-zip');

const { thirdIPC, getMetaInfo, createAttachmentPointer, deleteAttachmentPointer } = require('./ipc');
const { deleteFile, exists, getExtension } = require('./util');

function findTagInXML(tag, parsedXML) {
  if (typeof parsedXML === 'object') {
    const keys = Object.keys(parsedXML);
    for (let i = 0; i < keys.length; i++) {
      const value = parsedXML[keys[i]];
      if (keys[i] === tag) return value.length ? value[0] : value;
      return findTagInXML(tag, value);
    }
  }
}

function ParcelMetaToInfo(parcelMeta) {
  const info = {};
  if (parcelMeta.destination && parcelMeta.destination.length > 0) info.destination = parcelMeta.destination[0];
  if (parcelMeta.origin && parcelMeta.origin.length > 0) info.origin = parcelMeta.origin[0];
  if (parcelMeta.type && parcelMeta.type.length > 0) info.type = parcelMeta.type[0];

  if (parcelMeta.labels && parcelMeta.labels.length > 0) {
    info.labels = {};
    parcelMeta.labels.forEach((labels) => {
      if (labels.label && labels.label.length > 0) {
        labels.label.forEach((label) => {
          info.labels[label['KEY']] = label['_'];
        })
      }
    });
  }

  if (parcelMeta.files && parcelMeta.files.length > 0) {
    info.files = {};
    parcelMeta.files.forEach((files) => {
      if (files.file_name && files.file_name.length > 0) {
        files.file_name.forEach((file) => {
          let MD5;
          if (file['MD5_HASH'] && file['MD5_HASH'].length > 0) MD5 = file['MD5_HASH'][0];
          info.files[file['_']] = { MD5 };
        })
      }
    });
  }
  return info;
}

async function extractInfoFromXML(xmlContent) {
  const parsed = await parseStringPromise(xmlContent, { strict: false, normalizeTags: true, trim: true, normalize: true, stripPrefix: true, mergeAttrs: true });
  // console.log('PARSED', JSON.stringify(parsed));
  if (!parsed) { throw new Error('Parsed was null!'); }
  
  let info = {};
  let parcelMeta;
  if (parsed.destination) {
    // Test raw xml
    info.destination = parsed.destination;
  } else if (parcelMeta = findTagInXML('parcel_meta', parsed)) {
    info = ParcelMetaToInfo(parcelMeta);
  } else {
    throw new Error('Bad XML!');
  }

  return info;
}

function extractInfoFromZip(filename) {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file: filename,
      storeEntries: true
    });
    
    // Handle errors
    zip.on('error', reject);

    zip.on('ready', () => {
      try {
        const data = zip.entryDataSync('parcel.xml');
        resolve(extractInfoFromXML(data));  
      } catch (err) { reject(err); }
    });
  });
}

function writeSendError(fullPath, error) {
  try {
    fs.writeFileSync(fullPath + '.error', JSON.stringify({
      error: error,
      ts: Date.now(),
    }, null, 2), { flag: 'w' });
  } catch (err) {
    console.error('thirdPartyNode writeSendError Error:', err);
  }
}

const fileLocks = {};
async function sendOutboxFile(fullPath, filename) {
  let attachment;
  try {
    const ext = getExtension(filename);
    if (ext !== 'xml' && ext !== 'json' && ext !== 'zip' && ext !== 'ofa') return;

    if (fileLocks[fullPath]) {
      console.log('sendOutboxFile - Already handling', filename);
      return;
    }

    fileLocks[fullPath] = true;
    const content = fs.readFileSync(fullPath);

    if (content) {
      let info;

      if (ext === 'xml') {
        info = await extractInfoFromXML(content);
      } else if (ext === 'json') {
        info = JSON.parse(content);
      } else if (ext === 'zip' || ext === 'ofa') {
        info = await extractInfoFromZip(fullPath);
      } else {
        throw new Error('Invalid file extension!');
      }

      const destination = info.destination;
      if (!destination) { throw new Error('Missing destination!'); }

      // For now only check for mismatch if origin is specified, for old xml and simple json
      if (info.origin) {
        const metaInfo = await getMetaInfo();
        if (info.origin !== metaInfo.ownPhoneNumber) throw new Error('Origin mismatch!');
      }

      const data = { filename, info };

      const SIZE_LIMIT = 500000; // 0.5 MB
      // console.log('SIZE', content.byteLength, SIZE_LIMIT, content.byteLength >= SIZE_LIMIT);
      if (content.byteLength >= SIZE_LIMIT) attachment = data.attachment = await createAttachmentPointer(content);
      else data.content = content;

      const response = await thirdIPC('outbox_file', destination, data);
      console.log('thirdPartyNode sendOutboxFile', fullPath, destination, response);
      if (response && response.success) {
        deleteFile(fullPath);
        if (exists(fullPath + '.error')) deleteFile(fullPath + '.error');
      }
    }
  } catch (err) {
    console.warn('thirdPartyNode sendOutboxFile Error:', err, fullPath);
    writeSendError(fullPath, err);
    if (attachment) { // Cleanup dangling attachment?
      try {
        await deleteAttachmentPointer(attachment);
      } catch (err) {
        console.warn('thirdPartyNode sendOutboxFile deleteAttachmentPointer Error:', err, attachment);
      }
    }
  }
  fileLocks[fullPath] = false;
}

module.exports = {
  sendOutboxFile,
};