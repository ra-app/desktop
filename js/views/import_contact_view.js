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
      'click #hinzufügen-button': 'importIndividualContact',
      'click #import-button': 'importContact',
      'change #contact-import-file-input': 'onChoseContactsFile',
      'keyup  #addNameInput, #addSurnameInput, #addPositionInput, #addTelephoneInput, #addEmailInput':'activateButtonAddNewContact',
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
            this.appendElemtns(j, cellTd, id, contact)

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
            this.$('#modalOverLay').addClass('hidden');
          })
          this.$('#cancel-import-contact').click(()=>{
            this.$('#modalOverLay').addClass('hidden');
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
      modal.empty();
      this.$('#modalOverLay').removeClass('hidden');
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
      }
      
    },
    closeModal(){

      this.$('#modalOverLay').addClass('hidden');
    },
    async refreshTable(){
      this.$('#contactTable').empty();
      this.prepareDataXml(this.contactsData.contact_data, true)
    },
    appendElemtns(j, cellTd, id, contact){
      let userType;
          if ( contact.getElementsByTagName('type')[0] ){
            userType = contact.getElementsByTagName('type')[0].textContent;
          }else{
            userType = 'none'
          }
      switch (j) {
        case 0: {
          const checkbox = document.createElement('input'); 
          checkbox.type = 'checkbox'; 
          checkbox.name = '#'; 
          checkbox.value = '#'; 
          checkbox.className = 'checkbox-user'; 
          checkbox.id = `checkbox-${id}`; 
          if ( userType === 'none' ){
            checkbox.disabled = true;
          }
          checkbox.addEventListener('click', () => {
            if (this.$('input:checkbox:checked').length > 1 ){
              this.$('.buttonSendInvitation').addClass('disabled')
              this.$('.buttonSendInvitation').disabled = false;
            }
          })
          cellTd.appendChild(checkbox)
          break;
        }
        // eslint-disable-next-line no-case-declarations
        case 5:
          const spanSwitchKunde = document.createElement('span');
          spanSwitchKunde.className = 'spanSwitch';
          spanSwitchKunde.innerText = 'Kunde';

          const divSwitch = document.createElement('div');
          divSwitch.className = 'switch-toggle switch-3 switch-candy';

          const inputKunde = document.createElement('input');
          inputKunde.type = 'radio';
          inputKunde.name = `state-d-${id}`
          inputKunde.id = `kunde-${id}`;
          
          if ( userType === 'client' ){
            inputKunde.checked = true;
            inputKunde.setAttribute('checked', 'checked')
          }
          inputKunde.addEventListener('click', () => {
            if ( inputKunde.checked ){
              if ( this.$('input:checkbox:checked').length <= 1 ){
                document.getElementById(`buttonSendInvitation-${id}`).disabled = false
                document.getElementById(`checkbox-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('disabled');
              }
            }
          })
          const labelKunde = document.createElement('label');
          labelKunde.setAttribute('for', `kunde-${id}`);
          labelKunde.innerHTML = '&nbsp;';

          const inputNone = document.createElement('input');
          inputNone.type = 'radio';
          inputNone.name = `state-d-${id}`
          inputNone.id = `none-${id}`;
          if ( userType == 'none' ){
            inputNone.checked = true;
            inputNone.setAttribute('checked', 'checked')
          }
          inputNone.addEventListener('click', () => {
            if ( inputNone.checked ){
              document.getElementById(`buttonSendInvitation-${id}`).disabled = true
              document.getElementById(`checkbox-${id}`).disabled = true
              document.getElementById(`checkbox-${id}`).checked = false
              document.getElementById(`buttonSendInvitation-${id}`).classList.add('disabled');
            }
          })
          const labelNone = document.createElement('label');
          labelNone.setAttribute('for', `none-${id}`);
          labelNone.innerHTML = '&nbsp;';

          const inputAdmin = document.createElement('input');
          inputAdmin.type = 'radio';
          inputAdmin.name = `state-d-${id}`
          inputAdmin.id = `admin-${id}`;
          inputAdmin.addEventListener('click', () => {
            if ( inputAdmin.checked ){
              if ( this.$('input:checkbox:checked').length ){
                document.getElementById(`checkbox-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('disabled');
              }
            }
          })
          if ( userType == 'admin' ){
            inputAdmin.checked = true;
            inputAdmin.setAttribute('checked', 'checked')
          }
          const labelAdmin = document.createElement('label');
          labelAdmin.setAttribute('for', `admin-${id}`);
          labelAdmin.innerHTML = '&nbsp;';

          const aLabel = document.createElement('a');

          const spanSwitchAdmin = document.createElement('span');
          spanSwitchAdmin.className = 'spanSwitch admin';
          spanSwitchAdmin.innerText = 'Admin';


          divSwitch.appendChild(inputKunde);
          divSwitch.appendChild(labelKunde);
          divSwitch.appendChild(inputNone);
          divSwitch.appendChild(labelNone);
          divSwitch.appendChild(inputAdmin);
          divSwitch.appendChild(labelAdmin);
          divSwitch.appendChild(aLabel);

          cellTd.appendChild(spanSwitchKunde)
          cellTd.appendChild(divSwitch);
          cellTd.appendChild(spanSwitchAdmin);
          break;
        // eslint-disable-next-line no-case-declarations
        case 6:
          const button = document.createElement('button');
          button.id = `buttonSendInvitation-${id}`
          button.classList.add('buttonSendInvitation')
          button.innerHTML = i18n('sendAnInvitation');
          if ( userType === 'none' ){
            button.classList.add('disabled');
            button.disabled = true;
          }
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
      this.panelRemoveContact(id, xml)
    },

    panelRemoveContact(id, xml){
      const divMainHeaderEdit = document.createElement('div');
      divMainHeaderEdit.className = 'divModalHeader';
      const imageClosePanel = document.createElement('img');
      imageClosePanel.className = 'imageClosePanel';
      imageClosePanel.src = 'images/icons/x-contact-list.svg'
      imageClosePanel.onclick = () => {
        this.closeModal();
      }
      divMainHeaderEdit.appendChild(imageClosePanel); 
      
      const divMainContentEdit = document.createElement('div');
      divMainContentEdit.className = 'divMainContentEdit divRemoveContact';
      divMainContentEdit.innerHTML = 'Are you sure you want to remove this contact ? <br>'
      const buttonRemoveContact = document.createElement('button');
      buttonRemoveContact.classList = 'marginTop20 buttonsModal';
      buttonRemoveContact.innerText = 'Accept';
      buttonRemoveContact.onclick = () => {
       
        const xmlData = this.prepareDataXml(xml, false)
        const positionXML = this.findUserXml(id, xmlData)
        const  y = xmlData.getElementsByTagName('contact')[positionXML];
        xmlData.removeChild(y);
        const dataToUpdate = this.prepareDataToUpdate(xmlData);
        this.contactsData = dataToUpdate;
        this.updateXmlDB(dataToUpdate);
        this.closeModal();
        this.refreshTable();
      }
      divMainContentEdit.appendChild(buttonRemoveContact);
      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
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
        this.closeModal();
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
      let userTypeEdit;
      if ( xmlData.getElementsByTagName('type')[positionXML] ){
        userTypeEdit = xmlData.getElementsByTagName('type')[positionXML].childNodes[0].nodeValue
      }else{
        userTypeEdit = 'none'
      }

      const spanSwitchKunde = document.createElement('span');
      const id = xmlData.getElementsByTagName('phone')[positionXML].childNodes[0].nodeValue;
      spanSwitchKunde.className = 'spanSwitch';
      spanSwitchKunde.innerText = 'Kunde';

      const divSwitch = document.createElement('div');
      divSwitch.className = 'switch-toggle switch-3 switch-candy';

      const inputKundeEdit = document.createElement('input');
      inputKundeEdit.type = 'radio';
      inputKundeEdit.name = `edit-state-d-${id}`
      inputKundeEdit.id = `edit-kunde-${id}`;
      if ( userTypeEdit === 'client' ){
        inputKundeEdit.checked = true;
        inputKundeEdit.setAttribute('checked', 'checked')
      }
      const labelKunde = document.createElement('label');
      labelKunde.setAttribute('for', `edit-kunde-${id}`);
      labelKunde.innerHTML = '&nbsp;';

      const inputNoneEdit = document.createElement('input');
      inputNoneEdit.type = 'radio';
      inputNoneEdit.name = `edit-state-d-${id}`
      inputNoneEdit.id = `edit-none-${id}`;
      if ( userTypeEdit == 'none' ){
        inputNoneEdit.checked = true;
        inputNoneEdit.setAttribute('checked', 'checked')
      }
      const labelNone = document.createElement('label');
      labelNone.setAttribute('for', `edit-none-${id}`);
      labelNone.innerHTML = '&nbsp;';

      const inputAdminEdit = document.createElement('input');
      inputAdminEdit.type = 'radio';
      inputAdminEdit.name = `edit-state-d-${id}`
      inputAdminEdit.id = `edit-admin-${id}`;
      if ( userTypeEdit == 'admin' ){
        inputAdminEdit.checked = true;
        inputAdminEdit.setAttribute('checked', 'checked')
      }
      const labelAdmin = document.createElement('label');
      labelAdmin.setAttribute('for', `edit-admin-${id}`);
      labelAdmin.innerHTML = '&nbsp;';

      const aLabel = document.createElement('a');

      const spanSwitchAdmin = document.createElement('span');
      spanSwitchAdmin.className = 'spanSwitch admin';
      spanSwitchAdmin.innerText = 'Admin';


      divSwitch.appendChild(inputKundeEdit);
      divSwitch.appendChild(labelKunde);
      divSwitch.appendChild(inputNoneEdit);
      divSwitch.appendChild(labelNone);
      divSwitch.appendChild(inputAdminEdit);
      divSwitch.appendChild(labelAdmin);
      divSwitch.appendChild(aLabel);

      divRadioButtons.appendChild(spanSwitchKunde);
      divRadioButtons.appendChild(divSwitch);
      divRadioButtons.appendChild(spanSwitchAdmin)


      // const divStatus = document.createElement('div');
      // divStatus.className = 'divEdit';
      // const labelStatus = document.createElement('span');
      // labelStatus.className = 'labelEdit';
      // labelStatus.innerText = 'Einladungstatus'
      // const buttonStatus = document.createElement('button');
      // buttonStatus.innerText = 'Einladung Senden';
      // divStatus.appendChild(labelStatus)
      // divStatus.appendChild(buttonStatus)

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
        if(!xmlData.getElementsByTagName('type')[positionXML]){
          if(inputKundeEdit.checked){
            const newElement=  document.createElementNS('', 'type');
            const newText = document.createTextNode('client');
            newElement.appendChild(newText);
            xmlData.getElementsByTagName('contact')[positionXML].appendChild(newElement)
          }
          if(inputAdminEdit.checked){
            const newElement=  document.createElementNS('', 'type');
            const newText = document.createTextNode('admin');
            newElement.appendChild(newText);
            xmlData.getElementsByTagName('contact')[positionXML].appendChild(newElement)
          }
        }else {
          if(inputKundeEdit.checked){
            xmlData.getElementsByTagName('type')[positionXML].childNodes[0].nodeValue = 'client'
          }
          if(inputAdminEdit.checked){
            xmlData.getElementsByTagName('type')[positionXML].childNodes[0].nodeValue = 'admin'
          }
        }
        const dataToUpdate = this.prepareDataToUpdate(xmlData);
        this.contactsData = dataToUpdate;
        console.log(this.contactsData, "dataaaaaaaaaaaaaaaa")
        this.updateXmlDB(dataToUpdate);
        this.closeModal();
        this.refreshTable();

        
        console.log(dataToUpdate)
      }

      divMainContentEdit.appendChild(divEditVorname);
      divMainContentEdit.appendChild(divEditNachname);
      divMainContentEdit.appendChild(divEditPosition);
      divMainContentEdit.appendChild(divTelephone);
      divMainContentEdit.appendChild(divEmail);
      divMainContentEdit.appendChild(divRadioButtons);
      // divMainContentEdit.appendChild(divStatus);
      divMainContentEdit.appendChild(divNutzer);
      divMainContentEdit.appendChild(buttonSaveChanges);

      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
    },
    async importIndividualContact(){
      this.openModal();
      const  xml =  await this.getXmlFile();
      const xmlData = this.prepareDataXml(xml, false)
      this.createAddPanel(xmlData);
    },
    createAddPanel(xmlData){
      const divMainHeaderEdit = document.createElement('div');
      divMainHeaderEdit.className = 'divModalHeader';
      const pUserName = document.createElement('p');
      pUserName.className = 'titleHeaderEdit';
      const pUserPhone = document.createElement('p');
      pUserPhone.className = 'titleHeaderEdit';
      const imageClosePanel = document.createElement('img');
      imageClosePanel.className = 'imageClosePanel';
      imageClosePanel.src = 'images/icons/x-contact-list.svg'
      imageClosePanel.onclick = () => {
        this.closeModal();
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
      inputEditVorname.id = 'addNameInput';
      inputEditVorname.placeholder = 'Vorname'
      divEditVorname.appendChild(labelField)
      divEditVorname.appendChild(inputEditVorname)

      const divEditNachname = document.createElement('div');
      divEditNachname.className = 'divEdit';
      const labelNachName = document.createElement('span');
      labelNachName.className = 'labelEdit';
      labelNachName.innerText = 'Nachname';
      const inputNachName = document.createElement('input');
      inputNachName.type = 'text';
      inputNachName.placeholder = 'Nachname';
      inputNachName.id = 'addSurnameInput';
      divEditNachname.appendChild(labelNachName)
      divEditNachname.appendChild(inputNachName)

      const divEditPosition = document.createElement('div');
      divEditPosition.className = 'divEdit';
      const labelPosition = document.createElement('span');
      labelPosition.className = 'labelEdit';
      labelPosition.innerText = 'Position';
      const inputPosition = document.createElement('input');
      inputPosition.type = 'text';
      inputPosition.placeholder = 'Position';
      inputPosition.id = 'addPositionInput';
      divEditPosition.appendChild(labelPosition)
      divEditPosition.appendChild(inputPosition)

      const divTelephone = document.createElement('div');
      divTelephone.className = 'divEdit';
      const labelTelephone = document.createElement('span');
      labelTelephone.className = 'labelEdit';
      labelTelephone.innerText = 'Telefonnummer';
      const inputTelephone = document.createElement('input');
      inputTelephone.type = 'text';
      inputTelephone.placeholder = 'Telefonnummer';
      inputTelephone.id = 'addTelephoneInput';
      divTelephone.appendChild(labelTelephone)
      divTelephone.appendChild(inputTelephone)

      const divEmail = document.createElement('div');
      divEmail.className = 'divEdit';
      const labelEmail = document.createElement('span');
      labelEmail.className = 'labelEdit';
      labelEmail.innerText = 'Email'
      const inputEmail = document.createElement('input');
      inputEmail.type = 'text';
      inputEmail.placeholder = 'Email';
      inputEmail.id = 'addEmailInput';
      divEmail.appendChild(labelEmail)
      divEmail.appendChild(inputEmail)


      const divNutzer = document.createElement('div');
      divNutzer.className = 'divEdit';
      const labelNutzer = document.createElement('span');
      labelNutzer.className = 'labelEdit';
      labelNutzer.innerText = 'Nutzer'
      const divUserPrev = document.createElement('div');
      divUserPrev.className = 'divUserPrev';
      divUserPrev.innerHTML = '<img src="images/header-chat.png" /> '
      divNutzer.appendChild(labelNutzer)
      divNutzer.appendChild(divUserPrev)

      const buttonSaveChanges = document.createElement('button');
      buttonSaveChanges.classList = 'buttonSave buttonsModal disabled';
      buttonSaveChanges.innerText = 'Save';
      buttonSaveChanges.id= 'addNewContactButton'
      buttonSaveChanges.onclick = () => {

        // creating a news element
        const parentElement=  document.createElementNS('', 'contact');

        const nameElement = document.createElementNS('', 'name');
        const nameText = document.createTextNode(inputEditVorname.value);
        nameElement.appendChild(nameText)

        const surnameElement = document.createElementNS('', 'surname');
        const surnameText = document.createTextNode(inputNachName.value);
        surnameElement.appendChild(surnameText)

        const positionElement = document.createElementNS('', 'position');
        const positionText = document.createTextNode(inputPosition.value);
        positionElement.appendChild(positionText)

        const telephoneElement = document.createElementNS('', 'phone');
        const telephoneText = document.createTextNode(inputTelephone.value);
        telephoneElement.appendChild(telephoneText)

        const emailElement = document.createElementNS('', 'email');
        const emailText = document.createTextNode(inputEmail.value);
        emailElement.appendChild(emailText)

        const tsElement = document.createElementNS('', 'ts');
        const tsText = document.createTextNode('');
        tsElement.appendChild(tsText)

        // append parent element
        parentElement.appendChild(nameElement);
        parentElement.appendChild(surnameElement);
        parentElement.appendChild(positionElement);
        parentElement.appendChild(emailElement);
        parentElement.appendChild(telephoneElement);
        parentElement.appendChild(tsElement);

        // prepare data and save on DB
        xmlData.appendChild(parentElement);
        const dataToUpdate = this.prepareDataToUpdate(xmlData);
        this.contactsData = dataToUpdate;
        this.updateXmlDB(dataToUpdate);
        this.closeModal();
        this.refreshTable();

      }

      divMainContentEdit.appendChild(divEditVorname);
      divMainContentEdit.appendChild(divEditNachname);
      divMainContentEdit.appendChild(divEditPosition);
      divMainContentEdit.appendChild(divTelephone);
      divMainContentEdit.appendChild(divEmail);
      // divMainContentEdit.appendChild(divRadioButtons);
      // divMainContentEdit.appendChild(divStatus);
      divMainContentEdit.appendChild(divNutzer);
      divMainContentEdit.appendChild(buttonSaveChanges);

      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
    },
    activateButtonAddNewContact(){
      const name = this.$el.find('#addNameInput')[0].value.length;
      const surname = this.$el.find('#addSurnameInput')[0].value.length;
      const position = this.$el.find('#addPositionInput')[0].value.length;
      const phone = this.$el.find('#addTelephoneInput')[0].value.length;
      const email = this.$el.find('#addEmailInput')[0].value.length;
      const button = this.$el.find('#addNewContactButton');
      if (
        name > 0 &&
        surname > 0 &&
        position > 0 &&
        phone > 0 &&
        email > 0
      ) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    //  ****************************************************function for xml*************************************************
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
    async updateXmlDB(data){
      const companyNumber = textsecure.storage.get('companyNumber', null);
      await updateContact(companyNumber, data);
      localStorage.setItem('ContactList', data.contact_data);
    },
  });



})();
