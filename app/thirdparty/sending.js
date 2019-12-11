const fs = require('fs');
const parseStringPromise = require('xml2js').parseStringPromise;

const { thirdIPC, getMetaInfo } = require('./ipc');
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
  try {
    const ext = getExtension(filename);
    if (ext !== 'xml' && ext !== 'json') return;

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

      const response = await thirdIPC('outbox_file', destination, { content, filename, info });
      console.log('thirdPartyNode sendOutboxFile', fullPath, destination, content.toString(), response);
      if (response && response.success) {
        deleteFile(fullPath);
        if (exists(fullPath + '.error')) deleteFile(fullPath + '.error');
      }
    }
  } catch (err) {
    console.warn('thirdPartyNode sendOutboxFile Error:', err, fullPath);
    writeSendError(fullPath, err);
  }
  fileLocks[fullPath] = false;
}

module.exports = {
  sendOutboxFile,
};