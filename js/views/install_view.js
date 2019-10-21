/* global Whisper, i18n, getAccountManager, $, _, textsecure, QRCode */

/* eslint-disable more/no-then */

// eslint-disable-next-line func-names
(function () {
  'use strict';

  window.Whisper = window.Whisper || {};

  const EULA = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a magna purus. Pellentesque bibendum a nisl et venenatis. Integer viverra lectus id leo blandit fringilla. Etiam quis tempor tortor. Sed sed finibus nunc. Donec luctus risus ac velit malesuada, at sodales sem ultricies. Fusce et enim sit amet enim eleifend volutpat. Quisque ut eros quis diam blandit elementum. Quisque iaculis urna ante. Vivamus vehicula lacinia felis ut sollicitudin.

Fusce egestas ligula a placerat fringilla. Fusce luctus tincidunt metus, sit amet commodo tellus dapibus vitae. Donec tortor augue, aliquam vitae felis ut, vulputate viverra nisi. Ut quis odio rhoncus, lacinia libero non, placerat tellus. Nam quis auctor nisi, vitae maximus eros. Donec sagittis, ipsum in dictum placerat, lectus ligula pulvinar ligula, pharetra volutpat odio nisl sed mi. Maecenas vitae blandit tortor.

Pellentesque semper sit amet odio sed tempor. Donec at accumsan ligula, in venenatis augue. Nam venenatis dolor eu metus placerat euismod. Suspendisse cursus justo sit amet justo venenatis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin faucibus dictum dictum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent ut ex nunc. Fusce non vehicula ligula, sed laoreet ipsum. Etiam laoreet odio in dui congue, vel pulvinar sem interdum. Nullam porta erat vitae metus laoreet, ut aliquet sem pellentesque. Donec at lectus in felis porttitor scelerisque. Nulla sed hendrerit metus. Phasellus consequat tellus orci, id volutpat purus commodo a. Duis ut mattis orci. Etiam ipsum arcu, scelerisque et ex a, pellentesque cursus urna.

Nullam congue tempor vulputate. Nunc blandit nunc ut viverra aliquam. Nunc risus lorem, sodales eget ligula et, mollis euismod turpis. Morbi consectetur vehicula laoreet. Vestibulum egestas ipsum a mauris malesuada, eu dignissim arcu scelerisque. Suspendisse aliquam purus quam, non semper nisl consectetur ut. Nulla vel elit a turpis finibus aliquet. In dignissim tincidunt feugiat. Mauris placerat mattis urna. Morbi egestas justo in risus pellentesque mattis. Aenean ipsum nulla, luctus a laoreet a, rutrum quis massa. Donec fringilla enim ante, nec convallis metus finibus ac. Suspendisse ac nibh ac quam placerat euismod non non arcu. Integer sed tellus mauris. Sed et libero a libero mollis tristique at ut ex.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a magna purus. Pellentesque bibendum a nisl et venenatis. Integer viverra lectus id leo blandit fringilla. Etiam quis tempor tortor. Sed sed finibus nunc. Donec luctus risus ac velit malesuada, at sodales sem ultricies. Fusce et enim sit amet enim eleifend volutpat. Quisque ut eros quis diam blandit elementum. Quisque iaculis urna ante. Vivamus vehicula lacinia felis ut sollicitudin.

Fusce egestas ligula a placerat fringilla. Fusce luctus tincidunt metus, sit amet commodo tellus dapibus vitae. Donec tortor augue, aliquam vitae felis ut, vulputate viverra nisi. Ut quis odio rhoncus, lacinia libero non, placerat tellus. Nam quis auctor nisi, vitae maximus eros. Donec sagittis, ipsum in dictum placerat, lectus ligula pulvinar ligula, pharetra volutpat odio nisl sed mi. Maecenas vitae blandit tortor.

Pellentesque semper sit amet odio sed tempor. Donec at accumsan ligula, in venenatis augue. Nam venenatis dolor eu metus placerat euismod. Suspendisse cursus justo sit amet justo venenatis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin faucibus dictum dictum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent ut ex nunc. Fusce non vehicula ligula, sed laoreet ipsum. Etiam laoreet odio in dui congue, vel pulvinar sem interdum. Nullam porta erat vitae metus laoreet, ut aliquet sem pellentesque. Donec at lectus in felis porttitor scelerisque. Nulla sed hendrerit metus. Phasellus consequat tellus orci, id volutpat purus commodo a. Duis ut mattis orci. Etiam ipsum arcu, scelerisque et ex a, pellentesque cursus urna.

Nullam congue tempor vulputate. Nunc blandit nunc ut viverra aliquam. Nunc risus lorem, sodales eget ligula et, mollis euismod turpis. Morbi consectetur vehicula laoreet. Vestibulum egestas ipsum a mauris malesuada, eu dignissim arcu scelerisque. Suspendisse aliquam purus quam, non semper nisl consectetur ut. Nulla vel elit a turpis finibus aliquet. In dignissim tincidunt feugiat. Mauris placerat mattis urna. Morbi egestas justo in risus pellentesque mattis. Aenean ipsum nulla, luctus a laoreet a, rutrum quis massa. Donec fringilla enim ante, nec convallis metus finibus ac. Suspendisse ac nibh ac quam placerat euismod non non arcu. Integer sed tellus mauris. Sed et libero a libero mollis tristique at ut ex.

Donec pellentesque sapien nec congue aliquam. Maecenas auctor dictum massa, in feugiat dolor hendrerit rutrum. In a diam faucibus, pharetra erat non, consequat leo. Duis scelerisque, libero vitae sagittis fermentum, ex ante ultricies nisi, et ultricies libero dolor sit amet dui. Praesent porttitor interdum ipsum, nec faucibus dui dapibus sit amet. Nullam elementum mauris cursus imperdiet faucibus. Sed at nunc feugiat sapien mollis viverra. Morbi a erat ac odio placerat tempor. Vestibulum auctor justo blandit lorem consectetur, sit amet egestas ante viverra. Aenean ullamcorper congue nulla, vel ultricies arcu molestie a. Morbi vel rutrum lacus. Etiam vitae velit commodo, malesuada nisl at, bibendum neque. Mauris id elit molestie, ornare orci iaculis, sollicitudin neque. Ut maximus odio est, non ornare odio auctor eget. Morbi ullamcorper sollicitudin malesuada. Ut pharetra ex nulla, vel commodo massa luctus ut.`;

  const Steps = {
    ACCEPT_EULA: 1,
    SETUP_TYPE: 2,
    SETUP_PHONE: 3,
    SETUP_COMPANY_PROFILE: 4,
    SETUP_COMPANY_BANK: 5,
    SETUP_USER_PROFILE: 6,
    SETUP_CONTACT_IMPORT: 7,
    SETUP_BRANCHEN: 8,
    SETUP_PHONESLIST: 9,
  };

  let Tmp = {};
  Whisper.InstallView = Whisper.View.extend({
    templateName: 'install-flow-template',
    className: 'main full-screen-flow',
    events: {
      'change #accept-eula-check': 'onChangeAcceptEula',
      'click #continue-eula': 'onContinueEula',
      'click #continue-setup-company': 'onCompanySetup',
      'click #continue-setup-admin': 'onAdminSetup',
      // 'validation #phone-number-value': 'onNumberValidation',
      'click #request-verify-call': 'onRequestVerifyCall',
      'click #request-verify-sms': 'onRequestVerifySMS',
      // 'change #phone-verification-code': 'onChangeVerifyCode',
      'click #verify-phone-code': 'onVerifyPhone',
      'click #phone-number-country': 'onOpenSelectPhoneList',
      'keyup #search-phones': 'searchPhones',
      'click #phone-list p': 'onSelectPhone',
      'keyup #phone-number-value': 'activateButtonVerifyCall',
      'keyup #phone-verification-code': 'activateButtonVerifyCode',
      'click #company-profile-done': 'onCompanyProfileDone',
      'click #branch-select': 'onOpenSelectBranch',
      'keyup #search-branch': 'searchBranch',
      'click #branch-list > p': 'onSelectBranch',
      'keyup  #tax-number-input, #tax-id-input, #company-register-id-input, #imprint-input, #branch-select':
        'activateButtonCompanyInfo',
      'keyup #user-name-input, #company-name-input':
        'activateButtonProfileDetails',
      'keyup #bank-iban-input, #bank-bic-input': 'activateButtonBankDetails',
      'click #user-profile-done': 'onUserProfileDone',
      'click #bank-details-done': 'onBankDetailsDone',
      'click #bank-details-skip': 'onBankDetailsSkip',
      'click #contact-import-done': 'onContactImportDone',
      'click #contact-import-skip': 'onContactImportSkip',
      'click #uploadAvatar': 'onUploadAvatar',
      'change #inputAvatar': 'onChoseAvatar',
      'click #uploadCompanyAvatar': 'onUploadCompanyAvatar',
      'change #inputCompanyAvatar': 'onChoseCompanyAvatar',
      'click #uploadDocuments': 'onuploadDocuments',
      'change #inputDocument': 'onChoseDocument',
      'click #clear-country': 'onClearCountry',
      'click #clear-branchen': 'onClearBranchen',
      'click #contact-import-file-select': 'onChooseContactsFile',
      'change #contact-import-file-input': 'onChoseContactsFile',
    },
    initialize(options = {}) {
      this.accountManager = getAccountManager();

      const eulaAccepted = textsecure.storage.get('eulaAccepted', false);
      this.setupType = textsecure.storage.get('setupType', null);
      const number = textsecure.storage.user.getNumber();
      if (!eulaAccepted) {
        this.selectStep(Steps.ACCEPT_EULA);
      } else if (!this.setupType) {
        this.selectStep(Steps.SETUP_TYPE);
      } else if (this.setupType) {
        if (!number) this.selectStep(Steps.SETUP_PHONE);
        else
          this.selectStep(
            this.setupType === 'admin'
              ? Steps.SETUP_USER_PROFILE
              : Steps.SETUP_COMPANY_PROFILE
          );
      }
    },
    selectStep(step) {
      if (this.step === Steps.ACCEPT_EULA) {
        this.$('.eula-text').off('scroll');
      }

      this.step = step;
      if (this.setupType == 'admin') {
        this.setupTypeAdmin = true
      } else if (this.setupType == 'company') {
        this.setupTypeCompany = true;
      }
      this.render();

      if (this.step === Steps.SETUP_COMPANY_PROFILE) {
        const info = textsecure.storage.get('companySetupInfo', null);
        if (info) {
          this.$('#tax-number-input').val(info.taxNumber);
          this.$('#tax-id-input').val(info.taxID);
          this.$('#company-register-id-input').val(info.registerID);
          this.$('#imprint-input').val(info.imprint);
          this.$('#branch-select').val(info.branch);
        }
        this.activateButtonCompanyInfo();
      }

      if (this.step === Steps.SETUP_USER_PROFILE) {
        const info = textsecure.storage.get('userSetupInfo', null);
        if (info) {
          this.$('#user-name-input').val(info.name);
          this.$('#company-name-input').val(info.companyName);
        }
        this.activateButtonProfileDetails();
      }

      if (this.step === Steps.SETUP_COMPANY_BANK) {
        const info = textsecure.storage.get('bankSetupInfo', null);
        if (info) {
          this.$('#bank-iban-input').val(info.iban);
          this.$('#bank-bic-input').val(info.bic);
        }
        this.activateButtonBankDetails();
      }

      // if (this.step === Steps.ACCEPT_EULA) {
      //   this.$('.eula-text').on(
      //     'scroll',
      //     _.debounce(this.onEulaScroll.bind(this), 100)
      //   );
      // }
      if (this.step === Steps.SETUP_PHONE) {
        const number = textsecure.storage.user.getNumber();
        if (number) this.$('#phone-number-value').val(number);
        // this.phoneView = new Whisper.PhoneInputView({
        //   el: this.$('#phone-number-input'),
        // });
      } else {
        if (this.phoneView) this.phoneView.remove();
        this.phoneView = null;
      }
    },
    async onSetupCompleted() {
      try {
        /*
        const phone = textsecure.storage.user.getNumber();
        const user = textsecure.storage.get('userSetupInfo', null);
        */

        if (this.setupType === 'company') {
          const company = textsecure.storage.get('companySetupInfo', null);
          const userSetupInfo = textsecure.storage.get('userSetupInfo', null);
          const bank = textsecure.storage.get('bankSetupInfo', null);
          const result = await createCompany({
            name: userSetupInfo.companyName,
            business: company.branch,
            tax_number: company.taxNumber,
            tax_id: company.taxID,
            commarcial_register: company.registerID,
            iban: bank ? bank.iban : null,
            bic: bank ? bank.bic : null,
          });
          textsecure.storage.put('companyNumber', result.info.company_number);
          const test = await updateAdmin(
            result.info.company_number,
            userSetupInfo.name || ''
          );
          const avatarInfo = await textsecure.storage.get('avatarInfo', null);
          const avatarCompanyInfo = await textsecure.storage.get('dataCompanyAvatar', null);
          if (avatarInfo) {
            const dataAvatar = { data: avatarInfo.userAvatar, type: avatarInfo.userAvatarType }
            await setAdminAvatar(result.info.company_number, dataAvatar);
          }
          if (avatarCompanyInfo) {
            const dataCompanyAvatar = { data: avatarCompanyInfo.companyAvatar, type: avatarCompanyInfo.companyAvatarType }
            await setCompanyAvatar(result.info.company_number, dataCompanyAvatar);
          }
          // do pupdate avatar
          if (this.contactsData) {
            await updateContact(result.info.company_number, this.contactsData);
          }
          await ensureCompanyConversation(result.info.company_number);
        } else if(this.setupType === 'admin'){
          const codeCompany = textsecure.storage.get('codeCompany', false);
          const userSetupInfo = textsecure.storage.get('userSetupInfo', null);
          const avatarInfo = await textsecure.storage.get('avatarInfo', null);
          const role = await textsecure.storage.get('role', null);
          // const client_uuid = await textsecure.storage.get('client_uuid', null);
          
      
          if (avatarInfo) {
            const dataAvatar = { data: avatarInfo.userAvatar, type: avatarInfo.userAvatarType }
            if(role === 'user'){
              await setClientAvatar(dataAvatar);
            } else {
              await setAdminAvatar(codeCompany, dataAvatar);
            }
          }
          const data = {
            name:  userSetupInfo.name,
          }
          if (avatarInfo) {
            const dataAvatar = { data: avatarInfo.userAvatar, type: avatarInfo.userAvatarType }
            await setAdminAvatar(codeCompany, dataAvatar);
          }
          await updateClient(data)
          await ensureCompanyConversation(codeCompany);
        }
        await Promise.all([
          textsecure.storage.put('registerDone', true),
          textsecure.storage.remove('companySetupInfo'),
          textsecure.storage.remove('userSetupInfo'),
          textsecure.storage.remove('bankSetupInfo'),
          textsecure.storage.remove('setupType'),
          textsecure.storage.remove('codeCompany'),
        ]);
        window.removeSetupMenuItems();
        this.$el.trigger('openInbox');
      } catch (err) {
        console.error(err);
      }
    },
    onChooseContactsFile(e) {
      if (e.target.tagName === 'INPUT') return;
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      this.$('#contact-import-file-input').click();
    },
    async onChoseContactsFile() {
      const input = this.$('#contact-import-file-input');
      const files = input.get(0).files;
      let file = files[0];
      this.$('#contact-import-file-error').text('');
      if (file) {
        try {
          const xml = await readFileAsText(file);
          console.log(xml);
          checkValidXML(xml);
          this.contactsData = xml;
          this.contactsData = {
            'contact_data': this.contactsData.toString().replace('\n', ''),
          }
        } catch (err) {
          // TODO: show invalid xml error
          console.error(err);
          input.val('');
          this.$('#contact-import-file-error').text(i18n('invalidXML'));
          file = null;
        }
      }
      if (!file) this.contactsData = null;
      this.$('#contact-import-done').toggleClass('disabled', !file);
      this.$('#contact-import-file-name').text(
        file ? file.path || file.name : i18n('noFileChosen')
      );
      console.log('Import file chose', files);
    },
    onContactImportDone() {
      if (this.$('#contact-import-done').is('.disabled')) return;
      this.onSetupCompleted();
    },
    onContactImportSkip() {
      this.onSetupCompleted();
    },
    async onCompanyProfileDone() {
      const company = {
        taxNumber: this.$('#tax-number-input').val(),
        taxID: this.$('#tax-id-input').val(),
        registerID: this.$('#company-register-id-input').val(),
        imprint: this.$('#imprint-input').val(),
        branch: this.$('#branch-select').val(),
      };
      await textsecure.storage.put('companySetupInfo', company);
      this.selectStep(Steps.SETUP_USER_PROFILE);
    },
    async onUserProfileDone() {
      const profile = {
        name: this.$('#user-name-input').val(),
        companyName: this.$('#company-name-input').val(),
      };
      await textsecure.storage.put('userSetupInfo', profile);
      this.selectStep(
        this.setupType === 'admin'
          ? Steps.SETUP_CONTACT_IMPORT
          : Steps.SETUP_COMPANY_BANK
      );
    },
    async onBankDetailsDone() {
      const bank = {
        iban: this.$('#bank-iban-input').val(),
        bic: this.$('#bank-bic-input').val(),
      };
      await textsecure.storage.put('bankSetupInfo', bank);
      this.selectStep(Steps.SETUP_CONTACT_IMPORT);
    },
    async onBankDetailsSkip() {
      await textsecure.storage.remove('bankSetupInfo');
      this.selectStep(Steps.SETUP_CONTACT_IMPORT);
    },
    onClearCountry() {
      this.$('#search-phones').val('');
      const countries = this.$('.pCountry');
      for (let i = 0; i < countries.length; i++) {
        if (countries[i].style.display === 'none') {
          countries[i].style.display = 'block';
        }
      }
    },
    onClearBranchen() {
      this.$('#search-branch').val('');
      const branches = this.$('#branch-list p');
      for (let i = 0; i < branches.length; i++) {
        if (branches[i].style.display === 'none') {
          branches[i].style.display = 'block';
        }
      }
    },
    validateNumber() {
      const input = this.$('input.number');
      const dialCode = this.$('#dialCode').text();
      const number = dialCode + input.val();
      const regionCode = this.$('#countryCode')
        .text()
        .toLowerCase();

      const parsedNumber = libphonenumber.util.parseNumber(number, regionCode);
      if (parsedNumber.isValidNumber) {
        this.$('.number-container').removeClass('invalid');
        this.$('.number-container').addClass('valid');
      } else {
        this.$('.number-container').removeClass('valid');
      }
      input.trigger('validation');

      return parsedNumber.e164;
    },
    onRequestVerifyCall() {
      const number = this.validateNumber();
      this.$('#request-verify-call').html(`<div class='container'>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                              </div>`)
      if (number) {
        this.accountManager.requestVoiceVerification(number).then(resp => {
          this.$('#request-verify-call').html(i18n('callPhone'))
        }).catch(err => {
          console.error('Error requesting Voice verification', err);
          this.$('#request-verify-call').html(i18n('callPhone'))
        });
      }
    },
    onRequestVerifySMS() {
      const number = this.validateNumber();
      this.$('#verify-phone-code').html(`<div class='container'>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                                <div class='dot'></div>
                                              </div>`)
      if (number) {
        this.accountManager.requestSMSVerification(number).then(resp => {
          this.$('#verify-phone-code').html(i18n('verifyPhone'));
        }).catch(err => {
          console.error('Error requesting SMS verification', err);
          this.$('#verify-phone-code').html(i18n('verifyPhone'))
        });
      }
    },
    async onCompanySetup() {
      this.setupType = 'company';
      await textsecure.storage.put('setupType', this.setupType);
      this.selectStep(Steps.SETUP_PHONE);
    },
    async onAdminSetup() {
      // TODO: check code is present & valid
      this.setupType = 'admin';
      const codeInvitation = this.$('#admin-signup-code').val();
      const codeCompany = this.$('#admin-company-code').val();
      await textsecure.storage.put('setupType', this.setupType);
      await textsecure.storage.put('codeInvitation', codeInvitation);
      await textsecure.storage.put('codeCompany', codeCompany);

      this.selectStep(Steps.SETUP_PHONE);
    },
    async onVerifyPhone() {
      // TODO: check phone verification code
      const number = this.validateNumber();
      const code = this.$('#phone-verification-code')
        .val()
        .replace(/\D+/g, '');

      this.accountManager
        .registerSingleDevice(number, code)
        .then(async () => {
          if(this.setupType == 'admin'){
            const codeCompany = textsecure.storage.get('codeCompany', false);
            const codeInvitation = textsecure.storage.get('codeInvitation', false);
            const company= await checkCodeInvitation(codeCompany, codeInvitation);
            console.log(company, "companyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
             textsecure.storage.put('companyNumber', company.company.company_number);
             textsecure.storage.put('role', company.role);
            //  textsecure.storage.put('client_uuid', company.client_uuid);
          }
          this.selectStep(
            this.setupType === 'admin'
              ? Steps.SETUP_USER_PROFILE
              : Steps.SETUP_COMPANY_PROFILE
          );
        })
        .catch(err => {
          console.error('Error registering single device', err);
        });

    },
    onChangeAcceptEula() {
      console.log('Change accept eula');
      const check = this.$el.find('#accept-eula-check');
      const button = this.$el.find('#continue-eula');
      if (check.is(':checked')) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    // onEulaScroll() {
    //   const eula = this.$el.find('.eula-text').get(0);
    //   const atBottom = eula.scrollHeight - eula.scrollTop === eula.clientHeight;
    //   // this.model.set('eula_read', atBottom);
    //   const check = this.$el.find('#accept-eula-check');
    //   const button = this.$el.find('#continue-eula');
    //   check.prop('disabled', !atBottom);
    //   if (!atBottom) {
    //     check.prop('checked', false);
    //     button.addClass('disabled');
    //   }
    //   console.log(eula.scrollHeight, eula.scrollTop, eula.clientHeight);
    //   console.log('Eula scroll', atBottom);
    // },
    onContinueEula() {
      const button = this.$el.find('#continue-eula');
      if (button.is('.disabled')) return;
      console.log('Continue eula');
      textsecure.storage.put('eulaAccepted', true).then(() => {
        this.selectStep(Steps.SETUP_TYPE);
      });
    },
    // Functions for upload User Avatar
    onUploadAvatar() {
      this.$('#inputAvatar').click();
    },
    // TODO HOOK API for upload avatar
    async onChoseAvatar() {
      const fileField = this.$('#inputAvatar')[0].files[0];
      // const base64 = await toBase64(fileField);
      let base64 = '';
      const imageType = this.$('#inputAvatar')[0].files[0].type;

      const width = 80;
      const height = 80;
      const fileName = this.$('#inputAvatar')[0].files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(fileField);

      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        // eslint-disable-next-line no-unused-expressions
        img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(async (blob) => {
            base64 = new File([blob], fileName, {
              type: imageType,
              lastModified: Date.now(),
            });
            base64 = await toBase64(base64);
            // eslint-disable-next-line prefer-destructuring
            base64 = base64.split(',')[1];
            const avatarInfo = { userAvatar: base64, userAvatarType: imageType.split('/')[1] }
            textsecure.storage.put('avatarInfo', avatarInfo);
          }, imageType, 1);
          // eslint-disable-next-line no-sequences
        },
          reader.onerror = error => console.log(error);
      };
    },
    // Functions for upload Company Avatar
    onUploadCompanyAvatar() {
      this.$('#inputCompanyAvatar').click();
    },
    // TODO HOOK API for upload avatar
    async onChoseCompanyAvatar() {
      const fileField = this.$('#inputCompanyAvatar')[0].files[0];
      let base64 = '';
      const imageType = this.$('#inputCompanyAvatar')[0].files[0].type;
      const width = 80;
      const height = 80;
      const fileName = this.$('#inputCompanyAvatar')[0].files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(fileField);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        // eslint-disable-next-line no-unused-expressions
        img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(async (blob) => {
            base64 = new File([blob], fileName, {
              type: imageType,
              lastModified: Date.now(),
            });
            base64 = await toBase64(base64);
            // eslint-disable-next-line prefer-destructuring
            base64 = base64.split(',')[1];
            const dataCompanyAvatar = { companyAvatar: base64, companyAvatarType: imageType.split('/')[1] }
            textsecure.storage.put('dataCompanyAvatar', dataCompanyAvatar);
          }, imageType, 1);
          // eslint-disable-next-line no-sequences
        },
          reader.onerror = error => console.log(error);
      };
    },
    // Functions for upload documents
    onuploadDocuments() {
      this.$('#inputDocument').click();
    },
    // TODO HOOK API for upload avatar
    async onChoseDocument() {
      const fileField = this.$('#inputDocument');
      const file = fileField.prop('files');
    },
    activateButtonCompanyInfo() {
      const taxNumber = this.$el.find('#tax-number-input')[0].value.length;
      const taxID = this.$el.find('#tax-id-input')[0].value.length;
      const comercialRegisterId = this.$el.find('#company-register-id-input')[0]
        .value.length;
      const imprint = this.$el.find('#imprint-input')[0].value.length;
      const branch = this.$el.find('#branch-select')[0].value.length;
      const button = this.$el.find('#company-profile-done');
      if (
        taxNumber > 0 &&
        taxID > 0 &&
        comercialRegisterId > 0 &&
        imprint > 0 &&
        branch > 0
      ) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    activateButtonProfileDetails() {
      const username = this.$el.find('#user-name-input')[0].value.length;
      const button = this.$el.find('#user-profile-done');
      
      let companyName = '';
      if(this.setupTypeCompany){
        companyName = this.$el.find('#company-name-input')[0].value.length;
        if (companyName > 0) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      } else if (this.setupTypeAdmin) {
        if (username > 0) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      }
    },
    activateButtonBankDetails() {
      const bankIBAN = this.$el.find('#bank-iban-input')[0].value.length;
      const bankBIC = this.$el.find('#bank-bic-input')[0].value.length;
      const button = this.$el.find('#bank-details-done');
      if (bankIBAN > 0 && bankBIC > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    onOpenSelectBranch() {
      Tmp = {
        taxNumber: this.$el.find('#tax-number-input')[0].value,
        taxID: this.$el.find('#tax-id-input')[0].value,
        comercialRegisterId: this.$el.find('#company-register-id-input')[0]
          .value,
        imprint: this.$el.find('#imprint-input')[0].value,
      };
      this.selectStep(Steps.SETUP_BRANCHEN);
    },
    onSelectBranch(e) {
      this.selectStep(Steps.SETUP_COMPANY_PROFILE);
      this.$('#tax-number-input').val(Tmp.taxNumber);
      this.$('#tax-id-input').val(Tmp.taxID);
      this.$('#company-register-id-input').val(Tmp.comercialRegisterId);
      this.$('#imprint-input').val(Tmp.imprint);
      this.$('#branch-select').val(e.target.textContent);
      this.activateButtonCompanyInfo();
      this.resetTMP();
    },
    searchBranch(e) {
      const value = e.target.value;
      $('#branch-list p').filter(function () {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    loadCountries() {
      const thisElement = this;
      $.ajax({
        type: 'GET',
        url: 'config/countries.json', // Using our resources.json file to serve results
        success: result => {
          const countries = JSON.parse(result);
          countries.sort((a, b) => {
            return a['name'] > b['name'] ? 1 : a['name'] < b['name'] ? -1 : 0;
          });
          for (let i = 0; i < countries.length; i++) {
            const pItem = `<p class="pCountry" data-country-code="${
              countries[i].code
              }" data-dial-code="${countries[i].dial_code}">${
              countries[i].name
              } <span class="spanDialCode">${countries[i].dial_code}</span></p>`;
            thisElement.$('#phone-list').append(pItem);
          }
        },
        error: e => {
          console.log('Error getting countries', e);
        },
      });
    },
    onOpenSelectPhoneList() {
      this.loadCountries();
      Tmp = {
        phoneNumber: this.$el.find('#phone-number-value')[0].value,
      };
      this.selectStep(Steps.SETUP_PHONESLIST);
    },
    onSelectPhone(e) {
      this.selectStep(Steps.SETUP_PHONE);
      this.$('#countryCode').text(
        `${e.target.getAttribute('data-country-code')}`
      );
      this.$('#dialCode').text(` ${e.target.getAttribute('data-dial-code')}`);
      this.$('#phone-number-value').val(Tmp.phoneNumber);
      this.activateButtonVerifyCall();
      this.resetTMP();
    },
    searchPhones(e) {
      var value = e.target.value;
      $('#phone-list p').filter(function () {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    activateButtonVerifyCall() {
      const number = this.$el.find('#phone-number-value')[0].value.length;
      const button = this.$el.find('#request-verify-call');
      if (number > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    activateButtonVerifyCode() {
      const code = this.$el.find('#phone-verification-code')[0].value.length;
      const button = this.$el.find('#verify-phone-code');
      if (code > 0) {
        button.removeClass('disabled');
      } else {
        button.addClass('disabled');
      }
    },
    resetTMP() {
      Tmp = {};
    },
    render_attributes() {
      return {
        appTagLine: i18n('appTagLine'),
        eulaTitle: i18n('eulaTitle'),
        eulaSubTitle: i18n('eulaSubTitle'),
        acceptEula: i18n('acceptEula'),
        registerCompany: i18n('registerCompany'),
        registerAdmin: i18n('registerAdmin'),
        welcomeCompany: i18n('welcomeCompany'),
        welcomeAdmin: i18n('welcomeAdmin'),
        continueButton: i18n('continueButton'),
        signupCode: i18n('signupCode'),
        companyCode: i18n('companyCode'),
        phoneSetupTitle: i18n('phoneSetupTitle'),
        phoneSetupSubtitle: i18n('phoneSetupSubtitle'),
        phoneNumber: i18n('phoneNumber'),
        countryCode: i18n('countryCode'),
        verifyCode: i18n('verifyCode'),
        callPhone: i18n('callPhone'),
        sendSMSInstead: i18n('sendSMSInstead'),
        verifyPhone: i18n('verifyPhone'),
        companyDetails: i18n('companyDetails'),
        companyName: i18n('companyName'),
        taxNumber: i18n('taxNumber'),
        taxID: i18n('taxID'),
        companyRegistrationID: i18n('companyRegistrationID'),
        imprint: i18n('imprint'),
        branch: i18n('branch'),
        uploadCompanyRegister: i18n('uploadCompanyRegister'),
        userProfile: i18n('userProfile'),
        userName: i18n('userName'),
        bankDetails: i18n('bankDetails'),
        notNow: i18n('notNow'),
        contactImportTitle: i18n('contactImportTitle'),
        selectFileToUpload: i18n('selectFileToUpload'),
        noFileChosen: i18n('noFileChosen'),
        uploadCard: i18n('uploadCard'),
        uploadCompanyAvatarText: i18n('uploadCompanyAvatarText'),

        isStepEula: this.step === Steps.ACCEPT_EULA,
        isStepSetupType: this.step === Steps.SETUP_TYPE,
        isStepSetupPhone: this.step === Steps.SETUP_PHONE,
        isStepSetupCompanyProfile: this.step === Steps.SETUP_COMPANY_PROFILE,
        isStepSetupCompanyBank: this.step === Steps.SETUP_COMPANY_BANK,
        isStepSetupUserProfile: this.step === Steps.SETUP_USER_PROFILE,
        isStepSetupContactImport: this.step === Steps.SETUP_CONTACT_IMPORT,
        isStepSetupBranchen: this.step === Steps.SETUP_BRANCHEN,
        isStepSetupPhoneList: this.step === Steps.SETUP_PHONESLIST,
        setupTypeAdmin: this.setupTypeAdmin,
        setupTypeCompany: this.setupTypeCompany,
        EULAText: EULA,
        uploadAvatarText: i18n('uploadAvatarText'),
        BranchenTitle: i18n('BranchenTitle'),
        BranchOption1: i18n('BranchOption1'),
        BranchOption2: i18n('BranchOption2'),
        BranchOption3: i18n('BranchOption3'),
        BranchOption4: i18n('BranchOption4'),
        BranchOption5: i18n('BranchOption5'),
        BranchOption6: i18n('BranchOption6'),
        BranchOption7: i18n('BranchOption7'),
        BranchOption8: i18n('BranchOption8'),
        BranchOption9: i18n('BranchOption9'),
        BranchOption10: i18n('BranchOption10'),
        BranchOption11: i18n('BranchOption11'),
        BranchOption12: i18n('BranchOption12'),
        BranchOption13: i18n('BranchOption13'),
        BranchOption14: i18n('BranchOption14'),
        BranchOption15: i18n('BranchOption15'),
        BranchOption16: i18n('BranchOption16'),
        BranchOption17: i18n('BranchOption17'),
        BranchOption18: i18n('BranchOption18'),
        BranchOption19: i18n('BranchOption19'),
        BranchOption20: i18n('BranchOption20'),
        BranchOption21: i18n('BranchOption21'),
        BranchOption22: i18n('BranchOption22'),
        BranchOption23: i18n('BranchOption23'),
        BranchOption24: i18n('BranchOption24'),
        BranchOption25: i18n('BranchOption25'),
        BranchOption26: i18n('BranchOption26'),
        BranchOption27: i18n('BranchOption27'),
        BranchOption28: i18n('BranchOption28'),
        BranchOption29: i18n('BranchOption29'),
        BranchOption30: i18n('BranchOption30'),
        BranchOption31: i18n('BranchOption31'),
        BranchOption32: i18n('BranchOption32'),
        BranchOption33: i18n('BranchOption33'),
        BranchOption34: i18n('BranchOption34'),
        BranchOption35: i18n('BranchOption35'),
        BranchOption36: i18n('BranchOption36'),
        BranchOption37: i18n('BranchOption37'),
        BranchOption38: i18n('BranchOption38'),
        BranchOption39: i18n('BranchOption39'),
        BranchOption40: i18n('BranchOption40'),
        BranchOption41: i18n('BranchOption41'),
        BranchOption42: i18n('BranchOption42'),
        PhonesTitle: i18n('PhonesTitle'),
      };
    },
  });
})();
