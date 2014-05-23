/* 
 * jquery.tmallstudio-0.1.js 
 * Version 0.1
 * Copyright 2014 TmallStudio
 * http://www.tmallstudio.com
 */

(function($){

    $.fn.tmallstudio = function(options){

    	var defaults = {
	        sectionContainer: ".page",
	        easing: "ease",
	        animationTime: 1000,
	        pagination: true,
	        updateURL: false
		};

        var settings = $.extend({}, defaults, options),
            element = $(this),
            sections = $(settings.sectionContainer)
            total = sections.length,
            status = "off",
            topPos = 0,
            lastAnimation = 0,
            quietPeriod = 500,
            paginationList = "";

        element.addClass("tm-wrapper");

    };
  
})(window.jQuery);


