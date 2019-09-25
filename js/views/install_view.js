/* global Whisper, i18n, getAccountManager, $, _, textsecure, QRCode */

/* eslint-disable more/no-then */

// eslint-disable-next-line func-names
(function() {
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
    SETUP_PHONESLIST: 9
  };

  let Tmp = {};

  Whisper.InstallView = Whisper.View.extend({
    templateName: 'install-flow-template',
    className: 'main full-screen-flow',
    events: {
      'change #accept-eula-check': 'onChangeAcceptEula',
      'click #continue-eula': 'onContinueEula',
      'click #continue-setup-company': 'onCompanySetup',
      // 'click #continue-setup-admin': 'onAdminSetup',
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
      'keyup #company-name-input, #tax-number-input, #tax-id-input, #company-register-id-input, #imprint-input, #branch-select': 'activateButtonCompanyInfo',
      'keyup #user-name-input' : 'activateButtonProfileDetails',
      'keyup #bank-iban-input, #bank-bic-input' : 'activateButtonBankDetails',
      'click #user-profile-done': 'onUserProfileDone',
      'click #bank-details-done': 'onBankDetailsDone',
      'click #bank-details-skip': 'onBankDetailsSkip',
      'click #contact-import-done': 'onContactImportDone',
      'click #contact-import-skip': 'onContactImportSkip',
      'click #uploadAvatar': 'onUploadAvatar',
      'change #inputAvatar': 'onChoseAvatar',
      'click #uploadDocuments': 'onuploadDocuments',
      'change #inputDocument': 'onChoseDocument',
      
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
      this.render();

      if (this.step === Steps.SETUP_COMPANY_PROFILE) {
        const info = textsecure.storage.get('companySetupInfo', null);
        if (info) {
          this.$('#company-name-input').val(info.name);
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

      if (this.step === Steps.ACCEPT_EULA) {
        this.$('.eula-text').on(
          'scroll',
          _.debounce(this.onEulaScroll.bind(this), 100)
        );
      }
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
          const bank = textsecure.storage.get('bankSetupInfo', null);
          const result = await createCompany({
            name: company.name,
            business: company.branch,
            tax_number: company.taxNumber,
            tax_id: company.taxID,
            commarcial_register: company.registerID,
            iban: bank ? bank.iban : null,
            bic: bank ? bank.bic : null,
          });
          if (!result.success) throw new Error(result);
          textsecure.storage.put('companyNumber', result.info.company_number);
          await ensureCompanyConversation(result.info.company_number);
        }
        await Promise.all([
          textsecure.storage.put('registerDone', true),
          textsecure.storage.remove('companySetupInfo'),
          textsecure.storage.remove('userSetupInfo'),
          textsecure.storage.remove('bankSetupInfo'),
          textsecure.storage.remove('setupType'),
        ]);
        window.removeSetupMenuItems();
        this.$el.trigger('openInbox');
      } catch (err) {
        console.error(err);
      }
    },
    onContactImportDone() {
      this.onSetupCompleted();
    },
    onContactImportSkip() {
      this.onSetupCompleted();
    },
    async onCompanyProfileDone() {
      const company = {
        name: this.$('#company-name-input').val(),
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
    validateNumber() {
      const input = this.$('input.number');
      const dialCode = this.$('#dialCode').text();
      const number = dialCode + input.val();
     
      const regionCode = this.$('#countryCode').text().toLowerCase();

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
      if (number) {
        this.accountManager.requestVoiceVerification(number).catch(err => {
          console.error('Error requesting Voice verification', err);
        });
      }
    },
    onRequestVerifySMS() {
      const number = this.validateNumber();
      if (number) {
        this.accountManager.requestSMSVerification(number).catch(err => {
          console.error('Error requesting SMS verification', err);
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
      await textsecure.storage.put('setupType', this.setupType);
      this.selectStep(Steps.SETUP_PHONE);
    },
    onVerifyPhone() {
      // TODO: check phone verification code
      const number = this.validateNumber();
      const code = this.$('#phone-verification-code')
        .val()
        .replace(/\D+/g, '');

      this.accountManager
        .registerSingleDevice(number, code)
        .then(() => {
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
    onEulaScroll() {
      const eula = this.$el.find('.eula-text').get(0);
      const atBottom = eula.scrollHeight - eula.scrollTop === eula.clientHeight;
      // this.model.set('eula_read', atBottom);
      const check = this.$el.find('#accept-eula-check');
      const button = this.$el.find('#continue-eula');
      check.prop('disabled', !atBottom);
      if (!atBottom) {
        check.prop('checked', false);
        button.addClass('disabled');
      }
      console.log(eula.scrollHeight, eula.scrollTop, eula.clientHeight);
      console.log('Eula scroll', atBottom);
    },
    onContinueEula() {
      const button = this.$el.find('#continue-eula');
      if (button.is('.disabled')) return;
      console.log('Continue eula');
      textsecure.storage.put('eulaAccepted', true).then(() => {
        this.selectStep(Steps.SETUP_TYPE);
      });
    },
    //Functions for upload User Avatar
    onUploadAvatar(){
      this.$('#inputAvatar').click();
    },
    //TODO HOOK API for upload avatar
    async onChoseAvatar() {
      const fileField = this.$('#inputAvatar');
      const file = fileField.prop('files');
    },
    //Functions for upload documents
    onuploadDocuments(){
      this.$('#inputDocument').click();
    },
    //TODO HOOK API for upload avatar
    async onChoseDocument() {
      const fileField = this.$('#inputDocument');
      const file = fileField.prop('files');
    },
    activateButtonCompanyInfo(){
      const companyompanyName = this.$el.find('#company-name-input')[0].value.length;
      const taxNumber = this.$el.find('#tax-number-input')[0].value.length;
      const taxID = this.$el.find('#tax-id-input')[0].value.length;
      const comercialRegisterId = this.$el.find('#company-register-id-input')[0].value.length;
      const imprint = this.$el.find('#imprint-input')[0].value.length;
      const branch = this.$el.find('#branch-select')[0].value.length;
      const button = this.$el.find('#company-profile-done');
      if(companyompanyName > 0 && taxNumber > 0 && taxID >0 && comercialRegisterId > 0 && imprint > 0 && branch > 0) {
        button.removeClass('disabled');
      }else {
        button.addClass('disabled');
      }
    },
    activateButtonProfileDetails(){
      const username = this.$el.find('#user-name-input')[0].value.length;
      const button = this.$el.find('#user-profile-done');
      if(username > 0){ 
        button.removeClass('disabled');
      }else {
        button.addClass('disabled');
      }
    },
    activateButtonBankDetails(){
      const bankIBAN = this.$el.find('#bank-iban-input')[0].value.length;
      const bankBIC = this.$el.find('#bank-bic-input')[0].value.length;
      const button = this.$el.find('#bank-details-done');
      if(bankIBAN > 0 && bankBIC > 0){ 
        button.removeClass('disabled');
      }else {
        button.addClass('disabled');
      }
    },
    onOpenSelectBranch () {
      Tmp = {
         companyompanyName: this.$el.find('#company-name-input')[0].value,
         taxNumber: this.$el.find('#tax-number-input')[0].value,
         taxID: this.$el.find('#tax-id-input')[0].value,
         comercialRegisterId: this.$el.find('#company-register-id-input')[0].value,
        imprint: this.$el.find('#imprint-input')[0].value,
      };
      this.selectStep(Steps.SETUP_BRANCHEN);
    },
    onSelectBranch (e) {
      this.selectStep(Steps.SETUP_COMPANY_PROFILE);
      this.$('#company-name-input').val(Tmp.companyompanyName)
      this.$('#tax-number-input').val(Tmp.taxNumber)
      this.$('#tax-id-input').val(Tmp.taxID)
      this.$('#company-register-id-input').val(Tmp.comercialRegisterId)
      this.$('#imprint-input').val(Tmp.imprint)
      this.$('#branch-select').val(e.target.textContent)
      this.resetTMP()
    },
    searchBranch(e){
      var value = e.target.value;
      $("#branch-list p").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    },
    loadCountries(){
      const thisElement = this;
      $.ajax({
        type: "GET",
        url: "config/countries.json", // Using our resources.json file to serve results
        success: function(result) {
          const countries = JSON.parse(result);
          countries.sort(function(a, b) {
            return (a['name'] > b['name']) ? 1 : ((a['name'] < b['name']) ? -1 : 0);
        });
        for( let i = 0; i < countries.length; i++){
          const pItem = `<p class="pCountry" data-country-code="${countries[i].code}" data-dial-code="${countries[i].dial_code}">${countries[i].name} <span class="spanDialCode">${countries[i].dial_code}</span></p>`
          thisElement.$('#phone-list').append(pItem)
        }
        },
        error: function(e){
          console.log('Error getting countries', e)
        }
      });
    },
    onOpenSelectPhoneList () {
      this.loadCountries();
      this.selectStep(Steps.SETUP_PHONESLIST);
    },
    onSelectPhone (e) {
      this.selectStep(Steps.SETUP_PHONE);
      this.$('#countryCode').text(`${e.target.getAttribute('data-country-code')}`);
      this.$('#dialCode').text(` ${e.target.getAttribute('data-dial-code')}`);
    },
    searchPhones(e){
      var value = e.target.value;
      $("#phone-list p").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    },
    activateButtonVerifyCall(){
      const number = this.$el.find('#phone-number-value')[0].value.length;
      const button = this.$el.find('#request-verify-call');
      if(number > 0){ 
        button.removeClass('disabled');
      }else {
        button.addClass('disabled');
      }

    },
    activateButtonVerifyCode(){
      const code = this.$el.find('#phone-verification-code')[0].value.length;
      const button = this.$el.find('#verify-phone-code');
      if(code > 0){ 
        button.removeClass('disabled');
      }else {
        button.addClass('disabled');
      }

    },
    resetTMP () {
      Tmp = {}
    },
    render_attributes() {
      return {
        appTagLine: i18n('appTagLine'),
        registerCompany: i18n('registerCompany'),
        registerAdmin: i18n('registerAdmin'),
        welcomeCompany: i18n('welcomeCompany'),
        welcomeAdmin: i18n('welcomeAdmin'),
        continueButton: i18n('continueButton'),
        signupCode: i18n('signupCode'),
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
        uploadCard: i18n('uploadCard'),

        isStepEula: this.step === Steps.ACCEPT_EULA,
        isStepSetupType: this.step === Steps.SETUP_TYPE,
        isStepSetupPhone: this.step === Steps.SETUP_PHONE,
        isStepSetupCompanyProfile: this.step === Steps.SETUP_COMPANY_PROFILE,
        isStepSetupCompanyBank: this.step === Steps.SETUP_COMPANY_BANK,
        isStepSetupUserProfile: this.step === Steps.SETUP_USER_PROFILE,
        isStepSetupContactImport: this.step === Steps.SETUP_CONTACT_IMPORT,
        isStepSetupBranchen: this.step === Steps.SETUP_BRANCHEN,
        isStepSetupPhoneList: this.step === Steps.SETUP_PHONESLIST,

        eulatitle: i18n('eulatitle'),
        eulaSubTitle: i18n('eulaSubTitle'),
        EULAText: EULA,
        acceptEula: i18n('acceptEula'),
        uploadAvatarText: i18n('uploadAvatarText'),
        contactImportTitle: i18n('contactImportTitle'),
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
