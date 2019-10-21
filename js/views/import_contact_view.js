/* global Whisper: false */
/* global textsecure: false */

// eslint-disable-next-line func-names
(function () {
  'use strict';

  window.Whisper = window.Whisper || {};

  const contactsData = null
  var dataUsersToUpdate = [];
  var dataUsersToInvitate = [];
  var activeRolToInvitate = null;


  Whisper.ImportContactView = Whisper.View.extend({
    templateName: 'import-contact-table',
    className: 'import-contact-table',
    template: $('#import-contact-table').html(),
    render_attributes() {
      // console.log('This model import contact view!!!! ', this.model)
      return {
        'send-message': i18n('sendMessage'),
        model: this.model,
      };
    },

    initialize(options) {
      this.render();
      if (options && options.contact_data !== undefined) {
          const contactListXml = prepareDataXml(options.contact_data)
          this.createTable(contactListXml);
      } else {
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
      'keyup  #addNameInput, #addSurnameInput, #addPositionInput, #addTelephoneInput, #addEmailInput': 'activateButtonAddNewContact',
      'click #searchContactInvitation, #imagePlus': 'searchContact',
      'keyup #searchInput': 'searchContactList',
      'click #sendInvitationIcon': 'cleanMultiSelectInvite',
    },
    createEmptyMessage() {
      const divNoContacts = document.createElement('div');
      divNoContacts.className = 'divNoContacts';
      divNoContacts.innerText = 'You have not imported your contacts.'
      this.$('#contactTable').append(divNoContacts)
    },
    createTable(contactListXml) {
      const table = document.createElement('table');
      table.className = 'sortable';

      const headerTexts = ['#', 'name', 'surname', 'position', 'email', 'kunde/admin', 'invitation status', 'profile', 'actions'];
      if (table) {
        const header = table.createTHead();
        const row = header.insertRow();
        headerTexts.forEach((element, index) => {
          const cell = document.createElement('th');
          if (index === 0 || index === 5 || index === 7 || index === 8) {
            cell.className = 'no-sort';
          }
          cell.innerHTML = element;
          row.appendChild(cell)
        });
      }
      const list = contactListXml.children;
      const tbody = document.createElement('tbody');
      tbody.setAttribute('id', 'myTable');
      for (let i = 0; i < contactListXml.children.length; i++) {
        const contact = contactListXml.children.item(i);
        const tableRow = document.createElement('tr');
        tbody.appendChild(tableRow);
        for (let j = 0; j < headerTexts.length; j++) {
          const cellTd = document.createElement('td');
          if (contact.getElementsByTagName(headerTexts[j])[0]) {
            const cell = contact.getElementsByTagName(headerTexts[j])[0].textContent;
            const cellTdContent = document.createTextNode(cell);
            cellTd.appendChild(cellTdContent);
          } else {
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
    searchTable(e) {
      let value = e.target.value.toLowerCase();
      $('#myTable tr').filter(function () {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    async closeContact() {
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
    importContact(e) {
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
        this.$('#acept-import-contact').click(() => {
          this.acceptImportContact(file);
          this.$('#modalOverLay').addClass('hidden');
        })
        this.$('#cancel-import-contact').click(() => {
          this.$('#modalOverLay').addClass('hidden');
          input.val('');
          file = null;
        })
      }
      if (!file) this.contactsData = null;
      // console.log('Import file chose', files);
    },
    async acceptImportContact(file) {
      try {
        const xml = await readFileAsText(file);
        // console.log(xml);
        checkValidXML(xml);
        this.contactsData = xml;
        const aux = this.contactsData.toString().replace(/\r|\n|\t/g, '');
        this.contactsData = {
          'contact_data': aux.toString().replace(/>\s*/g, '>'),
        }
        updateXmlDB(this.contactsData)
        // const companyNumber = textsecure.storage.get('companyNumber', null);
        // await updateContact(companyNumber, this.contactsData);
      } catch (err) {
        // TODO: show invalid xml error
        console.error(err);
        input.val('');
        this.$('#contact-import-file-error').text(i18n('invalidXML'));
        file = null;
      }
      this.refreshTable()
    },
    openModal(type) {
      const modal = this.$('#modalContact');
      modal.empty();
      this.$('#modalOverLay').removeClass('hidden');
      if (type === 'import') {
        const aceptButton = document.createElement('button');
        aceptButton.innerHTML = 'Accept'
        aceptButton.id = 'acept-import-contact';
        aceptButton.className = 'buttonsModal';
        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = 'Cancel';
        cancelButton.id = 'cancel-import-contact';
        cancelButton.className = 'buttonsModal';
        modal.append(aceptButton);
        modal.append(cancelButton);
      }

    },
    closeModal() {

      this.$('#modalOverLay').addClass('hidden');
    },
    async refreshTable() {
      this.$('#contactTable').empty();
      const contactListXml = prepareDataXml(this.contactsData.contact_data)
      this.createTable(contactListXml)
    },
    async  appendElemtns(j, cellTd, id, contact) {
      const hasInvitation = await this.hasInvitation(id);
      let userType;
      if (hasInvitation.found) {
        if (hasInvitation.role_id === 1) {
          userType = 'admin';
        } else {
          userType = 'client';
        }
      } else {
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
          if (userType === 'none') {
            checkbox.disabled = true;
          }
          checkbox.addEventListener('click', () => {
            if (this.$('input:checkbox:checked').length > 1) {
              this.$('.buttonSendInvitation').addClass('disabled')
              this.$('.buttonSendInvitation').disabled = true;
              this.$('#sendMultipleInvitations').removeClass('disabled')
              this.$('#sendMultipleInvitations').prop('disabled', false)
            } else if (this.$('input:checkbox:checked').length <= 1) {
              this.$('.buttonSendInvitation:not(.none)').removeClass('disabled');
              this.$('.buttonSendInvitation:not(.none)').disabled = false;
              this.$('#sendMultipleInvitations').addClass('disabled');
              this.$('#sendMultipleInvitations').prop('disabled', true)
            }
            // add element to object
            if (checkbox.checked) {
              if (document.getElementById('kunde-' + id).checked) {
                dataUsersToInvitate[id] = {
                  userid: id,
                  cell: contact.outerHTML,
                  position: 'kunde',
                }
              } else if (document.getElementById('admin-' + id).checked) {
                dataUsersToInvitate[id] = {
                  userid: id,
                  cell: contact.outerHTML,
                  position: 'admin',
                }
              } else if (document.getElementById('none-' + id).checked) {
                dataUsersToInvitate[id] = {
                  userid: id,
                  cell: contact.outerHTML,
                  position: 'none',
                }
              }
            } else {
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

          if (userType === 'client') {
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
          if (userType == 'none') {
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

          if (userType == 'admin') {
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
            if (inputKunde.checked) {
              dataUsersToUpdate[id] = {
                position: 'kunde',
                userid: id,
                cell: contact.outerHTML,
              }
              document.getElementById(`admin-${id}`).checked = false;
              document.getElementById(`none-${id}`).checked = false;
              document.getElementById(`admin-${id}`).removeAttribute('cheked');
              document.getElementById(`none-${id}`).removeAttribute('cheked');


              if (this.$('input:checkbox:checked').length <= 1) {
                document.getElementById(`buttonSendInvitation-${id}`).disabled = false
                document.getElementById(`checkbox-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('disabled');
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('none');
              }
            }
          })
          inputNone.addEventListener('click', () => {
            if (inputNone.checked) {
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
            if (inputAdmin.checked) {
              dataUsersToUpdate[id] = {
                position: 'admin',
                userid: id,
                cell: contact.outerHTML,
              }
              document.getElementById(`kunde-${id}`).checked = false;
              document.getElementById(`none-${id}`).checked = false;
              document.getElementById(`kunde-${id}`).removeAttribute('cheked');
              document.getElementById(`none-${id}`).removeAttribute('cheked');
              if (this.$('input:checkbox:checked').length <= 1) {
                document.getElementById(`checkbox-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).disabled = false
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('disabled');
                document.getElementById(`buttonSendInvitation-${id}`).classList.remove('none');
              }
            }
            // console.log('dataUsersToUpdate ===> ', dataUsersToUpdate)
          })
          break;
        // eslint-disable-next-line no-case-declarations
        case 6:
          const button = document.createElement('button');
          button.id = `buttonSendInvitation-${id}`
          button.classList.add('buttonSendInvitation')
          button.innerHTML = i18n('sendAnInvitation');
          if (hasInvitation.found) {
            if (hasInvitation.accepted) {
              button.innerHTML = i18n('aceptedInvitation');
              button.classList.add('disabled');
              button.classList.add('none');
              button.disabled = true;

            } else {
              button.innerHTML = i18n('sendAgainInvitation');
            }

          }
          if (userType === 'none') {
            button.classList.add('disabled');
            button.classList.add('none');
            button.disabled = true;
          }
          button.onclick = () => {
            if (document.getElementById('kunde-' + id).checked) {
              dataUsersToInvitate[id] = {
                userid: id,
                cell: contact.outerHTML,
                position: 'kunde',
              }
            } else if (document.getElementById('admin-' + id).checked) {
              dataUsersToInvitate[id] = {
                userid: id,
                cell: contact.outerHTML,
                position: 'admin',
              }
            } else if (document.getElementById('none-' + id).checked) {
              dataUsersToInvitate[id] = {
                userid: id,
                cell: contact.outerHTML,
                position: 'none',
              }
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
    async hasInvitation(id) {
      const invitationList = await getListInvitation();
      let resp = {
        found: false,
        accepted: false,
        role_id: null,
      }
      if (invitationList) {
        if (invitationList.invites) {
          invitationList.invites.forEach(element => {
            if (id === element.identifier) {
              resp = {
                found: true,
                accepted: element.accepted,
                role_id: element.role_id,
              }
            }
          });
        }
      }

      return resp;
    },
    importMultiContact() {
      this.sendInvitation();
    },
    async sendInvitation() {
      const xml = await getXmlFile();
      this.openModal('invite');
      this.panelSendeInvitation(xml);
    },
    panelSendeInvitation(xml) {
      const divMainHeaderEdit = document.createElement('div');
      divMainHeaderEdit.className = 'divModalHeader divModalInvitation';
      divMainHeaderEdit.id = 'divModalHeader';
      const imageClosePanel = document.createElement('img');
      imageClosePanel.className = 'imageClosePanel';
      imageClosePanel.id = 'imageClosePanel';
      imageClosePanel.src = 'images/icons/x-contact-list.svg'
      imageClosePanel.onclick = () => {
        dataUsersToInvitate = {};
        this.closeModal();
      }
      const divMainContentEdit = document.createElement('div');
      divMainContentEdit.classList.add('mainInvitationDiv');
      divMainContentEdit.id = 'divMainContentEdit';
      const textarea = document.createElement('textarea');
      textarea.className = 'textareaSendeInvitation';
      textarea.id = 'textareaSendeInvitation'
      textarea.placeholder = 'Lass uns mit OfficeApp kommunizieren: https://oaapp.link/1kepeYmFp';

      const searchTab = document.createElement('div');
      searchTab.className = 'tab';
      // const buttonAll = document.createElement('button');
      const buttonAdmin = document.createElement('button');
      const buttonUsers = document.createElement('button');
      // buttonAll.className = 'tablinks active';
      // buttonAll.innerHTML = 'Alle';
      // buttonAll.id = 'filterAll';
      // buttonAll.onclick = () => {
      //   this.filterTab('Alle')
      // }
      buttonAdmin.className = 'tablinks';
      buttonAdmin.innerHTML = 'Admin';
      buttonAdmin.id = 'filterAdmin';
      buttonAdmin.onclick = () => {
        this.filterTab('Admin')
      }
      buttonUsers.className = 'tablinks';
      buttonUsers.innerHTML = 'Users';
      buttonUsers.id = 'filterUsers';
      buttonUsers.onclick = () => {
        this.filterTab('Users')
      }
      // searchTab.append(buttonAll);
      searchTab.append(buttonAdmin);
      searchTab.append(buttonUsers);

      const inputSelect = document.createElement('input');
      inputSelect.type = 'text';
      inputSelect.id = 'searchContactInvitation';
      const labelInput = document.createElement('label');
      labelInput.innerHTML = 'NAME HINZUFÜGEN';
      labelInput.classList.add('labelInputInvitation')
      const imagePlus = document.createElement('img')
      imagePlus.src = 'images/icons/icon-picture-add-200.svg';
      imagePlus.classList.add('imagePlus')
      imagePlus.id = 'imagePlus';
      const buttonInviteContact = document.createElement('button');
      buttonInviteContact.classList.add('buttonInviteContact');
      buttonInviteContact.id = 'buttonInviteContact';
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
      const divKundeToSend = document.createElement('div');
      divKundeToSend.classList.add('mainDivUserSendInvitation');
      divKundeToSend.id = 'UsersList';
      const divAdminToSend = document.createElement('div');
      divAdminToSend.classList.add('mainDivUserSendInvitation');
      divAdminToSend.id = 'AdminList';

      let selectedTab;
      Object.keys(dataUsersToInvitate).forEach((element, index) => {
        selectedTab = dataUsersToInvitate[element].position
      });
      if (selectedTab === 'kunde') {
        divAdminToSend.classList.add('hidden');
        buttonUsers.classList.add('active');
      } else {
        divKundeToSend.classList.add('hidden');
        buttonAdmin.classList.add('active');
      }
      // AdminList
      // UsersList
      Object.keys(dataUsersToInvitate).forEach((element, index) => {
        // console.log(dataUsersToInvitate, 'dataUsersToInvitate')
        const id = dataUsersToInvitate[element].userid
        const data = prepareDataXml(dataUsersToInvitate[element].cell);
        const userDiv = document.createElement('div');
        userDiv.classList.add('userInvitation')
        userDiv.id = 'user' + id;
        const avatarUser = document.createElement('img');
        avatarUser.src = 'images/header-chat.png';
        const divInfo = document.createElement('div');
        const nameUser = document.createElement('span');
        nameUser.textContent = data.getElementsByTagName('name')[0].childNodes[0].nodeValue + ' ' + data.getElementsByTagName('surname')[0].childNodes[0].nodeValue;
        const breakLine = document.createElement('br');
        const tlfUser = document.createElement('span');
        tlfUser.textContent = data.getElementsByTagName('phone')[0].childNodes[0].nodeValue;
        const removeUser = document.createElement('img');
        removeUser.src = 'images/icons/x-contact-list.svg';
        removeUser.className = 'imageCloseUser';
        removeUser.onclick = () => {
          document.getElementById('user' + id).remove();
          delete dataUsersToInvitate[id];
        }
        divInfo.appendChild(nameUser);
        divInfo.appendChild(breakLine)
        divInfo.appendChild(tlfUser);
        userDiv.appendChild(avatarUser);
        userDiv.appendChild(divInfo);
        userDiv.appendChild(removeUser);
        if (dataUsersToInvitate[element].position === 'admin') {
          divAdminToSend.appendChild(userDiv);
        }
        if (dataUsersToInvitate[element].position === 'kunde') {
          divKundeToSend.appendChild(userDiv);
        }
      });
      divMainContentEdit.appendChild(textarea);
      divMainContentEdit.appendChild(searchTab)
      divMainContentEdit.appendChild(labelInput);
      divMainContentEdit.appendChild(inputSelect);
      divMainContentEdit.appendChild(imagePlus);
      divMainHeaderEdit.appendChild(imageClosePanel);
      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
      // this.$('#modalContact').append(sortTab);
      this.$('#modalContact').append(divKundeToSend);
      this.$('#modalContact').append(divAdminToSend);
      this.$('#modalContact').append(buttonInviteContact);

    },
    async sendInvitationCall() {
      await parallel(1, Object.keys(dataUsersToInvitate), async (element) => {
        const id = dataUsersToInvitate[element].userid;
        const type = dataUsersToInvitate[element].position;
        const companyNumber = textsecure.storage.get('companyNumber', null);
        let data = {};
        if (type === 'admin') {
          data = {
            isAdminInvite: true,
            identifier: id,
          };
        } else {
          data = {
            isAdminInvite: false,
            identifier: id,
          };
        }
        const result = await createInvitation(companyNumber, data);
        const dataSms = {
          phone_number: id,
          code: result.code,
        }
        sendSms(companyNumber, dataSms)

        document.getElementById(`buttonSendInvitation-${id}`).innerText = i18n('sendAgainInvitation')
      })
      dataUsersToInvitate = {};
      this.closeModal();
    },
    async removeContact(id) {
      this.openModal('remove');
      const xml = await getXmlFile();
      this.panelRemoveContact(id, xml)
    },

    panelRemoveContact(id, xml) {
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

        const xmlData = prepareDataXml(xml)
        const positionXML = findUserXml(id, xmlData)
        const y = xmlData.getElementsByTagName('contact')[positionXML];
        xmlData.removeChild(y);
        const dataToUpdate = prepareDataToUpdate(xmlData);
        this.contactsData = dataToUpdate;
        updateXmlDB(dataToUpdate);
        this.closeModal();
        this.refreshTable();
      }
      divMainContentEdit.appendChild(buttonRemoveContact);
      this.$('#modalContact').append(divMainHeaderEdit);
      this.$('#modalContact').append(divMainContentEdit);
    },

    async editContact(id) {
      this.openModal('edit');
      const xml = await getXmlFile();
      const xmlData = prepareDataXml(xml)
      const positionXML = findUserXml(id, xmlData)
      const userInfo = xmlData.children.item(positionXML);
      // xmlData.getElementsByTagName("surname")[positionXML].childNodes[0].nodeValue = "new content" ; //// USE THAT FOR MODIFY ELEMENT
      const cln = userInfo.cloneNode(true);
      this.createEditPanel(cln, xmlData, positionXML)

    },
    createEditPanel(cln, xmlData, positionXML) {
      // console.log('CLN !!!! ', cln.getElementsByTagName('name'))
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
      if (cln.getElementsByTagName('type')[0]) {
        userTypeEdit = cln.getElementsByTagName('type')[0].childNodes[0].nodeValue
      } else {
        userTypeEdit = 'none'
      }
      const spanSwitchKunde = document.createElement('span');
      const id = cln.getElementsByTagName('phone')[0].childNodes[0].nodeValue;
      spanSwitchKunde.className = 'spanSwitch';
      spanSwitchKunde.innerText = 'Kunde';

      // const divSwitch = document.createElement('div');
      // divSwitch.className = 'switch-toggle switch-3 switch-candy';

      // const inputKundeEdit = document.createElement('input');
      // inputKundeEdit.type = 'radio';
      // inputKundeEdit.name = `edit-state-d-${id}`
      // inputKundeEdit.id = `edit-kunde-${id}`;
      // if (userTypeEdit === 'client') {
      //   inputKundeEdit.checked = true;
      //   inputKundeEdit.setAttribute('checked', 'checked')
      // }
      // const labelKunde = document.createElement('label');
      // labelKunde.setAttribute('for', `edit-kunde-${id}`);
      // labelKunde.innerHTML = '&nbsp;';

      // const inputNoneEdit = document.createElement('input');
      // inputNoneEdit.type = 'radio';
      // inputNoneEdit.name = `edit-state-d-${id}`
      // inputNoneEdit.id = `edit-none-${id}`;
      // if (userTypeEdit == 'none') {
      //   inputNoneEdit.checked = true;
      //   inputNoneEdit.setAttribute('checked', 'checked')
      // }
      // const labelNone = document.createElement('label');
      // labelNone.setAttribute('for', `edit-none-${id}`);
      // labelNone.innerHTML = '&nbsp;';

      // const inputAdminEdit = document.createElement('input');
      // inputAdminEdit.type = 'radio';
      // inputAdminEdit.name = `edit-state-d-${id}`
      // inputAdminEdit.id = `edit-admin-${id}`;
      // if (userTypeEdit == 'admin') {
      //   inputAdminEdit.checked = true;
      //   inputAdminEdit.setAttribute('checked', 'checked')
      // }
      // const labelAdmin = document.createElement('label');
      // labelAdmin.setAttribute('for', `edit-admin-${id}`);
      // labelAdmin.innerHTML = '&nbsp;';

      // const aLabel = document.createElement('a');

      // const spanSwitchAdmin = document.createElement('span');
      // spanSwitchAdmin.className = 'spanSwitch admin';
      // spanSwitchAdmin.innerText = 'Admin';


      // divSwitch.appendChild(inputKundeEdit);
      // divSwitch.appendChild(labelKunde);
      // divSwitch.appendChild(inputNoneEdit);
      // divSwitch.appendChild(labelNone);
      // divSwitch.appendChild(inputAdminEdit);
      // divSwitch.appendChild(labelAdmin);
      // divSwitch.appendChild(aLabel);

      // divRadioButtons.appendChild(spanSwitchKunde);
      // divRadioButtons.appendChild(divSwitch);
      // divRadioButtons.appendChild(spanSwitchAdmin)


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
        // if (!cln.getElementsByTagName('type')[0]) {
        //   if (inputKundeEdit.checked) {
        //     const newElement = document.createElementNS('', 'type');
        //     const newText = document.createTextNode('client');
        //     newElement.appendChild(newText);
        //     cln.appendChild(newElement)
        //     // xmlData.getElementsByTagName('contact')[positionXML].appendChild(newElement)
        //   }
        //   if (inputAdminEdit.checked) {
        //     const newElement = document.createElementNS('', 'type');
        //     const newText = document.createTextNode('admin');
        //     newElement.appendChild(newText);
        //     cln.appendChild(newElement)
        //     // xmlData.getElementsByTagName('contact')[positionXML].appendChild(newElement)
        //   }
        // } else {
        //   if (inputKundeEdit.checked) {
        //     cln.getElementsByTagName('type')[0].childNodes[0].nodeValue = 'client'
        //   }
        //   if (inputAdminEdit.checked) {
        //     cln.getElementsByTagName('type')[0].childNodes[0].nodeValue = 'admin'
        //   }
        // }

        xmlData.replaceChild(cln, xmlData.getElementsByTagName("contact")[positionXML]);
        const dataToUpdate = prepareDataToUpdate(xmlData);
        this.contactsData = dataToUpdate;
        updateXmlDB(dataToUpdate);
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
    async importIndividualContact() {
      this.openModal();
      const xml = await getXmlFile();
      const xmlData = prepareDataXml(xml)
      this.createAddPanel(xmlData);
    },
    createAddPanel(xmlData) {
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

      // const divRadioButtons = document.createElement('div');
      // divRadioButtons.className = 'divEdit';
      // const userType = 'none';

      // const spanSwitchKunde = document.createElement('span');
      // const id = 'new-user';
      // spanSwitchKunde.className = 'spanSwitch';
      // spanSwitchKunde.innerText = 'Kunde';

      // const divSwitch = document.createElement('div');
      // divSwitch.className = 'switch-toggle switch-3 switch-candy';

      // const inputKundeAdd = document.createElement('input');
      // inputKundeAdd.type = 'radio';
      // inputKundeAdd.name = `state-d-${id}`
      // inputKundeAdd.id = `edit-kunde-${id}`;
      // inputKundeAdd.checked = false;

      // const labelKunde = document.createElement('label');
      // labelKunde.setAttribute('for', `edit-kunde-${id}`);
      // labelKunde.innerHTML = '&nbsp;';

      // const inputNoneAdd = document.createElement('input');
      // inputNoneAdd.type = 'radio';
      // inputNoneAdd.name = `state-d-${id}`
      // inputNoneAdd.id = `edit-none-${id}`;
      // inputNoneAdd.checked = true;
      // inputNoneAdd.setAttribute('checked', 'checked')

      // const labelNone = document.createElement('label');
      // labelNone.setAttribute('for', `edit-none-${id}`);
      // labelNone.innerHTML = '&nbsp;';

      // const inputAdminAdd = document.createElement('input');
      // inputAdminAdd.type = 'radio';
      // inputAdminAdd.name = `state-d-${id}`;
      // inputAdminAdd.id = `edit-admin-${id}`;
      // inputAdminAdd.checked = false;


      // const labelAdmin = document.createElement('label');
      // labelAdmin.setAttribute('for', `edit-admin-${id}`);
      // labelAdmin.innerHTML = '&nbsp;';

      // const aLabel = document.createElement('a');

      // const spanSwitchAdmin = document.createElement('span');
      // spanSwitchAdmin.className = 'spanSwitch admin';
      // spanSwitchAdmin.innerText = 'Admin';


      // divSwitch.appendChild(inputKundeAdd);
      // divSwitch.appendChild(labelKunde);
      // divSwitch.appendChild(inputNoneAdd);
      // divSwitch.appendChild(labelNone);
      // divSwitch.appendChild(inputAdminAdd);
      // divSwitch.appendChild(labelAdmin);
      // divSwitch.appendChild(aLabel);

      // divRadioButtons.appendChild(spanSwitchKunde);
      // divRadioButtons.appendChild(divSwitch);
      // divRadioButtons.appendChild(spanSwitchAdmin)



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
      buttonSaveChanges.id = 'addNewContactButton'
      buttonSaveChanges.onclick = () => {

        // creating a news element
        const parentElement = document.createElementNS('', 'contact');

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

        // const tsElement = document.createElementNS('', 'ts');
        // const tsText = document.createTextNode('');
        // tsElement.appendChild(tsText)
        // let type = null;
        // if (inputKundeAdd.checked) {
        //   type = 'client';
        // }
        // if (inputAdminAdd.checked) {
        //   type = 'admin'
        // }
        // const typeElement = document.createElementNS('', 'type');
        // const typeText = document.createTextNode(type);
        // typeElement.appendChild(typeText)


        // append parent element
        parentElement.appendChild(nameElement);
        parentElement.appendChild(surnameElement);
        parentElement.appendChild(positionElement);
        parentElement.appendChild(emailElement);
        parentElement.appendChild(telephoneElement);
        // parentElement.appendChild(tsElement);
        // parentElement.appendChild(typeElement);

        // prepare data and save on DB
        xmlData.appendChild(parentElement);
        const dataToUpdate = prepareDataToUpdate(xmlData);
        this.contactsData = dataToUpdate;
        updateXmlDB(dataToUpdate);
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
    activateButtonAddNewContact() {
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
    cleanMultiSelectInvite() {
      // document.getElementById('divMainContentEdit').remove()
      // document.getElementById('UsersList').remove();
      // document.getElementById('AdminList').remove();
      // document.getElementById('sendInvitationIcon').remove();
      document.getElementById('modalContact').innerHTML = ''
      this.panelSendeInvitation();
    },
    searchContact() {
      // filterAdmin
      if (this.$('#filterAdmin').hasClass('active')) {
        activeRolToInvitate = 'admin'
      }
      if (this.$('#filterUsers').hasClass('active')) {
        activeRolToInvitate = 'kunde'
      }
      this.$('#divMainContentEdit').empty();
      this.$('#UsersList').remove();
      this.$('#buttonInviteContact').remove();
      const headerSearch = document.createElement('div');
      headerSearch.classList.add('divHeaderSearch')
      const searchInput = document.createElement('input');
      searchInput.id = 'searchInput';
      searchInput.className = 'searchInput';
      searchInput.placeholder = 'find';
      searchInput.type = 'text';
      headerSearch.appendChild(searchInput)
      this.$('#divMainContentEdit').append(headerSearch);
      const searchTab = document.createElement('div');
      searchTab.className = 'tab';
      this.$('#divMainContentEdit').append(searchTab);
      const buttonAll = document.createElement('button');
      const buttonAdmin = document.createElement('button');
      const buttonUsers = document.createElement('button');
      buttonAll.className = 'tablinks active';
      buttonAll.innerHTML = 'Alle';
      buttonAll.id = 'filterAll';
      buttonAll.onclick = () => {
        this.filterTab('Alle')
      }
      buttonAdmin.className = 'tablinks';
      buttonAdmin.innerHTML = 'Admin';
      buttonAdmin.id = 'filterAdmin';
      buttonAdmin.onclick = () => {
        this.filterTab('Admin')
      }
      buttonUsers.className = 'tablinks';
      buttonUsers.innerHTML = 'Users';
      buttonUsers.id = 'filterUsers';
      buttonUsers.onclick = () => {
        this.filterTab('Users')
      }
      searchTab.append(buttonAll);
      searchTab.append(buttonAdmin);
      searchTab.append(buttonUsers);
      this.getSearchContact();
    },
    filterTab(filter) {
      switch (filter) {
        case 'Alle':
          this.$('#allUsersList').removeClass('hidden');
          this.$('#AdminList').addClass('hidden');
          this.$('#UsersList').addClass('hidden');
          break;
        case 'Admin':
          this.$('#allUsersList').addClass('hidden');
          this.$('#AdminList').removeClass('hidden');
          this.$('#filterAdmin').addClass('active');
          this.$('#UsersList').addClass('hidden');
          this.$('#filterUsers').removeClass('active');
          break;
        case 'Users':
          this.$('#allUsersList').addClass('hidden');
          this.$('#AdminList').addClass('hidden');
          this.$('#filterAdmin').removeClass('active');
          this.$('#UsersList').removeClass('hidden');
          this.$('#filterUsers').addClass('active');
          break;
        default:
          break;
      }
    },
    async getSearchContact() {
      const xml = await getXmlFile();
      const xmlData = prepareDataXml(xml)
      this.contactList(xmlData);
    },
    addRemoveInvitation(user, element) {
      const id = user.getElementsByTagName('phone')[0].textContent
      if (element) {
        dataUsersToInvitate[id] = {
          userid: id,
          cell: user.outerHTML,
          position: activeRolToInvitate,
        }
      } else {
        delete dataUsersToInvitate[id]
      }
    },
    async contactList(xml) {
      const AdminUserListResponse = await getListInvitation();
      const allUsersList = document.createElement('div');
      allUsersList.id = 'allUsersList';
      allUsersList.className = 'mainDivUserSendInvitation';
      const AdminList = document.createElement('div');
      AdminList.id = 'AdminList';
      AdminList.className = 'hidden mainDivUserSendInvitation'
      const UsersList = document.createElement('div');
      UsersList.id = 'UsersList';
      UsersList.className = 'hidden mainDivUserSendInvitation';
      let userFound = false;
      const sendInvitationIcon = document.createElement('img');
      sendInvitationIcon.src = 'images/icons/check_over_blue_24x24.svg';
      sendInvitationIcon.className = 'imageClosePanel';
      sendInvitationIcon.id = 'sendInvitationIcon';
      this.$('#imageClosePanel').remove();
      this.$('#divModalHeader').append(sendInvitationIcon);
      for (let i = 0; i < xml.children.length; i++) {
        // show in the list the users that are not selected previously
        const userDiv = document.createElement('div');
        userDiv.classList.add('userInvitation');
        userDiv.id = 'user' + xml.children[i].getElementsByTagName('phone')[0].textContent;
        const avatarUser = document.createElement('img');
        avatarUser.src = 'images/header-chat.png';
        const divInfo = document.createElement('div');
        const nameUser = document.createElement('span');
        nameUser.textContent = xml.children[i].getElementsByTagName('name')[0].textContent + ' ' + xml.children[i].getElementsByTagName('surname')[0].textContent;
        const breakLine = document.createElement('br');
        const tlfUser = document.createElement('span');
        tlfUser.textContent = xml.children[i].getElementsByTagName('phone')[0].textContent;
        const userCheckbox = document.createElement('input');
        userCheckbox.type = 'checkbox';
        userCheckbox.id = 'checkbox' + tlfUser.textContent;
        Object.keys(dataUsersToInvitate).forEach((element, index) => {
          if (element === xml.children[i].getElementsByTagName('phone')[0].textContent) {
            userCheckbox.setAttribute('checked', 'checked')
          }
        });
        userCheckbox.classList.add('contactListCheckbox');
        userCheckbox.addEventListener('click', () => {
          this.addRemoveInvitation(xml.children[i], userCheckbox.checked);
        })
        divInfo.appendChild(nameUser);
        divInfo.appendChild(breakLine)
        divInfo.appendChild(tlfUser);
        userDiv.appendChild(avatarUser);
        userDiv.appendChild(divInfo);
        userDiv.appendChild(userCheckbox);
        this.$('#allUsersList').append(userDiv)		// fill all user list
        this.$('#allUsersList').append(userDiv);
        // fill admin list
        for (let j = 0; j < AdminUserListResponse.admins.length; j++) {
          if (AdminUserListResponse.admins[j].phone_number === xml.children[i].getElementsByTagName('phone')[0].textContent) {
            this.$('#AdminList').append(userDiv);
            userFound = true;
          }
        }
        // fill user list
        for (let j = 0; j < AdminUserListResponse.clients.length; j++) {
          if (AdminUserListResponse.clients[j].phone_number === xml.children[i].getElementsByTagName('phone')[0].textContent) {
            this.$('#UsersList').append(userDiv);
          }
        }

        this.$('#divMainContentEdit').append(allUsersList);
        this.$('#divMainContentEdit').append(AdminList);
        this.$('#divMainContentEdit').append(UsersList);

      }
      if (userFound === false) {
        const emptyAdmin = document.createElement('span');
        emptyAdmin.textContent = 'Admin contact list is empty';
        this.$('#AdminList').append(emptyAdmin);
      }
      if (AdminUserListResponse.clients.length <= 0) {
        const emptyUser = document.createElement('span');
        emptyUser.textContent = 'User contact list is empty';
        this.$('#UsersList').append(emptyUser);
      }
    },
    searchContactList(e) {
      let value = e.target.value.toLowerCase();
      $('#allUsersList div').filter(function () {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
  });
  Whisper.ModalImport = Whisper.View.extend({
    templateName: 'modal-importer',
    className: 'modal-importer',
    template: $('#modal-importer').html(),

    initialize(options) {
      if(options){
        if(options.contact_data !== undefined){

          this.contactListXml = prepareDataXml(options.contact_data);
          this.objectContact = []
          for (let i = 0; i < this.contactListXml.children.length; i++) {
            const contact = this.contactListXml.children.item(i);
            const tmpObj = {
              name: contact.getElementsByTagName('name')[0].textContent,
              surname: contact.getElementsByTagName('surname')[0].textContent,
              position: contact.getElementsByTagName('position')[0].textContent,
              email: contact.getElementsByTagName('email')[0].textContent,
              phone: contact.getElementsByTagName('phone')[0].textContent,
              ts: contact.getElementsByTagName('ts')[0].textContent,
            }
            this.objectContact.push(tmpObj)
          }
          console.log(options, "optionsssssssssssssssssssssssssssssssssssssssssssssssssss")
          this.type = options.type;
          if ( options.type == 'kunde' ){
            this.typeAdmin = true;
            this.typeKunde = false;
          }else if ( options.type == 'admin'){
            this.typeAdmin = false;
            this.typeKunde = true;
          }
        }
      }
      this.render();
    },
    render_attributes() {
      // console.log('This model import contact view!!!! ', this.model)
      return {
        'send-message': i18n('sendMessage'),
        typeAdmin: this.typeAdmin,
        typeKunde: this.typeKunde,
        objectContact: this.objectContact,
      };
    },
    events: {
      'click #imageSendInvitation' : 'sendDataToModal',
      'click #imageClosePanel': 'closePanel',
      'click  #imageGoBack' : 'goBack',
      'click #searchContactInvitation': 'showContactListPanel',
      'click .contactListCheckbox': 'checkBoxevent',
      'click #buttonInviteContact': 'sendInvitations',
    },
    closePanel(){
      document.getElementsByClassName('modal-importer')[0].remove();
    },
    showContactListPanel(){
      this.$('#modalContact').addClass('hidden');
      this.$('#modalSearchUsers').removeClass('hidden');
    },
    goBack(){
      this.$('#modalContact').removeClass('hidden');
      this.$('#modalSearchUsers').addClass('hidden');
    },
    sendDataToModal(){
      this.$('#modalContact').removeClass('hidden');
      this.$('#modalSearchUsers').addClass('hidden');
      for (let i = 0; i < this.contactListXml.children.length; i++) {
        const contact = this.contactListXml.children.item(i);
        // eslint-disable-next-line no-loop-func
        Object.keys(dataUsersToInvitate).forEach((element) => {
          const id = dataUsersToInvitate[element].userid;
          if(id === contact.getElementsByTagName('phone')[0].textContent){
            const data = this.contactListXml;
            const userDiv = document.createElement('div');
            userDiv.classList.add('userInvitation')
            userDiv.id = 'user' + id;
            const avatarUser = document.createElement('img');
            avatarUser.src = 'images/header-chat.png';
            const divInfo = document.createElement('div');
            const nameUser = document.createElement('span');
            nameUser.textContent = data.getElementsByTagName('name')[i].childNodes[0].nodeValue + ' ' + data.getElementsByTagName('surname')[i].childNodes[0].nodeValue;
            const breakLine = document.createElement('br');
            const tlfUser = document.createElement('span');
            tlfUser.textContent = data.getElementsByTagName('phone')[i].childNodes[0].nodeValue;
            const removeUser = document.createElement('img');
            removeUser.src = 'images/icons/x-contact-list.svg';
            removeUser.className = 'imageCloseUser';
            removeUser.onclick = () => {
              document.getElementById('user' + id).remove();
              delete dataUsersToInvitate[id];
            }
            divInfo.appendChild(nameUser);
            divInfo.appendChild(breakLine)
            divInfo.appendChild(tlfUser);
            userDiv.appendChild(avatarUser);
            userDiv.appendChild(divInfo);
            userDiv.appendChild(removeUser);
            document.getElementById('userSendList').appendChild(userDiv);
          }
        })

      }
    },
    async sendInvitations(){
      await parallel(1, Object.keys(dataUsersToInvitate), async (element) => {
        const id = dataUsersToInvitate[element].userid;
        const type = dataUsersToInvitate[element].position;
        const companyNumber = textsecure.storage.get('companyNumber', null);
        let data = {};
        if (type === 'admin') {
          data = {
            isAdminInvite: true,
            identifier: id,
          };
        } else {
          data = {
            isAdminInvite: false,
            identifier: id,
          };
        }
        const result = await createInvitation(companyNumber, data);
        const dataSms = {
          phone_number: id,
          code: result.code,
        }
        sendSms(companyNumber, dataSms)

        dataUsersToInvitate = {};
        this.closePanel();
      })
    },
    checkBoxevent(event){
      const id = event.target.attributes.dataPhone.nodeValue;
      if(event.target.checked){
        dataUsersToInvitate[id] = {
          userid: id,
          position: this.type,
        }
      }else {
        delete dataUsersToInvitate[id];
      }
    },
  });
})();
