/* global Whisper: false */
/* global textsecure: false */

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};

  const contactsData = null

  Whisper.ImportContactView = Whisper.View.extend({
    templateName: 'import-contact-table',
    className: 'import-contact-table',
    template: $('#import-contact-table').html(),
    render_attributes() {
      console.log('This model import contact view!!!! ', this.model)
      return {
        'send-message': i18n('sendMessage'),
        model: this.model,
      };
    },

    initialize(options) {
      this.render();
      if (options){
        this.prepareDataXml(options.contact_data, true)
      }else{
        this.createEmptyMessage();
      }
    },
    events: {
      'keyup #search-table': 'searchTable',
      'click #ferting-button': 'closeContact',
      'click #import-button': 'importContact',
      'change #contact-import-file-input': 'onChoseContactsFile',
    },
    createEmptyMessage () {
      const divNoContacts = document.createElement('div');
      divNoContacts.className = 'divNoContacts';
      divNoContacts.innerText = 'You have not imported your contacts.'
      this.$('#contactTable').append(divNoContacts)
    },
    createTable (contactListXml){
      const table = document.createElement('table');
      table.className = 'sortable';

      const headerTexts = ['#','name', 'surname', 'position', 'email', 'kunde/admin', 'invitation status', 'profile', 'actions'];
      if(table){
        const header = table.createTHead();
        const row = header.insertRow();
        headerTexts.forEach((element, index) => {
          const cell = document.createElement('th');
          if(index === 0 || index === 5 ||  index === 7|| index === 8){
            cell.className = 'no-sort';
          }
          cell.innerHTML = element;
          row.appendChild(cell)
        });
      }
      const list =  contactListXml.children;
      const tbody = document.createElement('tbody');
      tbody.setAttribute('id', 'myTable');
      for (let i = 0; i < contactListXml.children.length; i++) {
        const contact = contactListXml.children.item(i);
        const tableRow = document.createElement('tr');
        tbody.appendChild(tableRow);
        for (let j = 0; j < headerTexts.length; j++) {
          const cellTd = document.createElement('td');
          if(contact.getElementsByTagName(headerTexts[j])[0]){
            const cell = contact.getElementsByTagName(headerTexts[j])[0].textContent;
            const cellTdContent = document.createTextNode(cell);
            cellTd.appendChild(cellTdContent);
          }else {
            const id = contact.getElementsByTagName('phone')[0].textContent;
            this.appendElemtns(j, cellTd, id)

          }
          tableRow.appendChild(cellTd);
        }
      }
      //Append content
      table.appendChild(tbody)
      this.$('#contactTable').append(table);

      this.$('table').tablesort();
    },
    searchTable(e){
      let value = e.target.value;
      $('#myTable tr').filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    closeContact(){
      this.$el.trigger('openInbox');
    },
    importContact(e){
      if (e.target.tagName === 'INPUT') return;
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      this.$('#contact-import-file-input').click()
    },
    async onChoseContactsFile() {
      this.contactsData = null;
      const input = this.$('#contact-import-file-input');
      let files = input.get(0).files;
      let file = files[0];
      this.$('#contact-import-file-error').text('');


      if (file) {
          this.openModal('import');
          this.$('#acept-import-contact').click(()=>{
            this.acceptImportContact(file);
            this.$('#modalContact').addClass('hidden');
          })
          this.$('#cancel-import-contact').click(()=>{
            this.$('#modalContact').addClass('hidden');
            input.val('');
            file = null;
          })
      }
      if (!file) this.contactsData = null;
      console.log('Import file chose', files);
    },
    async acceptImportContact(file){
      try {
        const xml = await readFileAsText(file);
        // console.log(xml);
        checkValidXML(xml);
        this.contactsData = xml;
        const aux = this.contactsData.toString().replace(/\r|\n|\t/g, '');
        this.contactsData = {
          'contact_data':  aux.toString().replace(/>\s*/g, '>'),
        }
        const companyNumber = textsecure.storage.get('companyNumber', null);
        await updateContact(companyNumber, this.contactsData);
      } catch (err) {
        // TODO: show invalid xml error
        console.error(err);
        input.val('');
        this.$('#contact-import-file-error').text(i18n('invalidXML'));
        file = null;
      }
      this.refreshTable() 
    },
    openModal(type){
      const modal = this.$('#modalContact');
      modal.removeClass('hidden');
      modal.empty();
      if(type === 'import'){
         const aceptButton  = document.createElement('button'); 
         aceptButton.innerHTML='Accept'
         aceptButton.id = 'acept-import-contact';
         aceptButton.className = 'buttonsModal';
         const cancelButton  = document.createElement('button'); 
         cancelButton.innerHTML='Cancel';
         cancelButton.id = 'cancel-import-contact';
         cancelButton.className = 'buttonsModal';
          modal.append(aceptButton);
          modal.append(cancelButton);
      }else if(type === 'remove'){

      }else if(type === 'invite'){

      }
      
    },
    async refreshTable(){
      this.$('#contactTable').empty();
      this.prepareDataXml(this.contactsData.contact_data, true)
    },
    appendElemtns(j, cellTd, id){
      switch (j) {
        case 0: {
          const checkbox = document.createElement('input'); 
          checkbox.type = 'checkbox'; 
          checkbox.name = '#'; 
          checkbox.value = '#'; 
          checkbox.id = '#'; 
          cellTd.appendChild(checkbox)
          break;
        }
        // eslint-disable-next-line no-case-declarations
        case 5:
          const checkboxKunde = document.createElement('input'); 
          checkboxKunde.type = 'radio'; 
          checkboxKunde.name = 'client'; 
          checkboxKunde.value = 'client'; 
          checkboxKunde.id = 'client'; 
          const checkboxAdmin = document.createElement('input'); 
          checkboxAdmin.type = 'radio'; 
          checkboxAdmin.name = 'admin'; 
          checkboxAdmin.value = 'admin'; 
          checkboxAdmin.id = 'admin'; 
          const labelKunde = document.createElement('label'); 
          labelKunde.appendChild(document.createTextNode(i18n('clientButton'))); 
          const labelAdmin = document.createElement('label'); 
          labelAdmin.appendChild(document.createTextNode(i18n('adminButton'))); 
          const breakLine = document.createElement('br')
          cellTd.appendChild(checkboxKunde);
          cellTd.appendChild(labelKunde);
          cellTd.appendChild(breakLine);
          cellTd.appendChild(checkboxAdmin);
          cellTd.appendChild(labelAdmin);
          break;
        // eslint-disable-next-line no-case-declarations
        case 6:
          const button = document.createElement('button');
          button.innerHTML = i18n('sendAnInvitation');
          button.onclick = () => {
            this.sendInvitation(id)
          }
          cellTd.appendChild(button);
          break;
        // eslint-disable-next-line no-case-declarations
        case 8:
          // eslint-disable-next-line no-case-declarations
          const buttonEdit = document.createElement('img');
          buttonEdit.setAttribute('src', 'images/icons/edit-contact-list.svg')
          buttonEdit.classList = 'editIcon'
          buttonEdit.onclick = () => {
            this.editContact(id)
          }
          const buttonRemove = document.createElement('img');
          buttonRemove.setAttribute('src', 'images/icons/x-contact-list.svg')
          buttonRemove.classList = 'editIcon';
          buttonRemove.onclick = () => {
            this.removeContact(id)
          }
          cellTd.appendChild(buttonEdit);
          cellTd.appendChild(buttonRemove);
          break;
        default:
          break;
      }
    },
    sendInvitation(id){
      console.log(id, "click function external");
      this.openModal('invite');
    },
    async removeContact(id){
      console.log(id, "remove contact");
      this.openModal('remove');
      const  xml =  await this.getXmlFile();
      const xmlData = this.prepareDataXml(xml, false)
      const positionXML = this.findUserXml(id, xmlData)
      const  y = xmlData.getElementsByTagName('contact')[positionXML];
      xmlData.removeChild(y);
      console.log(xmlData, "xmlllllllll")
      const dataToUpdate = this.prepareDataToUpdate(xmlData);
      console.log(dataToUpdate, "data to updateeeeeeeee")
      //TODO CREATE FUNCTION TO CONVERT DATA AND UPDATE ON DB
    },
    async editContact(id){
      this.openModal('edit');
      const  xml =  await this.getXmlFile();
      const xmlData = this.prepareDataXml(xml, false)
      const positionXML = this.findUserXml(id, xmlData)
      const userInfo = xmlData.children.item(positionXML);
      // xmlData.getElementsByTagName("surname")[positionXML].childNodes[0].nodeValue = "new content" ; //// USE THAT FOR MODIFY ELEMENT
      const cln = userInfo.cloneNode(true);
      this.createEditPanel(cln, xmlData, positionXML)
      
    },
    createEditPanel(cln, xmlData, positionXML){
      const divMainHeaderEdit = document.createElement('div');
      divMainHeaderEdit.className = 'divModalHeader';
      const pUserName = document.createElement('p');
      pUserName.innerText = xmlData.getElementsByTagName('name')[positionXML].childNodes[0].nodeValue + ' ' + xmlData.getElementsByTagName('surname')[positionXML].childNodes[0].nodeValue
      pUserName.className = 'titleHeaderEdit';
      const pUserPhone = document.createElement('p');
      pUserPhone.innerText = xmlData.getElementsByTagName('phone')[positionXML].childNodes[0].nodeValue
      pUserPhone.className = 'titleHeaderEdit';
      const imageClosePanel = document.createElement('img');
      imageClosePanel.className = 'imageClosePanel';
      imageClosePanel.src = 'images/icons/x-contact-list.svg'
      imageClosePanel.onclick = () => {
        this.$('#modalContact').addClass('hidden');
      }


      divMainHeaderEdit.appendChild(pUserName); 
      divMainHeaderEdit.appendChild(pUserPhone); 
      divMainHeaderEdit.appendChild(imageClosePanel); 

      const divMainContentEdit = document.createElement('div');
      divMainContentEdit.className = 'divMainContentEdit';

      const divEditVorname = document.createElement('div');
      divEditVorname.className = 'divEdit';
      const labelField = document.createElement('span');
      labelField.className = 'labelEdit';
      labelField.innerText = 'Vorname';
      const inputEditVorname = document.createElement('input');
      inputEditVorname.type = 'text';
      inputEditVorname.value = xmlData.getElementsByTagName('name')[positionXML].childNodes[0].nodeValue;
      divEditVorname.appendChild(labelField)
      divEditVorname.appendChild(inputEditVorname)

      const divEditNachname = document.createElement('div');
      divEditNachname.className = 'divEdit';
      const labelNachName = document.createElement('span');
      labelNachName.className = 'labelEdit';
      labelNachName.innerText = 'Nachname';
      const inputNachName = document.createElement('input');
      inputNachName.type = 'text';
      inputNachName.value = xmlData.getElementsByTagName('surname')[positionXML].childNodes[0].nodeValue;
      divEditNachname.appendChild(labelNachName)
      divEditNachname.appendChild(inputNachName)

      const divEditPosition = document.createElement('div');
      divEditPosition.className = 'divEdit';
      const labelPosition = document.createElement('span');
      labelPosition.className = 'labelEdit';
      labelPosition.innerText = 'Position';
      const inputPosition = document.createElement('input');
      inputPosition.type = 'text';
      inputPosition.value = xmlData.getElementsByTagName('position')[positionXML].childNodes[0].nodeValue;
      divEditPosition.appendChild(labelPosition)
      divEditPosition.appendChild(inputPosition)

      const divTelephone = document.createElement('div');
      divTelephone.className = 'divEdit';
      const labelTelephone = document.createElement('span');
      labelTelephone.className = 'labelEdit';
      labelTelephone.innerText = 'Telefonnummer';
      const inputTelephone = document.createElement('input');
      inputTelephone.type = 'text';
      inputTelephone.readOnly = true;
      inputTelephone.value = xmlData.getElementsByTagName('phone')[positionXML].childNodes[0].nodeValue;
      divTelephone.appendChild(labelTelephone)
      divTelephone.appendChild(inputTelephone)

      const divEmail = document.createElement('div');
      divEmail.className = 'divEdit';
      const labelEmail = document.createElement('span');
      labelEmail.className = 'labelEdit';
      labelEmail.innerText = 'Email'
      const inputEmail = document.createElement('input');
      inputEmail.type = 'text';
      inputEmail.value = xmlData.getElementsByTagName('email')[positionXML].childNodes[0].nodeValue;
      divEmail.appendChild(labelEmail)
      divEmail.appendChild(inputEmail)

      const divRadioButtons = document.createElement('div');
      divRadioButtons.className = 'divEdit';
      const radioKunde = document.createElement('input');
      radioKunde.type = 'radio';
      radioKunde.name = 'radioAdmin'
      const labelKunde = document.createElement('span');
      labelKunde.className = 'labelRadios';
      labelKunde.innerText = 'Kunde'
      const radioAdmin = document.createElement('input');
      radioAdmin.type = 'radio';
      radioAdmin.name = 'radioAdmin'
      const labelAdmin = document.createElement('span');
      labelAdmin.className = 'labelRadios';
      labelAdmin.innerText = 'Admin'
      divRadioButtons.appendChild(radioKunde);
      divRadioButtons.appendChild(labelKunde);
      divRadioButtons.appendChild(radioAdmin);
      divRadioButtons.appendChild(labelAdmin);

      const divStatus = document.createElement('div');
      divStatus.className = 'divEdit';
      const labelStatus = document.createElement('span');
      labelStatus.className = 'labelEdit';
      labelStatus.innerText = 'Einladungstatus'
      const buttonStatus = document.createElement('button');
      buttonStatus.innerText = 'Einladung Senden';
      divStatus.appendChild(labelStatus)
      divStatus.appendChild(buttonStatus)

      const divNutzer = document.createElement('div');
      divNutzer.className = 'divEdit';
      const labelNutzer = document.createElement('span');
      labelNutzer.className = 'labelEdit';
      labelNutzer.innerText = 'Nutzer'
      const divUserPrev = document.createElement('div');
      divUserPrev.className = 'divUserPrev';
      divUserPrev.innerHTML = '<img src="images/header-chat.png" /> <span> ' + xmlData.getElementsByTagName('name')[positionXML].childNodes[0].nodeValue + ' ' + xmlData.getElementsByTagName('surname')[positionXML].childNodes[0].nodeValue + '</span>';
      divNutzer.appendChild(labelNutzer)
      divNutzer.appendChild(divUserPrev)

      const buttonSaveChanges = document.createElement('button');
      buttonSaveChanges.classList = 'buttonSave buttonsModal';
      buttonSaveChanges.innerText = 'Save';
      buttonSaveChanges.onclick = () => {
        xmlData.getElementsByTagName('name')[positionXML].childNodes[0].nodeValue = inputEditVorname.value
        xmlData.getElementsByTagName('surname')[positionXML].childNodes[0].nodeValue = inputNachName.value
        xmlData.getElementsByTagName('position')[positionXML].childNodes[0].nodeValue = inputPosition.value
        xmlData.getElementsByTagName('email')[positionXML].childNodes[0].nodeValue = inputEmail.value
        const dataToUpdate = this.prepareDataToUpdate(xmlData);
        console.log(dataToUpdate)
      }

      divMainContentEdit.appendChild(divEditVorname);
      divMainContentEdit.appendChild(divEditNachname);
      divMainContentEdit.appendChild(divEditPosition);
      divMainContentEdit.appendChild(divTelephone);
      divMainContentEdit.appendChild(divEmail);
      divMainContentEdit.appendChild(divRadioButtons);
      divMainContentEdit.appendChild(divStatus);
      divMainContentEdit.appendChild(divNutzer);
      divMainContentEdit.appendChild(buttonSaveChanges);

      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
    },
    //  function for xml
    findUserXml(id, xmlData){
      let position = null;
      for (let i = 0; i < xmlData.children.length; i++) {
        const contact = xmlData.children.item(i);
        const phone =  contact.getElementsByTagName('phone')[0].textContent
       if(phone === id){
         position = i
         return position; // only first position TODO LIST OF POSITION FOR MULTI SELECT
       }
      }
      return position;
    },
    async getXmlFile(){
      let xml = localStorage.getItem('ContactList')
      if(!xml){
        const companyNumber = textsecure.storage.get('companyNumber', null);
         xml = await getContactXml(companyNumber);
        localStorage.setItem('ContactList', JSON.stringify(xml));
      }
      return xml
    },
    prepareDataXml(contact_data, createTable){
      const parser = new DOMParser();
      let  xmlRes;
      try {
        // WebKit returns null on unsupported types
        xmlRes = parser.parseFromString(contact_data, 'text/xml');
      } catch (ex) {
        console.log(ex)
      }
      document.xmlRes = xmlRes;
      const contactListXml = xmlRes.children[0];
      if(createTable){
        this.createTable(contactListXml)
      }else {
        return contactListXml;
      }
    },
    prepareDataToUpdate (xmlData){
      const dataString = xmlData.outerHTML
      console.log(xmlData.outerHTML, 'outerrrr')
      const aux = dataString.toString().replace(/\r|\n|\t/g, '');
      const data = {
        'contact_data':  aux.toString().replace(/>\s*/g, '>'),
      }
      return data
    },
  });



})();
