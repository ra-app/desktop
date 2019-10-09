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
        // const parser = new DOMParser();
        // let  xmlRes;
        // try {
        //   // WebKit returns null on unsupported types
        //   xmlRes = parser.parseFromString(options.contact_data, 'text/xml');
        // } catch (ex) {
        //   console.log(ex)
        // }
        // document.xmlRes = xmlRes;
        // const contactListXml = xmlRes.children[0];
        // this.createTable(contactListXml)
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
            const id = contact.getElementsByTagName(headerTexts[4])[0].textContent;
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

      console.log("import contact")
      this.$('#contact-import-file-input').click()
    },
    async onChoseContactsFile() {
      this.contactsData = null;
      const input = this.$('#contact-import-file-input');
      const files = input.get(0).files;
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
        this.contactsData = {
          'contact_data': this.contactsData.toString().replace('\n', ''),
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
         aceptButton.id = 'acept-import-contact'
         const cancelButton  = document.createElement('button'); 
         cancelButton.innerHTML='Cancel';
         cancelButton.id = 'cancel-import-contact';
          modal.append(aceptButton);
          modal.append(cancelButton);
      }else if(type === 'edit'){

      } else if(type === 'remove'){

      }else if(type === 'invite'){

      }
      
    },
    async refreshTable(){
      console.log("refreshing table", this.contactsData)
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
    async editContact(id){
      console.log(id, "edit contact");
      this.openModal('edit');
      let xml = localStorage.getItem('ContactList')
      if(!xml){
        const companyNumber = textsecure.storage.get('companyNumber', null);
         xml = await getContactXml(companyNumber);
        localStorage.setItem('ContactList', JSON.stringify(xml));
      }
      const xmlData = this.prepareDataXml(xml, false)
      const positionXML = this.findUserXml(id, xmlData)
      const userInfo = xmlData.children.item(positionXML);
      console.log(userInfo);
      this.$('#modalContact').append(userInfo)      
    },
    removeContact(id){
      console.log(id, "remove contact");
      this.openModal('remove');
    },
    findUserXml(id, xmlData){
      for (let i = 0; i < xmlData.children.length; i++) {
        const contact = xmlData.children.item(i);
       const email =  contact.getElementsByTagName('email')[0].textContent
       if(email === id){
         return i;
       }
        // console.log(email, "contactt")
        // console.log(contact, "contactttt")
      }
    },
    // generateXmlFromTable (){
    //   let  xml;
    //   xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    //   xml += '<contactlist>\n';
    //   // eslint-disable-next-line func-names
    //   $('#contactTable tr').each(function() {
    //     const cells = $('td', this);
    //     if (cells.length > 0) {
    //         xml += '<contact>\n';
    //         for (var i = 1; i < cells.length; ++i) {
    //             switch (i) {
    //               case 1:
    //                 xml += '\t<name>' + cells.eq(i).text() + '</name>\n';
    //                 break;
    //               case 2:
    //                 xml += '\t<surname>' + cells.eq(i).text() + '</surname>\n';
    //                 break;
    //               case 3:
    //                 xml += '\t<position>' + cells.eq(i).text() + '</position>\n';
    //                 break;
    //               case 4:
    //                 xml += '\t<email>' + cells.eq(i).text() + '</email>\n';
    //                 break;
    //               default:
    //                 break;
    //             }
    //             // xml += '\t<ts></ts>\n';
    //         }
    //         xml += '</contact>\n';
    //     }
    // });
    // xml += '</contactlist>\n';
    // console.log(xml, "new xmllllllllllllllllll")
    // },
  });



})();
