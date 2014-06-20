/**
 * result-main.js
 */
require.config({
    baseUrl: 'js/',
    paths: {
        'menu':             'menu',
        'flexslider':       'flexslider',     // For running the widget slider in the <iframe>
        'jquery':           'jquery-2.0.3',   // Flexslider depends on jquery
        'zepto':            'zepto.min',    // AMUI depends on zetpo
        'amuiManualInit':   'amuiManualInit',
        'handlebars':     'handlebars-1.0.0.min',
    	'easing':       'jquery.easing',
    	'mainBody':     'mainBody'
    },
    shim: {
        // jQuery plugin does not exports anything, it only registers a new method for jQuery.
    	'easing': {
    		deps: ['jquery']
    	},
        'handlebars': {
            exports: 'Handlebars'
        },
        'flexslider': {
            deps: ['jquery']
        },
        'semantic': {
            deps: ['jquery']
        }
    }
});

// load modules to make the page fully functional
require(['menu', 'mainBody', 'zepto'], function() {
	console.log('> result-main.js fully loaded.')
});