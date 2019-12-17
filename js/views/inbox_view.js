/* global
  ConversationController,
  extension,
  getInboxCollection,
  i18n,
  Whisper,
  Signal
*/

// eslint-disable-next-line func-names
(function () {
  'use strict';
  // variables
  let limitTicket = 12;
  let offsetTicket = 0;
  let ticketList = [];
  let intervalNewTickets = null;
  let tmpticketId = '';
  let ticketState = 1;
  let scrolling = false;
  let sorted = false;
  let gotTicketsAt = Date.now();
  window.Whisper = window.Whisper || {};

  Whisper.StickerPackInstallFailedToast = Whisper.ToastView.extend({
    render_attributes() {
      return { toastMessage: i18n('stickers--toast--InstallFailed') };
    },
  });

  Whisper.ConversationStack = Whisper.View.extend({
    className: 'conversation-stack',
    lastConversation: null,
    async open(conversation, isTicket, editCompany = null) {
      console.log('1111111111111111111111111111111111111111111111', conversation)
      if (!isTicket) {
        const id = `conversation-${conversation.cid}`;
        if (id !== this.el.firstChild.id) {
          this.$el
            .first()
            .find('video, audio')
            .each(function pauseMedia() {
              this.pause();
            });
          let $el = this.$(`#${id}`);
          if (this.$('.group')) {
            this.$('.group').remove();
          }
          if ($el === null || $el.length === 0) {
            if (this.$('.private')) {
              this.$('.private').remove();
            }
            const view = new Whisper.ConversationView({
              model: conversation,
              window: this.model.window,
            });
            // eslint-disable-next-line prefer-destructuring
            $el = view.$el;
          }
          $el.prependTo(this.el);
        }

        if (this.$('.tickets-view')) {
          this.$('.tickets-view').remove();
        }
        if (this.$('.blackboard-view')) {
          this.$('.blackboard-view').remove();
        }
        conversation.trigger('opened');
        if (this.lastConversation) {
          this.lastConversation.trigger('backgrounded');
        }
        this.lastConversation = conversation;
        // Make sure poppers are positioned properly
        window.dispatchEvent(new Event('resize'));
      } else {
        console.log('22222222222222222222222222222222222')
        const isAdmin = true;
        let admins = '';
        try {
          admins = await getAdminCompany(conversation.id)
          if (admins.success) {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
        } catch (error) {
          this.isAdmin = false;
        }
        if (isAdmin) {
          if (this.$('#edit_company_data')) {
            this.$('#edit_company_data').remove();
          }
          // const edit = new Whisper.EditCompanyView({
          //   model: conversation,
          //   window: this.model.window,
          // });
          // console.log(this.$('.edit-company-container')[0], "55555555555555555555555555555555555555555")
          // let $el = this.$('.edit-company-container')[0];
          // $el = edit.$el;
          // $el.prependTo(this.el);
        }
        const id = `conversation-${conversation.cid}`;
        if (id !== this.el.firstChild.id) {
          this.$el
            .first()
            .find('video, audio')
            .each(function pauseMedia() {
              this.pause();
            });
          let $el = this.$(`#${id}`);
          if ($el === null || $el.length === 0) {
            if (this.$('.tickets-view')) {
              this.$('.tickets-view').remove();
            }
            if (this.$('.blackboard-view')) {
              this.$('.blackboard-view').remove();
            }
            if (this.$('.group')) {
              this.$('.group').remove();
            }
            // const view = new Whisper.TicketScreen({
            //   model: conversation,
            //   window: this.model.window,
            //   editCompany: editCompany
            // });

            // const view = React.createElement(window.OFA.TestComponent);
            const elem = document.createElement('div');
            elem.id = id;

            // const view = new window.OFA.TestComponent();
            // ReactDOM.render(view, elem);
            window.OFA.wrapWithReduxStoreOnElem(elem, window.OFA.TicketsView, { company_id: conversation.id });
            // console.log('TEST COMPONENT', view, elem);

            // eslint-disable-next-line prefer-destructuring
            $el = $(elem); // view.$el;
          }
          $el.prependTo(this.el);
        }

        window.dispatchEvent(new Event('resize'));
      }
    },
  });

  Whisper.AppLoadingScreen = Whisper.View.extend({
    templateName: 'app-loading-screen',
    className: 'app-loading-screen',
    updateProgress(count) {
      if (count > 0) {
        const message = i18n('loadingMessages', count.toString());
        this.$('.message').text(message);
      }
    },
    render_attributes: {
      message: i18n('loading'),
      versionFooter: window.getVersion()
    },
  });
  // Whisper.TicketScreen = Whisper.View.extend({
  //   templateName: 'tickets-view',
  //   className: 'tickets-view',

  // });
  Whisper.BlackboardStack = Whisper.View.extend({
    className: 'blackboard-stack',
    lastConversation: null,
    openBlackboard(conversation, notes, isAdmin) {
      // isTicket = false;
      const id = `conversation-${conversation.cid}`;
      if (id !== this.el.firstChild.id) {
        this.$el
          .first()
          .find('video, audio')
          .each(function pauseMedia() {
            this.pause();
          });
        let $el = this.$(`#${id}`);
        if ($el === null || $el.length === 0) {
          if (this.$('.tickets-view')) {
            this.$('.tickets-view').remove();
          }
          if (this.$('.blackboard-view')) {
            this.$('.blackboard-view').remove();
          }
          if (this.$('.group')) {
            this.$('.group').remove();
          }
          const view = new Whisper.BlackboardScreen({
            model: notes,
            company_id: conversation,
            isAdmin: isAdmin
          });
          // eslint-disable-next-line prefer-destructuring
          $el = view.$el;
        }

        $el.prependTo(this.el);
      }
      if (this.$('.tickets-view')) {
        this.$('.tickets-view').remove();
      }
      // Make sure poppers are positioned properly

      window.dispatchEvent(new Event('resize'));
    },
  });

  Whisper.InboxView = Whisper.View.extend({
    templateName: 'two-column',
    className: 'inbox index',
    initialize(options = {}) {
      this.ready = false;
      this.render();
      this.$el.attr('tabindex', '1');

      this.conversation_stack = new Whisper.ConversationStack({
        el: this.$('.conversation-stack'),
        model: { window: options.window }
      });

      this.blackboard_stack = new Whisper.BlackboardStack({
        el: this.$('.conversation-stack'),
        model: { window: options.window },
      });

      if (!options.initialLoadComplete) {
        this.appLoadingScreen = new Whisper.AppLoadingScreen();
        this.appLoadingScreen.render();
        this.appLoadingScreen.$el.prependTo(this.el);
        this.startConnectionListener();
      }

      const inboxCollection = getInboxCollection();

      this.listenTo(inboxCollection, 'messageError', () => {
        if (this.networkStatusView) {
          this.networkStatusView.update();
        }
      });

      this.networkStatusView = new Whisper.NetworkStatusView();
      this.$el
        .find('.network-status-container')
        .append(this.networkStatusView.render().el);

      if (extension.expired()) {
        const banner = new Whisper.ExpiredAlertBanner().render();
        banner.$el.prependTo(this.$el);
        this.$el.addClass('expired');
      }

      Whisper.events.on('pack-install-failed', () => {
        const toast = new Whisper.StickerPackInstallFailedToast();
        toast.$el.appendTo(this.$el);
        toast.render();
      });

      this.setupLeftPane();

      window.triggerInboxReady();
    },
    render_attributes: {
      welcomeToSignal: i18n('welcomeToSignal'),
      selectAContact: i18n('selectAContact'),
    },
    events: {
      click: 'onClick',
      // 'click #unclaimed, #claimed, #closed': 'getTickets',
      // 'click #sortBy': 'sortTickets',
      // 'keyup #searchTickets': 'searchTickets',
      'click #add_group': 'addGroup',
      'click #add_extern': 'addExtern',
      'click #add_intern': 'addIntern',
      'click #open_contact': 'showContacts',
    },
    setupLeftPane() {
      this.leftPaneView = new Whisper.ReactWrapperView({
        JSX: Signal.State.Roots.createLeftPane(window.reduxStore),
        className: 'left-pane-wrapper',
      });

      // Finally, add it to the DOM
      this.$('.left-pane-placeholder').append(this.leftPaneView.el);
    },
    addGroup() {
      // const appView = new Whisper.AppView({
      // });
      const { appView } = window['owsDesktopApp'];
      appView.openModalImport('group');
    },
    addExtern() {
      // const appView = new Whisper.AppView({
      // });
      const { appView } = window['owsDesktopApp'];
      appView.openModalImport('kunde');
    },
    addIntern() {
      // const appView = new Whisper.AppView({
      // });
      const { appView } = window['owsDesktopApp'];
      appView.openModalImport('admin');
    },
    showContacts() {
      const { appView } = window['owsDesktopApp'];
      // const appView = new Whisper.AppView({
      //   el: $('body'),
      // });
      appView.openContact();
    },
    startConnectionListener() {
      this.interval = setInterval(() => {
        const status = window.getSocketStatus();
        switch (status) {
          case WebSocket.CONNECTING:
            break;
          case WebSocket.OPEN:
            clearInterval(this.interval);
            // if we've connected, we can wait for real empty event
            this.interval = null;
            break;
          case WebSocket.CLOSING:
          case WebSocket.CLOSED:
            clearInterval(this.interval);
            this.interval = null;
            // if we failed to connect, we pretend we got an empty event
            this.onEmpty();
            break;
          default:
            // We also replicate empty here
            this.onEmpty();
            break;
        }
      }, 1000);
    },
    onEmpty() {
      const view = this.appLoadingScreen;
      if (view) {
        this.appLoadingScreen = null;
        view.remove();
      }
    },
    onProgress(count) {
      const view = this.appLoadingScreen;
      if (view) {
        view.updateProgress(count);
      }
    },
    focusConversation(e) {
      if (e && this.$(e.target).closest('.placeholder').length) {
        return;
      }

      this.$('#header, .gutter').addClass('inactive');
      this.$('.conversation-stack').removeClass('inactive');
    },
    focusHeader() {
      this.$('.conversation-stack').addClass('inactive');
      this.$('#header, .gutter').removeClass('inactive');
      this.$('.conversation:first .menu').trigger('close');
    },
    reloadBackgroundPage() {
      window.location.reload();
    },
    async openConversation(id, messageId) {
      const conversation = await ConversationController.getOrCreateAndWait(
        id,
        'private'
      );

      const { openConversationExternal } = window.reduxActions.conversations;
      if (openConversationExternal) {
        openConversationExternal(id, messageId);
      }

      this.conversation_stack.open(conversation);
      this.focusConversation();
    },
    searchTickets(e) {
      let value = e.target.value.toLowerCase();
      $('#ticketList>div').filter(function () {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    // sortTickets() {
    //   if (ticketList.tickets) {
    //     // if (this.sorted) {
    //     //   this.sorted = false;
    //     //   // this.$('#sortBy').text('newest');
    //     // } else {
    //     //   this.sorted = true;
    //     //   // this.$('#sortBy').text('oldest');
    //     // }
    //     // // tslint:disable-next-line:no-function-expression
    //     // const secondThis = this;
    //     // ticketList.tickets.sort(function (a, b) {
    //     //   const aTime = secondThis.toTimestamp(a.date);
    //     //   const bTime = secondThis.toTimestamp(b.date);
    //     //   if (!secondThis.sorted) {
    //     //     if (aTime > bTime) {
    //     //       return 1;
    //     //     }
    //     //     if (aTime < bTime) {
    //     //       return -1;
    //     //     }
    //     //   } else {
    //     //     if (aTime > bTime) {
    //     //       return -1;
    //     //     }
    //     //     if (aTime < bTime) {
    //     //       return 1;
    //     //     }
    //     //   }
    //     //   // a must be equal to b
    //     //   return 0;
    //     // });
    //     this.conversation_stack.open(ticketList.tickets, true);
    //   }
    // },
    toTimestamp(strDate) {
      var datum = Date.parse(strDate);
      return datum / 1000;
    },
    closePanel() {
      document.getElementsByClassName('modal-importer')[0].remove();
    },
    async getTickets(event) {
      if (document.getElementsByClassName('modal-importer')[0]) {
        this.closePanel();
      }
      if (!scrolling) {
        const ticketType = event.currentTarget.id;
        let tmpTicketType = 1;
        switch (ticketType) {
          case 'unclaimed':
            tmpTicketType = 1;
            break;
          case 'claimed':
            tmpTicketType = 2;
            break;
          case 'closed':
            tmpTicketType = 3;
            break;
          default:
            tmpTicketType = 1;
            break;
        }
        if (tmpTicketType !== ticketState) {
          ticketState = tmpTicketType;
          limitTicket = 12;
          offsetTicket = 0;
          await this.openTicket(this.tmpticketId, null, null, ticketType);
          this.$('.ticket-nav').removeClass('active');
          event.currentTarget.classList.add('active');
        }
      }
    },
    changeListTicket(list, id = null) {
      const arrayList = list.tickets;
      console.log('changeListTicket', list, id);
      if (!arrayList) throw new Error('changeListTicket missing tickets!');
      list.tickets.forEach((element, index) => {
        // arrayList[index].date = new Date(element.ts_created)
        //   .toUTCString()
        //   .split('GMT')[0];
        arrayList[index].date = this.setDate(element.ts_created)
        arrayList[index].hasTicket = true;
        arrayList[index].company_name = list.company_name;
        if (id !== null || id !== undefined) {
          arrayList[index].company_avatar = getAvatar(id);
        }
        arrayList[index].avatarSrc = getAvatar(element.client_uuid);
        switch (element.state) {
          case 0:
            arrayList[index].status = i18n('Unknown');
            arrayList[index].isUnknown = true;
            arrayList[index].isUnclaimed = false;
            arrayList[index].isClaimed = false;
            arrayList[index].isClosed = false;
            break;
          case 1:
            arrayList[index].status = i18n('Unclaimed');
            arrayList[index].isUnknown = false;
            arrayList[index].isUnclaimed = true;
            arrayList[index].isClaimed = false;
            arrayList[index].isClosed = false;
            break;
          case 2:
            arrayList[index].status = i18n('Claimmed');
            arrayList[index].isUnknown = false;
            arrayList[index].isUnclaimed = false;
            arrayList[index].isClaimed = true;
            arrayList[index].isClosed = false;
            break;
          case 3:
            arrayList[index].status = i18n('Closed');
            arrayList[index].isUnknown = false;
            arrayList[index].isUnclaimed = false;
            arrayList[index].isClaimed = false;
            arrayList[index].isClosed = true;
            break;
          default:
            break;
        }
      });

      return arrayList;
    },
    setDate(date){
      const language = window.getpreferredLocale()
      var d = new Date(date);
      const  options = { weekday: "long", year: "numeric", month: "short",  
      day: "numeric", hour: 'numeric', minute:'numeric', second:'numeric' }; 
      const  n = d.toLocaleDateString(language, options);
      return n;
    },
    onTicketScroll(evt) {
      scrolling = true;
      const ticket = this.$el.find('.conversation-stack').get(0);
      const atBottom =
        ticket.scrollHeight - ticket.scrollTop === ticket.clientHeight;
      if (atBottom) {
        if (parseInt(ticketList.ticket_count, 10) > offsetTicket) {
          this.loadMoreTickets();
        } else {
          this.$('#noLoadMore').removeClass('hidden');
          scrolling = false;
        }
      } else {
        scrolling = false;
      }
    },
    // async getNewTickets(id, ticketList) {
    //   if(!document.getElementsByClassName('tickets-view')[0]) {
    //     clearInterval(intervalNewTickets);
    //   }
    //   console.log('getNewTicketsgetNewTickets', ticketList);

    //   let ts;
    //   if (ticketList.tickets && ticketList.tickets.length > 0 && ticketList.tickets[0].ts_created) ts = new Date(ticketList.tickets[0].ts_created).getTime();
    //   else ts = gotTicketsAt;

    //   const data = {
    //     ts: ts,
    //     state: ticketState,
    //   }
    //   const newTickets = await get_since(id, data);
    //   console.log('getNewTickets newTickets', newTickets);
    //   if(newTickets && newTickets.tickets) {
    //     const temporal = this.changeListTicket(newTickets);
    //     temporal.forEach(element => {
    //       ticketList.tickets.unshift(element);
    //     });
    //     const isTicket = true;
    //     this.conversation_stack.open(ticketList.tickets, isTicket);
    //   };
    //   console.log('new ticket listtt',ticketList.tickets);
    // },
    async openTicket(id, messageId = null, resetCall = null, type, editCompany = null) {
      console.log('open ticket', id, type, editCompany);
      this.$('.conversation-stack').on(
        'scroll',
        _.debounce(this.onTicketScroll.bind(this), 100)
      );
      // if (resetCall) {
      //   offsetTicket = 0;
      // }
      // let data = []
      // if (!editCompany) {
      //   data = {
      //     limit: limitTicket,
      //     offset: offsetTicket,
      //     state: ticketState,
      //   };
      // } else {
      //   data = {
      //     limit: 12,
      //     offset: 0,
      //     state: 1,
      //   };
      // }
      // offsetTicket = limitTicket + offsetTicket;
      try {
        // gotTicketsAt = Date.now();
        // ticketList = await getTicketsList(id, data);
        const isTicket = true;
        // if(this.tmpticketId !== id){
        // this.conversation_stack.open(tickets, isTicket, clientDetails);
        // if(intervalNewTickets !== null) {
        //   clearInterval(intervalNewTickets);
        // }
        // intervalNewTickets = setInterval(this.getNewTickets.bind(this, id, ticketList), 10000);
        // // this.getNewTickets(id, ticketList);
        // if (ticketList.tickets) {
        //   // ticketList.tickets.forEach((element, index) => {
        //   //   ticketList.tickets[index].avatarSrc = getAvatar(element.company_id);
        //   // });
        //   ticketList.tickets = this.changeListTicket(ticketList, id);
        // }
        // else {
        //   let tmpisClaimed = false;
        //   let tmpisUnclaimed = false;
        //   let tmpisClosed = false;
        //   if (type) {
        //     switch (type) {
        //       case 'claimed':
        //         tmpisClaimed = true;
        //         tmpisUnclaimed = false;
        //         tmpisClosed = false;
        //         break;
        //       case 'unclaimed':
        //         tmpisClaimed = false;
        //         tmpisUnclaimed = true;
        //         tmpisClosed = false;
        //         break;
        //       case 'closed':
        //         tmpisClaimed = false;
        //         tmpisUnclaimed = false;
        //         tmpisClosed = true;
        //         break;

        //       default:
        //         break;
        //     }
        //   }
        //   // ticketList.tickets[index].avatarSrc = getAvatar(element.company_id);
        //   ticketList.tickets = [
        //     {
        //       hasTicket: false,
        //       company_name: ticketList.company_name,
        //       isClaimed: tmpisClaimed,
        //       isUnclaimed: tmpisUnclaimed,
        //       isClosed: tmpisClosed,
        //       avatarSrc: getAvatar(id),
        //     },
        //   ];
        // }
        // this.conversation_stack.open(ticketList.tickets, isTicket, editCompany);
        this.conversation_stack.open({ id: id, cid: id }, isTicket, editCompany);
        this.focusConversation();
        // ticketList.tickets = [];
        // }
        this.tmpticketId = id;
      } catch (err) {
        console.warn('openTicker error', err);
        this.openConversation(id, messageId);
      }
    },
    async openBlackboard(id) {
      let isAdmin = true;
      var notes = '';
      let admins = '';
      try {
        notes = await getCardsBlackboard(id);
        try {
          admins = await getAdminCompany(id)
          if (notes == undefined) {
            await createCardBlackboard(admins.admins[0].company_id).then(async resp => {
              notes = await getCardsBlackboard(id);
            })
          }
          if (admins.success) {
            isAdmin = true;
          } else {
            isAdmin = false;
          }
        } catch (error) {
          isAdmin = false;
        }
        this.blackboard_stack.openBlackboard(id, notes, isAdmin);
      }
      catch (err) {
        console.warn('openTicker error', err);
      }

    },

    // async loadMoreTickets() {
    //   const data = {
    //     limit: limitTicket,
    //     offset: offsetTicket,
    //     state: ticketState,
    //   };
    //   offsetTicket = limitTicket + offsetTicket;
    //   try {
    //     let moreTicketList = await getTicketsList(
    //       this.tmpticketId,
    //       data,
    //       ticketState
    //     );
    //     // if(moreTicketList.length == limitTicket){
    //     let moreTicketList1 = this.changeListTicket(moreTicketList);
    //     moreTicketList1.forEach(element => {
    //       ticketList.tickets.push(element);
    //     });
    //     const isTicket = true;
    //     this.conversation_stack.open(ticketList.tickets, isTicket);
    //     scrolling = false;
    //   } catch (err) {
    //     console.warn('openTicker error', err);
    //     const messageId = null;
    //     this.openConversation(this.tmpticketId, messageId);
    //   }
    // },
    closeRecording(e) {
      if (e && this.$(e.target).closest('.capture-audio').length > 0) {
        return;
      }
      this.$('.conversation:first .recorder').trigger('close');
    },
    onClick(e) {
      this.closeRecording(e);
    },
  });

  Whisper.ExpiredAlertBanner = Whisper.View.extend({
    templateName: 'expired_alert',
    className: 'expiredAlert clearfix',
    render_attributes() {
      return {
        expiredWarning: i18n('expiredWarning'),
        upgrade: i18n('upgrade'),
      };
    },
  });
})();
