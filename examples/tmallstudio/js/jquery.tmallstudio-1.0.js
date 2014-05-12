(function($) {


	$.fn.tmallstudio = function(options){

		// Create some defaults, extending them with any options that were provided
		options = $.extend({
			"verticalCentered" : true,
			'resize' : true,
			'slidesColor' : [],
			'anchors':[],
			'scrollingSpeed': 700,
			'easing': 'easeInQuart',
			'menu': false,
			'navigation': false,
			'navigationPosition': 'right',
			'navigationColor': '#000',
			'navigationTooltips': [],
			'slidesNavigation': false,
			'slidesNavPosition': 'bottom',
			'controlArrowColor': '#fff',
			'loopBottom': false,
			'loopTop': false,
			'loopHorizontal': true,
			'autoScrolling': true,
			'scrollOverflow': false,
			'css3': false,
			'paddingTop': 0,
			'paddingBottom': 0,
			'fixedElements': null,
			'normalScrollElements': null,

			//events
			'afterLoad': null,
			'onLeave': null,
			'afterRender': null,
			'afterSlideLoad': null,
			'onSlideLeave': null
		}, options);	



		//Defines the delay to take place before being able to scroll to the next section
		//BE CAREFUL! Not recommened to change it under 400 for a good behavior in laptops and 
		//Apple devices (laptops, mouses...)
		var scrollDelay = 700;

		$.fn.tmallstudio.setAutoScrolling = function(value) {
			//-------------------------------------------------------------------------------------------------
		};


		//flag to avoid very fast sliding for landscape sliders
		var slideMoving = false;

		var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

		var windowsHeight = $(window).height();
		var isMoving = false;
		var lastScrolledDestiny;


		addScrollEvent();

		//if css3 is not supported, it will use jQuery animations
		if(options.css3){
			options.css3 = support3d();
		}

		$('body').wrapInner('<div id="superContainer" />');

		// creating the navigation dots 
		if (options.navigation) {
			$('body').append('<div id="fullPage-nav"><ul></ul></div>');
			var nav = $('#fullPage-nav');

			nav.css('color', options.navigationColor);
			nav.addClass(options.navigationPosition);
		}

		$('.section').each(function(index){
			var slides = $(this).find('.slide');
			var numSlides = slides.length;
			
			if(!index){
				$(this).addClass('active');
			}

			$(this).css('height', windowsHeight + 'px');

			if(options.paddingTop || options.paddingBottom){
				$(this).css('padding', options.paddingTop  + ' 0 ' + options.paddingBottom + ' 0');
			}
			
			if (typeof options.slidesColor[index] !==  'undefined') {
				$(this).css('background-color', options.slidesColor[index]);
			}

			if (typeof options.anchors[index] !== 'undefined') {
				$(this).attr('data-anchor', options.anchors[index]);
			}

			if (options.navigation) {

			}

			// if there's any slide
			if (numSlides > 0) {

			} else {
				
			}

		}).promise().done(function(){

		});
		
		var scrollId;
		var isScrolling = false;

		//when scrolling...
		$(window).scroll(function(e){

		});


		var touchStartY = 0;
		var touchStartX = 0;
		var touchEndY = 0;
		var touchEndX = 0;

		/* Detecting touch events 
		 * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
		 * This way, the touchstart and the touch moves shows an small difference between them which is the
		 * used one to determine the direction.
		 */
		$(document).on('touchmove', function(event){

		});
		$(document).on('touchstart', function(event){

		});


		/**
		 * Detecting mousewheel scrolling
		 * 
		 * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
		 * http://www.sitepoint.com/html5-javascript-mouse-wheel/
		 */
		function MouseWheelHandler(e) {
			if(options.autoScrolling){
				// cross-browser wheel delta
				e = window.event || e;
				var delta = Math.max(-1, Math.min(1,
						(e.wheelDelta || -e.detail)));
				var scrollable;
				var activeSection = $('.section.active');
				
				if (!isMoving) { //if theres any #
				
					//if there are landscape slides, we check if the scrolling bar is in the current one or not
					if(activeSection.find('.slides').length){
						scrollable= activeSection.find('.slide.active').find('.scrollable');
					}else{
						scrollable = activeSection.find('.scrollable');
					}
				
					//scrolling down?
					if (delta < 0) {
						if(scrollable.length > 0 ){
							//is the scrollbar at the end of the scroll?
							if(isScrolled('bottom', scrollable)){
								$.fn.tmallstudio.moveSectionDown();
							}else{
								return true; //normal scroll
							}
						}else{
							$.fn.tmallstudio.moveSectionDown();
						}
					}

					//scrolling up?
					else {
						if(scrollable.length > 0){
							//is the scrollbar at the start of the scroll?
							if(isScrolled('top', scrollable)){
								$.fn.tmallstudio.moveSectionUp();
							}else{
								return true; //normal scroll
							}
						}else{
							$.fn.tmallstudio.moveSectionUp();
						}
					}
				}

				return false;
			}
		}

		function addScrollEvent(){
			if (document.addEventListener) {
				document.addEventListener("mousewheel", MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
				document.addEventListener("DOMMouseScroll", MouseWheelHandler, false); //Firefox
			} else {
				document.attachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
			}
		}

		$.fn.tmallstudio.moveSectionUp = function(){

		};

		$.fn.tmallstudio.moveSectionDown = function (){

		};

		$.fn.tmallstudio.moveTo = function (section, slide){

		};

		function scrollPage(element, callback) {

		}

		function scrollToAnchor(){

		}

		//detecting any change on the URL to scroll to the given anchor link
		//(a way to detect back history button as we play with the hashes on the URL)
		$(window).on('hashchange',function(){

		});


		/**
		 * Sliding with arrow keys, both, vertical and horizontal
		 */
		$(document).keydown(function(e) {

		});

		//navigation action 
		$(document).on('click', '#fullPage-nav a', function(e){

		});

		//navigation tooltips 
		$(document).on({

		}, '#fullPage-nav li');

		if(options.normalScrollElements){

		}


		/**
		 * Scrolling horizontally when clicking on the slider controls.
		 */
		$('.section').on('click', '.controlArrow', function() {

		});

		/**
		 * Scrolling horizontally when clicking on the slider controls.
		 */
		$('.section').on('click', '.toSlide', function(e) {

		});

		/**
		* Scrolls horizontal sliders.
		*/
		function landscapeScroll(slides, destiny){

		}

		if (!isTablet) {

		}

		$(window).bind('orientationchange', function() {
			doneResizing();
		});

		/**
		 * When resizing is finished, we adjust the slides sizes and positions
		 */
		function doneResizing() {

		}

		/**
		 * Resizing of the font size depending on the window size as well as some of the images on the site.
		 */
		function resizeMe(displayHeight, displayWidth) {

		}

		/**
		 * Activating the website navigation dots according to the given slide name.
		 */
		function activateNavDots(name, sectionIndex){

		}

		/**
		 * Activating the website main menu elements according to the given slide name.
		 */
		function activateMenuElement(name){

		}

		/**
		* Return a boolean depending on whether the scrollable element is at the end or at the start of the scrolling
		* depending on the given type.
		*/
		function isScrolled(type, scrollable){

		}


		/**
		* Retuns `up` or `down` depending on the scrolling movement to reach its destination
		* from the current section.
		*/
		function getYmovement(destiny){

		}


		/**
		* Retuns `right` or `left` depending on the scrolling movement to reach its destination
		* from the current slide.
		*/
		function getXmovement(fromIndex, toIndex){

		}

		function createSlimScrolling(element){

		}

		function addTableClass(element){
			element.addClass('table').wrapInner('<div class="tableCell" style="height:' + windowsHeight + 'px;" />');
		}

		/**
		* Adds a css3 transform property to the container class with or without animation depending on the animated param.
		*/
		function transformContainer(translate3d, animated){

		}

		/**
		* Scrolls to the given section and slide 
		*/
		function scrollPageAndSlide(destiny, slide){

		}


		/**
		* Scrolls the slider to the given slide destination for the given section
		*/
		function scrollSlider(section, slide){

		}

		/**
		* Creates a landscape navigation bar with dots for horizontal sliders.
		*/
		function addSlidesNavigation(section, numSlides){

		}

		/**
		* Scrolls the slider to the given slide destination for the given section
		*/
		$(document).on('click', '.fullPage-slidesNav a', function(e){


		});

		/**
		* Checks for translate3d support 
		* @return boolean
		* http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
		*/
		function support3d() {
			var el = document.createElement('p'), 
				has3d,
				transforms = {
					'webkitTransform':'-webkit-transform',
					'OTransform':'-o-transform',
					'msTransform':'-ms-transform',
					'MozTransform':'-moz-transform',
					'transform':'transform'
				};

			// Add it to the body to get the computed style.
			document.body.insertBefore(el, null);

			for (var t in transforms) {
				if (el.style[t] !== undefined) {
					el.style[t] = "translate3d(1px,1px,1px)";
					has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
				}
			}
			
			document.body.removeChild(el);

			return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
		}

	};


})(jQuery);