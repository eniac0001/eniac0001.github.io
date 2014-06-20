define(function(require, exports, module) {
    require('./zepto.outerdemension');
    require('./zepto.extend.data');
    require('./zepto.extend.selector');
    require('./core');

    var $ = window.Zepto;

    var UI = $.AMUI;

    var $win = $(window),
        $doc = $(document),
        Offcanvas = {
            show: function(element) {

                $element = $(element);

                if (!$element.length) return;

                var doc = $('html'),
                    bar = $element.find('.am-offcanvas-bar').first(),
                    dir = bar.hasClass('am-offcanvas-bar-flip') ? -1 : 1,
                    scrollbar = dir == -1 && $win.width() < window.innerWidth ? (window.innerWidth - $win.width()) : 0;

                scrollpos = {x: window.scrollX, y: window.scrollY};

                $element.addClass('am-active');

                doc.css({'width': window.innerWidth, 'height': window.innerHeight}).addClass('am-offcanvas-page');
                doc.css('margin-left', ((bar.outerWidth() - scrollbar) * dir)).width(); // .width() - force redraw

                bar.addClass('am-offcanvas-bar-show').width();

                $element.off('.amoffcanvas').on('click.amoffcanvas swipeRight.amoffcanvas swipeLeft.amoffcanvas', function(e) {
                    var $target = $(e.target);

                    if (!e.type.match(/swipe/)) {
                        if ($target.hasClass('am-offcanvas-bar')) return;
                        if ($target.parents('.am-offcanvas-bar').first().length) return;
                    }

                    // https://developer.mozilla.org/zh-CN/docs/DOM/event.stopImmediatePropagation
                    e.stopImmediatePropagation();

                    Offcanvas.hide();
                });

                $doc.on('keydown.offcanvas', function(e) {
                    if (e.keyCode === 27) { // ESC
                        Offcanvas.hide();
                    }
                });
            },

            hide: function(force) {

                var doc = $('html'),
                    panel = $('.am-offcanvas.am-active'),
                    bar = panel.find('.am-offcanvas-bar').first();

                if (!panel.length) return;

                if ($.AMUI.support.transition && !force) {

                    doc.one($.AMUI.support.transition.end,function() {
                        doc.removeClass('am-offcanvas-page').attr('style', '');
                        panel.removeClass('am-active');
                        window.scrollTo(scrollpos.x, scrollpos.y);
                    }).css('margin-left', '');

                    setTimeout(function() {
                        bar.removeClass('am-offcanvas-bar-show');
                    }, 50);

                } else {
                    doc.removeClass('am-offcanvas-page').attr('style', '');
                    panel.removeClass('am-active');
                    bar.removeClass('am-offcanvas-bar-show');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                }

                panel.off('.amoffcanvas');
                $doc.off('.amoffcanvas');
            }

        },
        scrollpos;


    var OffcanvasTrigger = function(element, options) {

        var $this = this,
            $element = $(element);

        this.options = $.extend({
            'target': $element.is('a') ? $element.attr('href') : false
        }, options);

        this.element = $element;

        $element.on('click', function(e) {
            e.preventDefault();
            Offcanvas.show($this.options.target);
        });
    };

    OffcanvasTrigger.offcanvas = Offcanvas;

    UI['offcanvas'] = OffcanvasTrigger;


    // init code
    $doc.on('click.offcanvas.amui', '[data-am-offcanvas]', function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data('offcanvas')) {
            ele.data('offcanvas', new OffcanvasTrigger(ele, UI.Utils.options(ele.data('am-offcanvas'))));

            ele.trigger('click');
        }
    });

});