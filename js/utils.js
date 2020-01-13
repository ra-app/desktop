/* eslint-disable no-empty */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

'use strict';

/* eslint strict: ["error", "global"] */
async function parallel(num, arr, func) {
  const thread = item => {
    if (!item) return;
    return func(item) // eslint-disable-line consistent-return, more/no-then
      .catch(err => {
        console.error('Error in parallel, should be handled in func!', err);
        return true;
      })
      .then(() => {
        // eslint-disable-line consistent-return
        if (arr.length) return thread(arr.shift());
      });
  };
  const promises = []; // eslint-disable-next-line no-plusplus
  for (let i = 0; i < num; ++i) promises.push(thread(arr.shift()));
  await Promise.all(promises);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

//  ****************************************************function for xml*************************************************

function findUserXml(id, xmlData) {
  let position = null;
  for (let i = 0; i < xmlData.children.length; i++) {
    const contact = xmlData.children.item(i);
    const phone = contact.getElementsByTagName('phone')[0].textContent;
    const email = contact.getElementsByTagName('email')[0].textContent;
    if (phone === id || email === id) {
      position = i;
      return position; // only first position TODO LIST OF POSITION FOR MULTI SELECT
    }
  }
  return position;
}

async function getXmlFile() {
  let xml = localStorage.getItem('ContactList');
  if (!xml) {
    const companyNumber = textsecure.storage.get('companyNumber', null);
    xml = await getContactXml(companyNumber);
    if (xml) {
      xml = xml.contact_data;
      localStorage.setItem('ContactList', xml);
    }
  }
  return xml;
}

function prepareDataXml(contact_data) {
  let xmlRes;
  try {
    // WebKit returns null on unsupported types
    xmlRes = checkValidXML(contact_data);
  } catch (ex) {
    console.log(ex);
    return document.createElementNS('', 'contactlist');
  }
  const contactListXml = xmlRes.children[0];
  return contactListXml;
}

function prepareDataToUpdate(xmlData) {
  const dataString = xmlData.outerHTML;
  // console.log(xmlData.outerHTML, 'outerrrr')
  const aux = dataString.toString().replace(/\r|\n|\t/g, '');
  const data = {
    contact_data: aux.toString().replace(/>\s*/g, '>'),
  };
  return data;
}

async function updateXmlDB(data) {
  const companyNumber = textsecure.storage.get('companyNumber', null);
  if (data.contact_data.indexOf('<?xml') !== 0) {
    data.contact_data =
      '<?xml version="1.0" encoding="UTF-8"?>' + data.contact_data;
  }
  await updateContact(companyNumber, data);
  localStorage.setItem('ContactList', data.contact_data);
  await window.saveContactXML(data.contact_data);
}

async function getListInvitation() {
  let invitationList = localStorage.getItem('InvitationList');
  if (!invitationList) {
    const companyNumber = textsecure.storage.get('companyNumber', null);
    invitationList = await getClientAdminCompany(companyNumber);
    invitationList = JSON.stringify(invitationList);
    if (invitationList) {
      localStorage.setItem('InvitationList', invitationList);
    }
  }
  return JSON.parse(invitationList);
}
