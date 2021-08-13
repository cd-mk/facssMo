'use strict';

$(function () {
  // Register Quill Fonts
  var Font = Quill.import('formats/font');
  Font.whitelist = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'];
  Quill.register(Font, true);

  var compose = $('.compose-email'),
    composeModal = $('#compose-mail'),
    menuToggle = $('.menu-toggle'),
    sidebarToggle = $('.sidebar-toggle'),
    sidebarLeft = $('.sidebar-left'),
    sidebarMenuList = $('.sidebar-menu-list'),
    emailAppList = $('.email-app-list'),
    monitorList = $('.monitor-list'),
    monitorListInput = $('.monitor-list .custom-checkbox'),
    recentlyScrollArea = $('.recently-list-box'),
    emailTo = $('#email-to'),
    emailCC = $('#emailCC'),
    emailBCC = $('#emailBCC'),
    toggleCC = $('.toggle-cc'),
    toggleBCC = $('.toggle-bcc'),
    wrapperCC = $('.cc-wrapper'),
    wrapperBCC = $('.bcc-wrapper'),
    emailDetails = $('.monitor-details'),
    listGroupMsg = $('.list-group-messages'),
    goBack = $('.go-back'),
    favoriteStar = $('.email-application .email-favorite'),
    userActions = $('.user-action'),
    mailDelete = $('.mail-delete'),
    mailUnread = $('.mail-unread'),
    emailSearch = $('#email-search'),
    editorEl = $('#message-editor .editor'),
    overlay = $('.body-content-overlay'),
    isRtl = $('html').attr('data-textdirection') === 'rtl';

  var assetPath = '../app-assets/';

  if ($('body').attr('data-framework') === 'laravel') {
    assetPath = $('body').attr('data-asset-path');
  }

  // Toggle BCC on mount
  if (wrapperBCC.length) {
    wrapperBCC.toggle();
  }

  // Toggle CC on mount
  if (wrapperCC) {
    wrapperCC.toggle();
  }

  // Toggle BCC input
  if (toggleBCC.length) {
    toggleBCC.on('click', function () {
      wrapperBCC.toggle();
    });
  }

  // Toggle CC input
  if (toggleCC.length) {
    toggleCC.on('click', function () {
      wrapperCC.toggle();
    });
  }

  // if it is not touch device
  if (!$.app.menu.is_touch_device()) {
    // Email left Sidebar
    if ($(sidebarMenuList).length > 0) {
      var sidebar_menu_list = new PerfectScrollbar(sidebarMenuList[0]);
    }

    // User list scroll
    if ($(monitorList).length > 0) {
      var users_list = new PerfectScrollbar(monitorList[0]);
    }

    // Email detail section
    if ($(recentlyScrollArea).length > 0) {
      var users_list = new PerfectScrollbar(recentlyScrollArea[0]);
    }
  }
  // if it is a touch device
  else {
    $(sidebarMenuList).css('overflow', 'scroll');
    $(monitorList).css('overflow', 'scroll');
    $(recentlyScrollArea).css('overflow', 'scroll');
  }

  // Email to user select
  function renderGuestAvatar(option) {
    if (!option.id) {
      return option.text;
    }
    var avatarImg = feather.icons['user'].toSvg({
      class: 'mr-0'
    });
    if ($(option.element).data('avatar')) {
      avatarImg = "<img src='" + assetPath + 'images/avatars/' + $(option.element).data('avatar') + "' alt='avatar' />";
    }

    var $avatar =
      "<div class='d-flex flex-wrap align-items-center'>" +
      "<div class='avatar avatar-sm my-0 mr-50'>" +
      "<span class='avatar-content'>" +
      avatarImg +
      '</span>' +
      '</div>' +
      option.text +
      '</div>';

    return $avatar;
  }
  if (emailTo.length) {
    emailTo.wrap('<div class="position-relative"></div>').select2({
      placeholder: 'Select value',
      dropdownParent: emailTo.parent(),
      closeOnSelect: false,
      templateResult: renderGuestAvatar,
      templateSelection: renderGuestAvatar,
      tags: true,
      tokenSeparators: [',', ' '],
      escapeMarkup: function (es) {
        return es;
      }
    });
  }

  if (emailCC.length) {
    emailCC.wrap('<div class="position-relative"></div>').select2({
      placeholder: 'Select value',
      dropdownParent: emailCC.parent(),
      closeOnSelect: false,
      templateResult: renderGuestAvatar,
      templateSelection: renderGuestAvatar,
      tags: true,
      tokenSeparators: [',', ' '],
      escapeMarkup: function (es) {
        return es;
      }
    });
  }

  if (emailBCC.length) {
    emailBCC.wrap('<div class="position-relative"></div>').select2({
      placeholder: 'Select value',
      dropdownParent: emailBCC.parent(),
      closeOnSelect: false,
      templateResult: renderGuestAvatar,
      templateSelection: renderGuestAvatar,
      tags: true,
      tokenSeparators: [',', ' '],
      escapeMarkup: function (es) {
        return es;
      }
    });
  }

  // compose email
  if (compose.length) {
    compose.on('click', function () {
      // showing rightSideBar
      overlay.removeClass('show');
      // hiding left sidebar
      sidebarLeft.removeClass('show');
      // all input forms
      $('.compose-form input').val('');
      emailTo.val([]).trigger('change');
      // quill editor content
      var quill_editor = $('.compose-form .ql-editor');
      quill_editor[0].innerHTML = '';
    });
  }

  // Main menu toggle should hide app menu
  if (menuToggle.length) {
    menuToggle.on('click', function (e) {
      sidebarLeft.removeClass('show');
      overlay.removeClass('show');
    });
  }

  // Email sidebar toggle
  if (sidebarToggle.length) {
    sidebarToggle.on('click', function (e) {
      e.stopPropagation();
      sidebarLeft.toggleClass('show');
      overlay.addClass('show');
    });
  }

  // Overlay Click
  if (overlay.length) {
    overlay.on('click', function (e) {
      sidebarLeft.removeClass('show');
      overlay.removeClass('show');
    });
  }

  // Email Right sidebar toggle
  if (monitorList.find('.monitor-box .card-body').length) {
    monitorList.find('.monitor-box .card-body').on('click', function (e) {
      emailDetails.toggleClass('show');
    });
  }

  // Add class active on click of sidebar list
  if (listGroupMsg.find('a').length) {
    listGroupMsg.find('a').on('click', function () {
      if (listGroupMsg.find('a').hasClass('active')) {
        listGroupMsg.find('a').removeClass('active');
      }
      $(this).addClass('active');
    });
  }

  // Email detail view back button click
  if (goBack.length) {
    goBack.on('click', function (e) {
      e.stopPropagation();
      emailDetails.removeClass('show');
    });
  }

  // Favorite star click
  if (favoriteStar.length) {
    favoriteStar.on('click', function (e) {
      $(this).find('svg').toggleClass('favorite');
      e.stopPropagation();
      // show toast only have favorite class
      if ($(this).find('svg').hasClass('favorite')) {
        toastr['success']('Updated mail to favorite', 'Favorite Mail ⭐️', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      }
    });
  }

  // For app sidebar on small screen
  if ($(window).width() > 768) {
    if (overlay.hasClass('show')) {
      overlay.removeClass('show');
    }
  }

  // single checkbox select
  if (monitorListInput.length) {
    monitorListInput.on('click', function (e) {
      e.stopPropagation();
    });
    monitorListInput.find('input').on('change', function (e) {
      e.stopPropagation();
      var $this = $(this);
      if ($this.is(':checked')) {
        $this.closest('.media').addClass('selected-row-bg');
      } else {
        $this.closest('.media').removeClass('selected-row-bg');
      }
    });
  }

  // select all
  $(document).on('click', '.email-app-list .selectAll input', function () {
    if ($(this).is(':checked')) {
      userActions
        .find('.custom-checkbox input')
        .prop('checked', this.checked)
        .closest('.media')
        .addClass('selected-row-bg');
    } else {
      userActions.find('.custom-checkbox input').prop('checked', '').closest('.media').removeClass('selected-row-bg');
    }
  });

  // Delete selected Mail from list
  if (mailDelete.length) {
    mailDelete.on('click', function () {
      if (userActions.find('.custom-checkbox input:checked').length) {
        userActions.find('.custom-checkbox input:checked').closest('.media').remove();
        emailAppList.find('.selectAll input').prop('checked', false);
        toastr['error']('You have removed email.', 'Mail Deleted!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
        userActions.find('.custom-checkbox input').prop('checked', '');
      }
    });
  }

  // Mark mail unread
  if (mailUnread.length) {
    mailUnread.on('click', function () {
      userActions.find('.custom-checkbox input:checked').closest('.media').removeClass('mail-read');
    });
  }

  // Filter
  if (emailSearch.length) {
    emailSearch.on('keyup', function () {
      var value = $(this).val().toLowerCase();
      if (value !== '') {
        monitorList.find('.email-media-list li').filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
        var tbl_row = monitorList.find('.email-media-list li:visible').length;

        //Check if table has row or not
        if (tbl_row == 0) {
          monitorList.find('.no-results').addClass('show');
          monitorList.animate({ scrollTop: '0' }, 500);
        } else {
          if (monitorList.find('.no-results').hasClass('show')) {
            monitorList.find('.no-results').removeClass('show');
          }
        }
      } else {
        // If filter box is empty
        monitorList.find('.email-media-list li').show();
        if (monitorList.find('.no-results').hasClass('show')) {
          monitorList.find('.no-results').removeClass('show');
        }
      }
    });
  }

  // Email compose Editor
  if (editorEl.length) {
    var emailEditor = new Quill(editorEl[0], {
      bounds: '#message-editor .editor',
      modules: {
        formula: true,
        syntax: true,
        toolbar: '.compose-editor-toolbar'
      },
      placeholder: 'Message',
      theme: 'snow'
    });
  }

  // On navbar search and bookmark Icon click, hide compose mail
  $('.nav-link-search, .bookmark-star').on('click', function () {
    composeModal.modal('hide');
  });
});

$(window).on('resize', function () {
  var sidebarLeft = $('.sidebar-left');
  // remove show classes from sidebar and overlay if size is > 992
  if ($(window).width() > 768) {
    if ($('.app-content .body-content-overlay').hasClass('show')) {
      sidebarLeft.removeClass('show');
      $('.app-content .body-content-overlay').removeClass('show');
    }
  }
});


