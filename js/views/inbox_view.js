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
  let tmpticketId = '';
  let ticketState = 1;
  window.Whisper = window.Whisper || {};

  Whisper.StickerPackInstallFailedToast = Whisper.ToastView.extend({
    render_attributes() {
      return { toastMessage: i18n('stickers--toast--InstallFailed') };
    },
  });

  Whisper.ConversationStack = Whisper.View.extend({
    className: 'conversation-stack',
    lastConversation: null,
    open(conversation, isTicket) {
      // isTicket = false;
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
          if ($el === null || $el.length === 0) {
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
          this.$('.tickets-view').remove()
        }
        conversation.trigger('opened');
        if (this.lastConversation) {
          this.lastConversation.trigger('backgrounded');
        }
        this.lastConversation = conversation;
        // Make sure poppers are positioned properly
        window.dispatchEvent(new Event('resize'));
      } else {
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
              this.$('.tickets-view').remove()
            }
            const view = new Whisper.TicketScreen({
              model: conversation,
              window: this.model.window,
            });
            // eslint-disable-next-line prefer-destructuring
            $el = view.$el;
          }
          $el.prependTo(this.el);
        }

        window.dispatchEvent(new Event('resize'));

      }
    }
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
    },
  });
  // Whisper.TicketScreen = Whisper.View.extend({
  //   templateName: 'tickets-view',
  //   className: 'tickets-view',

  // });


  Whisper.InboxView = Whisper.View.extend({
    templateName: 'two-column',
    className: 'inbox index',
    initialize(options = {}) {
      this.ready = false;
      this.render();
      this.$el.attr('tabindex', '1');

      this.conversation_stack = new Whisper.ConversationStack({
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
    },
    render_attributes: {
      welcomeToSignal: i18n('welcomeToSignal'),
      selectAContact: i18n('selectAContact'),
    },
    events: {
      click: 'onClick',
      'click #unclaimed, #claimed, #closed': 'getTickets',
    },
    setupLeftPane() {
      this.leftPaneView = new Whisper.ReactWrapperView({
        JSX: Signal.State.Roots.createLeftPane(window.reduxStore),
        className: 'left-pane-wrapper',
      });

      // Finally, add it to the DOM
      this.$('.left-pane-placeholder').append(this.leftPaneView.el);
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
    async getTickets(event) {
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
        await this.openTicket(this.tmpticketId);
        this.$('.ticket-nav').removeClass('active');
        event.currentTarget.classList.add('active');
      }
    },
    changeListTicket(list) {
      const arrayList = list
      list.forEach((element, index) => {
        arrayList[index].date = new Date(element.ts_created).toUTCString().split('GMT')[0];
        arrayList[index].hasTicket = true;
        switch (element.state) {
          case 0:
            arrayList[index].status = i18n('Unknown')
            arrayList[index].isUnknown = true
            arrayList[index].isUnclaimed = false
            arrayList[index].isClaimed = false
            arrayList[index].isClosed = false
            break;
          case 1:
            arrayList[index].status = i18n('Unclaimed')
            arrayList[index].isUnknown = false
            arrayList[index].isUnclaimed = true
            arrayList[index].isClaimed = false
            arrayList[index].isClosed = false
            break;
          case 2:
            arrayList[index].status = i18n('Claimmed')
            arrayList[index].isUnknown = false
            arrayList[index].isUnclaimed = false
            arrayList[index].isClaimed = true
            arrayList[index].isClosed = false
            break;
          case 3:
            arrayList[index].status = i18n('Closed')
            arrayList[index].isUnknown = false
            arrayList[index].isUnclaimed = false
            arrayList[index].isClaimed = false
            arrayList[index].isClosed = true
            break;
          default:
            break;
        }
      });

      return arrayList;
    },
    onTicketScroll(evt) {
      const ticket = this.$el.find('.conversation-stack').get(0);
      const atBottom = ticket.scrollHeight - ticket.scrollTop === ticket.clientHeight;
      if (atBottom) {
        // offsetTicket = limitTicket + offsetTicket;
        if ((parseInt(ticketList.ticket_count, 10)) > offsetTicket) {
          this.loadMoreTickets()
        }else{
          this.$('#noLoadMore').removeClass('hidden');
        }
      }
    },
    async openTicket(id, messageId = null) {
      this.$('.conversation-stack').on(
        'scroll',
        _.debounce(this.onTicketScroll.bind(this), 100)
      );
      const data = {
        'limit': limitTicket,
        'offset': offsetTicket,
        'state': ticketState,
      }

      offsetTicket = limitTicket + offsetTicket;
      try {
        ticketList = await getTicketsList(id, data);
        const isTicket = true;
        // if(this.tmpticketId !== id){
        // this.conversation_stack.open(tickets, isTicket, clientDetails);
        if (ticketList.tickets) {
          ticketList.tickets = this.changeListTicket(ticketList.tickets)
        }else {
          ticketList.tickets = [{
            'hasTicket': false,
          }]
        }
        this.conversation_stack.open(ticketList.tickets, isTicket);
        this.focusConversation();
        // }
        this.tmpticketId = id;
      } catch (err) {
        console.warn('openTicker error', err);
        this.openConversation(id, messageId);
      }
    },
    async loadMoreTickets() {
      const data = {
        'limit': limitTicket,
        'offset': offsetTicket,
        'state': ticketState,
      }
      offsetTicket = limitTicket + offsetTicket;
      try {
        let moreTicketList = await getTicketsList(this.tmpticketId, data, ticketState);
        // if(moreTicketList.length == limitTicket){
        let moreTicketList1 = this.changeListTicket(moreTicketList.tickets);
        moreTicketList1.forEach(element => {
          ticketList.tickets.push(element)
        });
        const isTicket = true;
        this.conversation_stack.open(ticketList.tickets, isTicket);
      } catch (err) {
        console.warn('openTicker error', err);
        const messageId = null;
        this.openConversation(this.tmpticketId, messageId);
      }
    },
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
