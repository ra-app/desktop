/* global Whisper: false */
/* global textsecure: false */

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};


  Whisper.ImportContactView = Whisper.View.extend({
    templateName: 'import-contact-table',
    className: 'import-contact-table',
    template: $('#import-contact-table').html(),
    render_attributes() {

      return {
        'send-message': i18n('sendMessage'),
        model: this.model,
      };
    },

    initialize(options) {
      this.render();
      if (options){
        const parser = new DOMParser();
        let  xmlRes;
        try {
          // WebKit returns null on unsupported types
          xmlRes = parser.parseFromString(options.contact_data, 'text/xml');
        } catch (ex) {
          console.log(ex)
        }
        document.xmlRes = xmlRes;
        const contactListXml = xmlRes.children[0];
        this.createTable(contactListXml)
      }
    },
    events: {
      'keyup #search-table': 'searchTable',
      'click #ferting-button': 'closeContact',
    },
    createTable (contactListXml){
      const table = document.createElement('table');
      table.className = "sortable";

      const headerTexts = ['#','name', 'surname', 'position', 'email', 'kunde/admin', 'invitation status', 'profile', 'actions'];
      if(table){
        const header = table.createTHead();
        const row = header.insertRow();
        console.log('AQUIII', row)
        headerTexts.forEach((element, index) => {
          console.log(index, "indexxxxxxxxxxx")
          const cell = document.createElement('th');
          if(index === 0 || index === 5 || index === 6 || index === 7|| index === 8){
            cell.className = 'no-sort';
          }
          cell.innerHTML = element;
          row.appendChild(cell)
        });
      }
      const list =  contactListXml.children;
      const tbody = document.createElement('tbody');
      tbody.setAttribute("id", "myTable");
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
            this.appendElemtns(j, cellTd)

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
      console.log(e.target.value, "evtt")
      var value = e.target.value;
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
    appendElemtns(j, cellTd){
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
          checkboxKunde.name = 'kunde'; 
          checkboxKunde.value = 'kunde'; 
          checkboxKunde.id = 'kunde'; 
          const checkboxAdmin = document.createElement('input'); 
          checkboxAdmin.type = 'radio'; 
          checkboxAdmin.name = 'kunde'; 
          checkboxAdmin.value = 'kunde'; 
          checkboxAdmin.id = 'kunde'; 
          const labelKunde = document.createElement('label'); 
          labelKunde.appendChild(document.createTextNode('kunde')); 
          const labelAdmin = document.createElement('label'); 
          labelAdmin.appendChild(document.createTextNode('admin')); 
          cellTd.appendChild(checkboxKunde);
          cellTd.appendChild(labelKunde);
          cellTd.appendChild(checkboxAdmin);
          cellTd.appendChild(labelAdmin);
          break;
        // eslint-disable-next-line no-case-declarations
        case 6:
          const button = document.createElement('button');
          button.innerHTML = 'invitation status';  
          cellTd.appendChild(button);
          break;
        // eslint-disable-next-line no-case-declarations
        case 8:
          // eslint-disable-next-line no-case-declarations
          const buttonEdit = document.createElement('button');
          buttonEdit.innerHTML = 'Edit';  
          const buttonRemove = document.createElement('button');
          buttonRemove.innerHTML = 'Remove';  
          cellTd.appendChild(buttonEdit);
          cellTd.appendChild(buttonRemove);
          break;
        default:
          break;
      }
    },
  });



})();
