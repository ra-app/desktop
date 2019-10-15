/* global Whisper: false */
/* global textsecure: false */

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};

  const contactsData = null
  var dataUsersToUpdate = [];
  var dataUsersToInvitate = [];


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
      'click #sendMultipleInvitations': 'importMultiContact',
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
    async closeContact(){
      // const  xml =  await this.getXmlFile();
      // const xmlData = this.prepareDataXml(xml, false)
      // Object.keys(dataUsersToUpdate).forEach(element => {
      //   const data = this.prepareDataXml(dataUsersToUpdate[element].cell)
      //   const positionXML = this.findUserXml(dataUsersToUpdate[element].userid, xmlData)
      //   if(data.getElementsByTagName('type')[0]){
      //     data.getElementsByTagName('type')[0].childNodes[0].nodeValue = dataUsersToUpdate[element].position;
      //   }else {
      //     const typeElement = document.createElementNS('', 'type');
      //     const typeText = document.createTextNode(dataUsersToUpdate[element].position);
      //     typeElement.appendChild(typeText)
      //     data.appendChild(typeElement)
      //   }
      //   xmlData.replaceChild(data,xmlData.getElementsByTagName('contact')[positionXML]);
      // });
      // const dataToUpdate = this.prepareDataToUpdate(xmlData);
      // this.contactsData = dataToUpdate;
      // this.updateXmlDB(dataToUpdate);
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
        this.updateXmlDB(this.contactsData)
        // const companyNumber = textsecure.storage.get('companyNumber', null);
        // await updateContact(companyNumber, this.contactsData);
        // localStorage.setItem('ContactList', contactsData.contact_data);
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
              this.$('.buttonSendInvitation').disabled = true;
              this.$('#sendMultipleInvitations').removeClass('disabled')
              this.$('#sendMultipleInvitations').prop('disabled', false)
            }else if (this.$('input:checkbox:checked').length <= 1 ){
              this.$('.buttonSendInvitation:not(.none)').removeClass('disabled');
              this.$('.buttonSendInvitation:not(.none)').disabled = false;
              this.$('#sendMultipleInvitations').addClass('disabled');
              this.$('#sendMultipleInvitations').prop('disabled', true)
            }
            // add element to object
            if(checkbox.checked){
              dataUsersToInvitate[id] ={
                userid: id,
                cell: contact.outerHTML,
              }
            }else {
              delete dataUsersToInvitate[id];
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
       
          const labelNone = document.createElement('label');
          labelNone.setAttribute('for', `none-${id}`);
          labelNone.innerHTML = '&nbsp;';

          const inputAdmin = document.createElement('input');
          inputAdmin.type = 'radio';
          inputAdmin.name = `state-d-${id}`
          inputAdmin.id = `admin-${id}`;
          
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

          inputKunde.addEventListener('click', () => {
            if ( inputKunde.checked ){
              dataUsersToUpdate[id] = {
                position: 'kunde',
                userid: id,
                cell: contact.outerHTML,
              }
              document.getElementById(`admin-${id}`).checked = false;
              document.getElementById(`none-${id}`).checked = false;
              document.getElementById(`admin-${id}`).removeAttribute('cheked');
              document.getElementById(`none-${id}`).removeAttribute('cheked');


              if ( this.$('input:checkbox:checked').length <= 1 ){
                document.getElementById(`buttonSendInvitation-${id}`).disabled = false
                document.getElementById(`checkbox-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('disabled');
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('none');
              }
            }
          })
          inputNone.addEventListener('click', () => {
            if ( inputNone.checked ){
              dataUsersToUpdate[id] = {
                position: 'none',
                userid: id,
                cell: contact.outerHTML,
              }
              document.getElementById(`admin-${id}`).checked = false;
              document.getElementById(`kunde-${id}`).checked = false;
              document.getElementById(`admin-${id}`).removeAttribute('cheked');
              document.getElementById(`kunde-${id}`).removeAttribute('cheked');

              document.getElementById(`buttonSendInvitation-${id}`).disabled = true
              document.getElementById(`checkbox-${id}`).disabled = true
              document.getElementById(`checkbox-${id}`).checked = false
              document.getElementById(`buttonSendInvitation-${id}`).classList.add('disabled');
              document.getElementById(`buttonSendInvitation-${id}`).classList.add('none');
            }
          })
          inputAdmin.addEventListener('click', () => {
            if ( inputAdmin.checked ){
              dataUsersToUpdate[id] ={
                position: 'admin',
                userid: id,
                cell: contact.outerHTML,
              }
              document.getElementById(`kunde-${id}`).checked = false;
              document.getElementById(`none-${id}`).checked = false;
              document.getElementById(`kunde-${id}`).removeAttribute('cheked');
              document.getElementById(`none-${id}`).removeAttribute('cheked');
              if ( this.$('input:checkbox:checked').length <=1 ){
                document.getElementById(`checkbox-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('disabled');
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('none');
              }
            }
            console.log('dataUsersToUpdate ===> ', dataUsersToUpdate)
          })
          break;
        // eslint-disable-next-line no-case-declarations
        case 6:
          const button = document.createElement('button');
          button.id = `buttonSendInvitation-${id}`
          button.classList.add('buttonSendInvitation')
          const invitatioList =  this.getInvitationList();
          console.log(Promise.resolve(invitatioList), "iiiiiiiiiiiiiiiiiiiiiiiiii")
          // invitatioList.forEach(element => {
          //   console.log(element, "elementssssssssssssssssssss")
          // });
          button.innerHTML = i18n('sendAnInvitation');
          if ( userType === 'none' ){
            button.classList.add('disabled');
            button.classList.add('none');
            button.disabled = true;
          }
          button.onclick = () => {
            dataUsersToInvitate[id] ={
              userid: id,
              cell: contact.outerHTML,
            }
            this.sendInvitation()
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
    importMultiContact(){
      this.sendInvitation();
    },
    async sendInvitation(){
      const  xml =  await this.getXmlFile();
      this.openModal('invite');
      this.panelSendeInvitation(xml);
    },
    panelSendeInvitation(xml){
      const divMainHeaderEdit = document.createElement('div');
      divMainHeaderEdit.className = 'divModalHeader divModalInvitation';
      const imageClosePanel = document.createElement('img');
      imageClosePanel.className = 'imageClosePanel';
      imageClosePanel.src = 'images/icons/x-contact-list.svg'
      imageClosePanel.onclick = () => {
        dataUsersToInvitate = {};
        this.closeModal();
      }
      const divMainContentEdit = document.createElement('div');
      divMainContentEdit.classList.add('mainInvitationDiv')
      const textarea = document.createElement('textarea');
      textarea.className = 'textareaSendeInvitation';
      textarea.placeholder =  'Lass uns mit OfficeApp kommunizieren: https://oaapp.link/1kepeYmFp';
      const inputSelect = document.createElement('input');
      inputSelect.type = 'text';
      const labelInput = document.createElement('label');
      labelInput.innerHTML = 'NAME HINZUFÜGEN';
      labelInput.classList.add('labelInputInvitation')
      const imagePlus = document.createElement('img')
      imagePlus.src = 'images/icons/icon-picture-add-200.svg';
      imagePlus.classList.add('imagePlus')
      const buttonInviteContact = document.createElement('button');
      buttonInviteContact.classList.add('buttonInviteContact');
      buttonInviteContact.innerHTML = 'Teilen';
      buttonInviteContact.onclick = () => {
        this.sendInvitationCall()
      }
      // const sortTab = document.createElement('div');
      // const buttonAdmin = document.createElement('button');
      // buttonAdmin.innerHTML = 'Admin';
      // const buttonClient = document.createElement('button');
      // buttonClient.innerHTML = 'Client';
      // buttonAdmin.onclick = () => {

      // };
      // buttonClient.onclick = () => {
        
      // };
      // sortTab.appendChild(buttonAdmin);
      // sortTab.appendChild(buttonClient);
      const divUserToSend =  document.createElement('div');
      divUserToSend.classList.add('mainDivUserSendInvitation')
      Object.keys(dataUsersToInvitate).forEach((element, index) => {
        console.log(dataUsersToInvitate,'dataUsersToInvitate')
        const id = dataUsersToInvitate[element].userid
        const data = this.prepareDataXml(dataUsersToInvitate[element].cell);
        const userDiv = document.createElement('div');
        userDiv.classList.add('userInvitation')
        userDiv.id= 'user' + id;
        const avatarUser= document.createElement('img');
        avatarUser.src = 'images/header-chat.png';
        const divInfo = document.createElement('div');
        const nameUser = document.createElement('span');
        nameUser.textContent =  data.getElementsByTagName('name')[0].childNodes[0].nodeValue + ' ' +  data.getElementsByTagName('surname')[0].childNodes[0].nodeValue;
        const breakLine = document.createElement('br');
        const tlfUser = document.createElement('span');
        tlfUser.textContent =data.getElementsByTagName('phone')[0].childNodes[0].nodeValue;
        const removeUser = document.createElement('img');
        removeUser.src = 'images/icons/x-contact-list.svg';
        removeUser.className = 'imageCloseUser';
        removeUser.onclick = () => {
          document.getElementById('user'+id).remove();
          delete dataUsersToInvitate[id];
        }
        divInfo.appendChild(nameUser);
        divInfo.appendChild(breakLine)
        divInfo.appendChild(tlfUser);
        userDiv.appendChild(avatarUser);
        userDiv.appendChild(divInfo);
        userDiv.appendChild(removeUser);
        divUserToSend.appendChild(userDiv);
      });
      divMainContentEdit.appendChild(textarea);
      divMainContentEdit.appendChild(labelInput);
      divMainContentEdit.appendChild(inputSelect);
      divMainContentEdit.appendChild(imagePlus);
      divMainHeaderEdit.appendChild(imageClosePanel); 
      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
      // this.$('#modalContact').append(sortTab);
      this.$('#modalContact').append(divUserToSend);
      this.$('#modalContact').append(buttonInviteContact);

    },
    async sendInvitationCall(){
      Object.keys(dataUsersToUpdate).forEach(element => {
        const id = dataUsersToUpdate[element].userid;
        const type = dataUsersToUpdate[element].position;
        const companyNumber = textsecure.storage.get('companyNumber', null);
        let data = {};
        if(type === 'admin'){
          data = {
            isAdminInvite: true,
            identifier: id,
          };
        }else {
          data = {
            isAdminInvite: false,
            identifier: id,
          };
        }
        const result =  createInvitation(companyNumber, data);
        dataUsersToUpdate = {};
        this.closeModal();
      })
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
      console.log('CLN !!!! ', cln.getElementsByTagName('name'))
      const divMainHeaderEdit = document.createElement('div');
      divMainHeaderEdit.className = 'divModalHeader';
      const pUserName = document.createElement('p');
      pUserName.innerText = cln.getElementsByTagName('name')[0].childNodes[0].nodeValue + ' ' + cln.getElementsByTagName('surname')[0].childNodes[0].nodeValue
      pUserName.className = 'titleHeaderEdit';
      const pUserPhone = document.createElement('p');
      pUserPhone.innerText = cln.getElementsByTagName('phone')[0].childNodes[0].nodeValue
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
      inputEditVorname.value = cln.getElementsByTagName('name')[0].childNodes[0].nodeValue;
      divEditVorname.appendChild(labelField)
      divEditVorname.appendChild(inputEditVorname)

      const divEditNachname = document.createElement('div');
      divEditNachname.className = 'divEdit';
      const labelNachName = document.createElement('span');
      labelNachName.className = 'labelEdit';
      labelNachName.innerText = 'Nachname';
      const inputNachName = document.createElement('input');
      inputNachName.type = 'text';
      inputNachName.value = cln.getElementsByTagName('surname')[0].childNodes[0].nodeValue;
      divEditNachname.appendChild(labelNachName)
      divEditNachname.appendChild(inputNachName)

      const divEditPosition = document.createElement('div');
      divEditPosition.className = 'divEdit';
      const labelPosition = document.createElement('span');
      labelPosition.className = 'labelEdit';
      labelPosition.innerText = 'Position';
      const inputPosition = document.createElement('input');
      inputPosition.type = 'text';
      inputPosition.value = cln.getElementsByTagName('position')[0].childNodes[0].nodeValue;
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
      inputTelephone.value = cln.getElementsByTagName('phone')[0].childNodes[0].nodeValue;
      divTelephone.appendChild(labelTelephone)
      divTelephone.appendChild(inputTelephone)

      const divEmail = document.createElement('div');
      divEmail.className = 'divEdit';
      const labelEmail = document.createElement('span');
      labelEmail.className = 'labelEdit';
      labelEmail.innerText = 'Email'
      const inputEmail = document.createElement('input');
      inputEmail.type = 'text';
      inputEmail.value = cln.getElementsByTagName('email')[0].childNodes[0].nodeValue;
      divEmail.appendChild(labelEmail)
      divEmail.appendChild(inputEmail)

      const divRadioButtons = document.createElement('div');
      divRadioButtons.className = 'divEdit';
      let userTypeEdit;
      if ( cln.getElementsByTagName('type')[0] ){
        userTypeEdit = cln.getElementsByTagName('type')[0].childNodes[0].nodeValue
      }else{
        userTypeEdit = 'none'
      }
      const spanSwitchKunde = document.createElement('span');
      const id = cln.getElementsByTagName('phone')[0].childNodes[0].nodeValue;
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
      divUserPrev.innerHTML = '<img src="images/header-chat.png" /> <span> ' + cln.getElementsByTagName('name')[0].childNodes[0].nodeValue + ' ' + cln.getElementsByTagName('surname')[0].childNodes[0].nodeValue + '</span>';
      divNutzer.appendChild(labelNutzer)
      divNutzer.appendChild(divUserPrev)

      const buttonSaveChanges = document.createElement('button');
      buttonSaveChanges.classList = 'buttonSave buttonsModal';
      buttonSaveChanges.innerText = 'Save';
      buttonSaveChanges.onclick = () => {
        cln.getElementsByTagName('name')[0].childNodes[0].nodeValue = inputEditVorname.value
        cln.getElementsByTagName('surname')[0].childNodes[0].nodeValue = inputNachName.value
        cln.getElementsByTagName('position')[0].childNodes[0].nodeValue = inputPosition.value
        cln.getElementsByTagName('email')[0].childNodes[0].nodeValue = inputEmail.value
        if(!cln.getElementsByTagName('type')[0]){
          if(inputKundeEdit.checked){
            const newElement=  document.createElementNS('', 'type');
            const newText = document.createTextNode('client');
            newElement.appendChild(newText);
            cln.appendChild(newElement)
            // xmlData.getElementsByTagName('contact')[positionXML].appendChild(newElement)
          }
          if(inputAdminEdit.checked){
            const newElement=  document.createElementNS('', 'type');
            const newText = document.createTextNode('admin');
            newElement.appendChild(newText);
            cln.appendChild(newElement)
            // xmlData.getElementsByTagName('contact')[positionXML].appendChild(newElement)
          }
        }else {
          if(inputKundeEdit.checked){
            cln.getElementsByTagName('type')[0].childNodes[0].nodeValue = 'client'
          }
          if(inputAdminEdit.checked){
            cln.getElementsByTagName('type')[0].childNodes[0].nodeValue = 'admin'
          }
        }

        xmlData.replaceChild(cln, xmlData.getElementsByTagName("contact")[positionXML]);
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

      const divRadioButtons = document.createElement('div');
      divRadioButtons.className = 'divEdit';
      const  userType = 'none';

      const spanSwitchKunde = document.createElement('span');
      const id = 'new-user';
      spanSwitchKunde.className = 'spanSwitch';
      spanSwitchKunde.innerText = 'Kunde';

      const divSwitch = document.createElement('div');
      divSwitch.className = 'switch-toggle switch-3 switch-candy';

      const inputKundeAdd = document.createElement('input');
      inputKundeAdd.type = 'radio';
      inputKundeAdd.name = `state-d-${id}`
      inputKundeAdd.id = `edit-kunde-${id}`;
      inputKundeAdd.checked = false;

      const labelKunde = document.createElement('label');
      labelKunde.setAttribute('for', `edit-kunde-${id}`);
      labelKunde.innerHTML = '&nbsp;';

      const inputNoneAdd = document.createElement('input');
      inputNoneAdd.type = 'radio';
      inputNoneAdd.name = `state-d-${id}`
      inputNoneAdd.id = `edit-none-${id}`;
      inputNoneAdd.checked = true;
      inputNoneAdd.setAttribute('checked', 'checked')

      const labelNone = document.createElement('label');
      labelNone.setAttribute('for', `edit-none-${id}`);
      labelNone.innerHTML = '&nbsp;';

      const inputAdminAdd = document.createElement('input');
      inputAdminAdd.type = 'radio';
      inputAdminAdd.name = `state-d-${id}`;
      inputAdminAdd.id = `edit-admin-${id}`;
      inputAdminAdd.checked = false;


      const labelAdmin = document.createElement('label');
      labelAdmin.setAttribute('for', `edit-admin-${id}`);
      labelAdmin.innerHTML = '&nbsp;';

      const aLabel = document.createElement('a');

      const spanSwitchAdmin = document.createElement('span');
      spanSwitchAdmin.className = 'spanSwitch admin';
      spanSwitchAdmin.innerText = 'Admin';


      divSwitch.appendChild(inputKundeAdd);
      divSwitch.appendChild(labelKunde);
      divSwitch.appendChild(inputNoneAdd);
      divSwitch.appendChild(labelNone);
      divSwitch.appendChild(inputAdminAdd);
      divSwitch.appendChild(labelAdmin);
      divSwitch.appendChild(aLabel);

      divRadioButtons.appendChild(spanSwitchKunde);
      divRadioButtons.appendChild(divSwitch);
      divRadioButtons.appendChild(spanSwitchAdmin)



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
        let type = null;
        if(inputKundeAdd.checked){
          type = 'client';
        }
        if(inputAdminAdd.checked){
          type = 'admin'
        }
        const typeElement = document.createElementNS('', 'type');
        const typeText = document.createTextNode(type);
        typeElement.appendChild(typeText)


        // append parent element
        parentElement.appendChild(nameElement);
        parentElement.appendChild(surnameElement);
        parentElement.appendChild(positionElement);
        parentElement.appendChild(emailElement);
        parentElement.appendChild(telephoneElement);
        parentElement.appendChild(tsElement);
        parentElement.appendChild(typeElement);

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
      divMainContentEdit.appendChild(divRadioButtons);
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
    async getInvitationList(){
      let invitationList = localStorage.getItem('InvitationList')
      if(!invitationList){
        const companyNumber = textsecure.storage.get('companyNumber', null);
        invitationList =  await getClientAdminCompany(companyNumber);
        localStorage.setItem('InvitationList', JSON.stringify(xml));
      }
      return await invitationList
    },
  });



})();
