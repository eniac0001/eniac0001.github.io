define(function(require, exports, module) {
    // Zepto animate extend
    require('zepto.extend.fx');

    // Zepto data extend
    require('zepto.extend.data');

    // Zepto selector extend
    require('zepto.extend.selector');

    var $ = window.Zepto;

    var UI = $.AMUI || {},
        $win = $(window),
        doc = window.document;

    // usage: log('inside coolFunc',this,arguments);
    // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
    window.log = function() {
        log.history = log.history || [];   // store logs to an array for reference
        log.history.push(arguments);
        if (this.console) {
            console.log.apply(console, Array.prototype.slice.call(arguments));
        }
    };

    if (UI.fn) {
        return;
    }

    UI.fn = function(command, options) {

        var args = arguments,
            cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i),
            component = cmd[1],
            method = cmd[2];

        if (!UI[component]) {
            log('AMUI component [' + component + '] does not exist.');
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
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
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        })();

        return transitionEnd && { end: transitionEnd };

    })();

    UI.support.animation = (function() {

        var animationEnd = (function() {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        })();

        return animationEnd && { end: animationEnd };
    })();

    UI.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    UI.support.touch = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch) ||
        (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false);

    // https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
    UI.support.mutationobserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

    UI.Utils = {};

    // extend
    UI.Utils.extend = function(Child, Parent) {
        var F = function() {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.uber = Parent.prototype;
    };

    /**
     * Debounce function
     * @param {function} func  Function to be debounced
     * @param {number} wait Function execution threshold in milliseconds
     * @param {bool} immediate  Whether the function should be called at
     *                          the beginning of the delay instead of the
     *                          end. Default is false.
     * @desc Executes a function when it stops being invoked for n seconds
     * @via  _.debounce() http://underscorejs.org
     */
    UI.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
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

    UI.Utils.isInView = function(element, options) {

        var $element = $(element);

        var visible = !!($element.width() || $element.height()) && $element.css("display") !== "none";

        if (!visible) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        options = $.extend({topoffset: 0, leftoffset: 0}, options);

        return (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width());
    };

    UI.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {
            }
        }

        return options;
    };

    // cookie utils
    UI.Utils.cookie = {
        get: function(name) {
            var cookieName = encodeURIComponent(name) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = null,
                cookieEnd;

            if (cookieStart > -1) {
                cookieEnd = document.cookie.indexOf(";", cookieStart);
                if (cookieEnd == -1) {
                    cookieEnd = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
            }

            return cookieValue;
        },

        set: function(name, value, expires, path, domain, secure) {
            var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

            if (expires instanceof Date) {
                cookieText += "; expires=" + expires.toGMTString();
            }

            if (path) {
                cookieText += "; path=" + path;
            }

            if (domain) {
                cookieText += "; domain=" + domain;
            }

            if (secure) {
                cookieText += "; secure";
            }

            document.cookie = cookieText;
        },

        unset: function(name, path, domain, secure) {
            this.set(name, "", new Date(0), path, domain, secure);
        }
    };

    UI.Utils.events = {};
    UI.Utils.events.click = UI.support.touch ? 'tap' : 'click';

    $.AMUI = UI;
    $.fn.amui = UI.fn;

    $.AMUI.langdirection = $("html").attr("dir") == "rtl" ? "right" : "left";


    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false, $el = this;
        $(this).one(UI.support.transition.end, function() {
            called = true
        });
        var callback = function() {
            if (!called) {
                $($el).trigger(UI.support.transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    $.fn.transitionEnd = function(callback) {
        var endEvent = UI.support.transition.end,
            dom = this;

        function fireCallBack(e) {
            callback.call(this, e);
            endEvent && dom.off(endEvent, fireCallBack);
        }

        if (callback && endEvent) {
            dom.on(endEvent, fireCallBack);
        }
        return this;
    };

    $.fn.removeClassRegEx = function() {
        return this.each(function(regex) {
            var classes = $(this).attr('class');

            if (!classes || !regex) return false;

            var classArray = [];
            classes = classes.split(' ');

            for (var i = 0, len = classes.length; i < len; i++) if (!classes[i].match(regex)) classArray.push(classes[i]);

            $(this).attr('class', classArray.join(' '));
        });
    };

    //
    $.fn.alterClass = function(removals, additions) {
        var self = this;

        if (removals.indexOf('*') === -1) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }

        var classPattern = new RegExp('\\s' +
            removals.
                replace(/\*/g, '[A-Za-z0-9-_]+').
                split(' ').
                join('\\s|\\s') +
            '\\s', 'g');

        self.each(function(i, it) {
            var cn = ' ' + it.className + ' ';
            while (classPattern.test(cn)) {
                cn = cn.replace(classPattern, ' ');
            }
            it.className = $.trim(cn);
        });

        return !additions ? self : self.addClass(additions);
    };

    $.fn.getHeight = function() {
        var $ele = $(this), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.height();
        } else {
            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).height();

            $ele.css(tmp); // reset element
        }

        return height;
    };

    // handle multiple browsers for requestAnimationFrame()
    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // https://github.com/gnarf/jquery-requestAnimationFrame
    UI.Utils.rAF = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            //window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function(callback) {
                return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
            };
    })();

    // handle multiple browsers for cancelAnimationFrame()
    UI.Utils.cancelAF = (function() {
        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            //window.oCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id);
            };
    })();

    $(function() {
        // trigger domready event
        $(document).trigger("domready:amui");

        if (UI.support.touch) {
            $("html").addClass("am-touch");
        }

        // Remove responsive classes in .am-layout
        var $layout = $('.am-layout');
        $layout.find('[class*="md-block-grid"]').alterClass('md-block-grid-*');
        $layout.find('[class*="lg-block-grid"]').alterClass('lg-block-grid');


        // widgets not in .am-layout
        $(".am").each(function() {
            var $widget = $(this);
            // console.log($widget.parents('.am-layout').length)
            if ($widget.parents('.am-layout').length === 0) {
                $widget.addClass('am-no-layout');
            }
        });
    });

    module.exports = UI;
});