/* global Whisper: false */
/* global textsecure: false */

// eslint-disable-next-line func-names
(function () {
  'use strict';

  window.Whisper = window.Whisper || {};

  Whisper.EditCompanyView = Whisper.View.extend({
    templateName: 'edit-company',
    className: 'edit-company',
    template: $('#edit-company').html(),
    render_attributes() {

      return {
        'send-message': i18n('sendMessage'),
        model: this.model,
        company_name: this.model[0].company_name,
        company_avatar: getAvatar(textsecure.storage.get('companyNumber', null)),
      };
    },
    initialize() {
      this.render();
      // eslint-disable-next-line func-names
      this.$('img').on('error', function() {
        $(this).attr('src', 'images/header-chat.png');
      });
    },

    events: {
      'click #editName': 'editCompanyName',
      'click #doneIcon': 'saveNewCompanyName',
      'click #editAvatar': 'editCompanyAvatar',
      'change #inputNewAvatar': 'onChooseAvatarFile',
    },
    editCompanyAvatar() {
      this.$('#inputNewAvatar').click();
    },
    async onChooseAvatarFile() {
      const company_id = textsecure.storage.get('companyNumber', null)
      const fileField = this.$('#inputNewAvatar')[0].files[0];
      let base64 = '';
      const imageType = this.$('#inputNewAvatar')[0].files[0].type;
      const width = 140;
      const height = 140;
      const fileName = this.$('#inputNewAvatar')[0].files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(fileField);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        // eslint-disable-next-line no-unused-expressions
        (img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            async blob => {
              base64 = new File([blob], fileName, {
                type: imageType,
                lastModified: Date.now(),
              });
              base64 = await toBase64(base64);
              if (base64) {
                this.$('#companyAvatar').attr('src', base64);
              }
              // eslint-disable-next-line prefer-destructuring
              base64 = base64.split(',')[1];
              const dataCompanyAvatar = {
                data: base64,
                type: imageType.split('/')[1],
              };
              textsecure.storage.put('dataCompanyAvatar', dataCompanyAvatar);
              setCompanyAvatar(company_id, dataCompanyAvatar);
            }, imageType, 1
          );
          // eslint-disable-next-line no-sequences
        }),
          (reader.onerror = error => console.log(error));
      };
    },
    editCompanyName() {
      this.$('#nameSection').hide();
      const settingEditName = document.createElement('div');
      settingEditName.id = 'settingEditName';

      const textarea = document.createElement('textarea');
      textarea.className = 'editTextareaCompanyName'
      textarea.id = 'newCompanyName';
      textarea.placeholder = 'new company name';
      textarea.innerHTML = this.model[0].company_name;

      const doneIcon = document.createElement('img');
      doneIcon.id = 'doneIcon';
      doneIcon.src = 'images/icons/edit-blue.svg'
      doneIcon.className = 'editIcon'

      settingEditName.append(textarea);
      settingEditName.append(doneIcon);

      this.$('#edit_company_data').append(settingEditName)
    },
    async saveNewCompanyName() {
      const company_id = textsecure.storage.get('companyNumber', null);
      const newName = this.$('#newCompanyName').val();
      await updateCompanyName(newName, company_id)
      await getCompany(company_id);
      this.$('#spanCompanyName').text(newName);
      this.$('#settingEditName').remove();
      this.$('#nameSection').show();
    },
  });
})();
