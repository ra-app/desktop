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
      'click #ferting-button': "closeContact"
    },
    createTable (contactListXml){
      const table = document.createElement('table');

      const headerTexts = ['name', 'surname', 'position', 'email', 'kunde/admin', 'invitation status', 'profile'];
      if(table){
        const header = table.createTHead();
        const row = header.insertRow();
        headerTexts.forEach(element => {
          const cell = row.insertCell();
          cell.innerHTML = element;
        });
      }
      const list =  contactListXml.children;
      const tbody = document.createElement('tbody');
      tbody.setAttribute("id", "myTable");
      for (let i = 0; i < contactListXml.children.length; i++) {
        const contact = contactListXml.children.item(i);
        // console.log(contact, '77777777777777')
        const tableRow = document.createElement('tr');
        tbody.appendChild(tableRow);
        for (let j = 0; j < headerTexts.length; j++) {
          const cellTd = document.createElement('td');
          if(contact.getElementsByTagName(headerTexts[j])[0]){
            const cell = contact.getElementsByTagName(headerTexts[j])[0].textContent;
            // const cellTd = document.createElement('td');
            const cellTdContent = document.createTextNode(cell);
            // cellTd.style.cssText = 'text-align: left;padding: 5px;';
            cellTd.appendChild(cellTdContent);
          }
          tableRow.appendChild(cellTd);
        }
      }
      //Append content
      table.appendChild(tbody)
      this.$('#contactTable').append(table);


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
      console.log("closeeeeeeeeeeeeee")
      this.$el.trigger('openInbox');
    },
  });



})();
