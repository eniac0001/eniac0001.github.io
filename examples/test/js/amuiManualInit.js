/**
 * amuiManualInit.js
 * 
 * 
 */

define(['jquery'], function($) {
 var UI = $.AMUI || {},
    doc = document;

  if (UI.fn) {
    return;
  }

  UI.fn = function(command, options) {

    var args = arguments,
      cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i),
      component = cmd[1],
      method = cmd[2];

    if (!UI[component]) {
      $.error("AMUI component [" + component + "] does not exist.");
      return this;
    }

    return this.each(function() {
      var $this = $(this),
        data = $this.data(component);
      if (!data) $this.data(component, (data = new UI[component](this, method ? undefined : options)));
      if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
    });
  };

  UI.support = {};
  UI.support.transition = (function() {

    var transitionEnd = (function() {

      var element = doc.body || doc.documentElement,
        transEndEventNames = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd otransitionend',
          transition: 'transitionend'
        },
        name;

      for (name in transEndEventNames) {
        if (element.style[name] !== undefined) {
          return transEndEventNames[name];
        }
      }

    }());

    return transitionEnd && {
      end: transitionEnd
    };

  })();

  UI.support.touch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);


  UI.Utils = {};

  UI.Utils.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  UI.Utils.options = function(string) {

    if ($.isPlainObject(string)) return string;

    var start = string.indexOf("{"),
      options = {};

    if (start != -1) {
      try {
        options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
      } catch (e) {}
    }

    return options;
  };

  $.AMUI = UI;
  $.fn.amui = UI.fn;

  $.AMUI.langdirection = $("html").attr("dir") == "rtl" ? "right" : "left";

  var Nav = function(element, options) {

      var $this = this,
        $element = $(element);

      if ($element.data("nav")) return;

      this.options = $.extend({}, this.options, options);

      this.element = $element.on("click", this.options.trigger, function(e) {
        e.preventDefault();

        // trigger link
        var ele = $(this);

        $this.toggleNav(ele.parent(".am-parent"));
      });

      // wrap sub menu
      this.element.find(this.options.lists).each(function() {
        var $ele = $(this),
          parent = $ele.parent(); // li.am-parent
        var navHeight = getHeight($ele);

        parent.data("list-container", $ele).attr("data-nav-height", navHeight);

      });

      this.element.data("nav", this);
    };

  $.extend(Nav.prototype, {
    options: {
      "trigger": ".am-parent > a",
      "lists": ".am-parent > ul",
      "multiple": false
    },

    toggleNav: function(li, noanimation) {

      var element = this.element,
        $li = $(li);


      // 是否允许同时展开多个菜单
      if (!this.options.multiple) {
        $li.siblings(".am-open").each(function() {
          if ($(this).data("list-container")) {
            $(this).removeClass("am-open").data("list-container").animate({
              height: 0
            }, function() {});
          }
        });
      }

      $li.toggleClass("am-open");

      var targetMenu = $li.data('list-container'),
        targetMenuPosition = targetMenu.css('position');

      if ($li.data("list-container")) {
        if (noanimation) {
          $li.data('list-container').height($li.hasClass("am-open") ? "auto" : 0);
        } else {
          // 三级菜单展开时增加二级菜单容器高度
          var parentWrap = $li.parents(".am-parent"); // 二级菜单
          if (parentWrap.length > 0) {
            var parentNavWrap = parentWrap.eq(0).data('list-container');


            // 三级菜单展开且三级菜单非绝对定位时增加父级容器高度
            var addHeight = ($li.hasClass("am-open") && targetMenuPosition != 'absolute') ? Number($li.attr("data-nav-height")) : 0;
            parentNavWrap.animate({
              height: Number(parentWrap.attr("data-nav-height")) + addHeight
            });

            // 三级菜单绝对定位时
            if (targetMenuPosition == 'absolute') {
              parentNavWrap.css({
                overflow: $li.hasClass("am-open") ? 'visible' : 'hidden'
              });
            }
          }


          $li.data('list-container').animate({
            height: ($li.hasClass("am-open") ? $li.attr("data-nav-height") + "px" : 0)
          });

          // 一级菜单闭合时闭合所有展开子菜单
          var subNavs = $li.find(".am-menu-sub");
          // console.log($li);
          if (subNavs.length > 0 && !$li.hasClass("am-open")) {
            // console.log(subNavs.length);
            subNavs.each(function(index, item) {
              $(item).animate({
                height: 0,
                overflow: 'hidden'
              });
              $(item).parent('.am-parent.am-open').not($li).removeClass('am-open');
            });
          }

        }
      }
    }

  });

  UI["nav"] = Nav;

  // helper
  function getHeight(ele) {
    var $ele = ele,
      height = "auto";

    if ($ele.is(":visible")) {
      height = $ele.outerHeight();
      //console.log($ele.outerHeight(), $ele.height());
    } else {

      var position = $ele.css('position');

      // show element if it is hidden (it is needed if display is none)
      $ele.show();

      // place it so it displays as usually but hidden
      $ele.css({
        position: 'absolute',
        visibility: 'hidden',
        height: 'auto'
      });

      // get naturally height
      height = $ele.outerHeight();

      //console.log($ele.outerHeight(), $ele.height());

      // set initial css for animation
      $ele.css({
        position: position,
        visibility: 'visible',
        overflow: 'hidden',
        height: 0
      });
    }

    return height;
  }

  // init code
  $(function() {
    $("[data-am-nav]").each(function() {
      var nav = $(this);

      if (!nav.data("nav")) {
        var obj = new Nav(nav, UI.Utils.options(nav.data("am-nav")));
      }
    });
  });

  return UI
});