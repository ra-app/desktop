/* eslint-disable no-empty */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

'use strict';

/* eslint strict: ["error", "global"] */
async function parallel(num, arr, func) {
  const thread = (item) => {
    if (!item) return;
    return func(item) // eslint-disable-line consistent-return, more/no-then
      .catch(err => {
        console.error('Error in parallel, should be handled in func!', err);
        return true;
      })
      .then(() => { // eslint-disable-line consistent-return
        if (arr.length) return thread(arr.shift());
      });
  }
  const promises = []; // eslint-disable-next-line no-plusplus
  for (let i = 0; i < num; ++i) promises.push(thread(arr.shift()));
  await Promise.all(promises);
}

//  ****************************************************function for xml*************************************************

function findUserXml(id, xmlData) {
  let position = null;
  for (let i = 0; i < xmlData.children.length; i++) {
    const contact = xmlData.children.item(i);
    const phone = contact.getElementsByTagName('phone')[0].textContent
    if (phone === id) {
      position = i
      return position; // only first position TODO LIST OF POSITION FOR MULTI SELECT
    }
  }
  return position;
}

async function getXmlFile() {
  let xml = localStorage.getItem('ContactList')
  if (!xml) {
    const companyNumber = textsecure.storage.get('companyNumber', null);
    xml = await getContactXml(companyNumber);
    localStorage.setItem('ContactList', JSON.stringify(xml));
  }
  return xml
}

function prepareDataXml(contact_data) {
  const parser = new DOMParser();
  let xmlRes;
  try {
    // WebKit returns null on unsupported types
    xmlRes = parser.parseFromString(contact_data, 'text/xml');
  } catch (ex) {
    console.log(ex)
  }
  document.xmlRes = xmlRes;
  const contactListXml = xmlRes.children[0];
  return contactListXml;
}

function prepareDataToUpdate(xmlData) {
  const dataString = xmlData.outerHTML
  // console.log(xmlData.outerHTML, 'outerrrr')
  const aux = dataString.toString().replace(/\r|\n|\t/g, '');
  const data = {
    'contact_data': aux.toString().replace(/>\s*/g, '>'),
  }
  return data
}

async function updateXmlDB(data) {
  const companyNumber = textsecure.storage.get('companyNumber', null);
  await updateContact(companyNumber, data);
  localStorage.setItem('ContactList', data.contact_data);
}

async function getListInvitation() {
  let invitationList = localStorage.getItem('InvitationList')
  if (!invitationList) {
    const companyNumber = textsecure.storage.get('companyNumber', null);
    invitationList = await getClientAdminCompany(companyNumber);
    if (invitationList) {
      localStorage.setItem('InvitationList', invitationList);
    }
  }
  return JSON.parse(invitationList)
}