const fs = require('fs');
const { getMetaInfo, getCompaniesForMe } = require('./ipc');
const { getPath } = require('./util');

async function getCompanyNamespaces() {
  const companies = await getCompaniesForMe();
  let ids = [];
  if (companies && companies.admin && companies.admin.length)
    companies.admin.forEach(entry => {
      ids.push(entry.company_id);
    });
  return ids;
}

async function writeMetaFiles() {
  const metaInfo = await getMetaInfo();
  const companies = await getCompanyNamespaces();

  const data = {
    self: metaInfo.ownPhoneNumber,
    companies,
  };

  fs.writeFileSync(
    getPath('discovery', 'meta.json'),
    JSON.stringify(data, null, 2)
  );
  // fs.writeFileSync(getPath('discovery', 'meta.xml'), obj2xml(null, 'root', data));
}

async function initDiscovery() {
  try {
    await writeMetaFiles();

    // setInterval(writeMetaFiles, 60000 * 15);
  } catch (err) {
    console.warn('initDiscovery Error:', err);
  }
}

module.exports = {
  initDiscovery,
};
