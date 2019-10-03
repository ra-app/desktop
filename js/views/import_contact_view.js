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
        const xmlRes = parser.parseFromString(options.contact_data, "text/xml");
        console.log(xmlRes, "xmlresponsee");
      }
    },
  });



})();
