const fs = require('fs');
const parseStringPromise = require('xml2js').parseStringPromise;

const { thirdIPC } = require('./ipc');
const { deleteFile } = require('./util');

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

async function extractInfoFromXML(xmlContent) {
  const parsed = await parseStringPromise(xmlContent, { strict: false, normalizeTags: true, trim: true, normalize: true });
  // console.log('PARSED', JSON.stringify(parsed));
  if (!parsed) { throw new Error('Parsed was null!'); }
  const info = {};

  let parcelMeta;
  if (parsed.destination) {
    // Test raw xml
    info.destination = parsed.destination;
  } else if (parcelMeta = findTagInXML('parcel_meta', parsed)) {
    // Handle proper Parcel_Meta struct
    // TODO: extract and check other infos, that origin tag is present and matches, etc
    console.log('PARCEL META', parcelMeta);
    info.destination = parcelMeta.destination[0];
    // info.type = parcelMeta.type[0];
  } else {
    throw new Error('Bad XML!');
  }

  return info;
}

const fileLocks = {};
async function sendOutboxFile(fullPath, filename) {
  try {
    if (filename.indexOf('.xml') === -1 && filename.indexOf('.json') === -1) return;

    if (fileLocks[fullPath]) {
      console.log('sendOutboxFile - Already handling', filename);
      return;
    }

    fileLocks[fullPath] = true;
    const content = fs.readFileSync(fullPath);

    let destination;

    if (filename.indexOf('.xml') !== -1) {
      const info = await extractInfoFromXML(content);
      destination = info.destination;
    } else if (filename.indexOf('.json') !== -1) {
      const info = JSON.parse(content);
      destination = info.destination;
    } else {
      throw new Error('Invalid file extension!');
    }

    if (!destination) { throw new Error('Missing destination!'); }

    const response = await thirdIPC('outbox_file', destination, { content, filename });
    console.log('thirdPartyNode sendOutboxFile', fullPath, destination, content.toString(), response);
    if (response && response.success) {
      deleteFile(fullPath);
    }
  } catch (err) {
    console.warn('thirdPartyNode sendOutboxFile Error:', err.message || err, fullPath);
  }
  fileLocks[fullPath] = false;
}

module.exports = {
  sendOutboxFile,
};