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
			options.autoScrolling = value;
			var element = $('.section.active');
			if(options.autoScrolling){
				$('html, body').css({
					'overflow' : 'hidden',
					'height' : '100%'
				});
				
				if(element.length){
					//moving the container up
					if(options.css3){
						var translate3d = 'translate3d(0px, -' + element.position().top + 'px, 0px)';
						transformContainer(translate3d, false)
					}else{
						//deleting the possible negative top
						$('#superContainer').css('top', '-'  + element.position().top + 'px');
					}
				}
			}else{
				$('html, body').css({
					'overflow' : 'auto',
					'height' : 'auto'
				});
				if(options.css3){
					//moving the container up
					var translate3d = 'translate3d(0px, 0px, 0px)';
					transformContainer(translate3d, false)
				}else{
					//deleting the possible negative top
					$('#superContainer').css('top', '0px');
				}
				//scrolling the page to the section with no animation
				$('html, body').scrollTop(element.position().top);
			}
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
				var link = '';
				if(options.anchors.length){
					link = options.anchors[index];
				}
				var tooltip = options.navigationTooltips[index];
				if(typeof tooltip === 'undefined'){
					tooltip = '';
				}
				
				nav.find('ul').append('<li data-tooltip="' + tooltip + '"><a href="#' + link + '"><span></span></a></li>');
			}

			// if there's any slide
			if (numSlides > 0) {
				var sliderWidth = numSlides * 100;
				var slideWidth = 100 / numSlides;
				
				slides.wrapAll('<div class="slidesContainer" />');
				slides.parent().wrap('<div class="slides" />');

				$(this).find('.slidesContainer').css('width', sliderWidth + '%');
				$(this).find('.slides').after('<div class="controlArrow prev"></div><div class="controlArrow next"></div>');
				$(this).find('.controlArrow.next').css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
				$(this).find('.controlArrow.prev').css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
				
				if(!options.loopHorizontal){
					$(this).find('.controlArrow.prev').hide();
				}

				if(options.slidesNavigation){
					addSlidesNavigation($(this), numSlides);
				}
				
				slides.each(function(index) {
					if(!index){
						$(this).addClass('active');
					}
					
					$(this).css('width', slideWidth + '%');
					
					if(options.verticalCentered){
						addTableClass($(this));
					}
				});
			} else {
				if(options.verticalCentered){
					addTableClass($(this));
				}
			}
        // Top is OK. ......................................................................................
		}).promise().done(function(){
			$.fn.tmallstudio.setAutoScrolling(options.autoScrolling);

			$.isFunction( options.afterRender ) && options.afterRender.call( this);

			//fixed elements need to be moved out of the plugin container due to problems with CSS3.
			if(options.fixedElements && options.css3){
				$(options.fixedElements).appendTo('body');
			}
			
			//vertical centered of the navigation + first bullet active
			if(options.navigation){
				nav.css('margin-top', '-' + (nav.height()/2) + 'px');
				nav.find('li').first().find('a').addClass('active');
			}
			
			//moving the menu outside the main container (avoid problems with fixed positions when using CSS3 tranforms)
			if(options.menu && options.css3){
				$(options.menu).appendTo('body');
			}

			if(options.scrollOverflow){
				//after DOM and images are loaded 
				$(window).on('load', function() {
					
					$('.section').each(function(){
						var slides = $(this).find('.slide');
						
						if(slides.length){
							slides.each(function(){
								// This function ----------------------------------------------------------------
								createSlimScrolling($(this));
							});
						}else{
							createSlimScrolling($(this));
						}
						
					});
				});
			}

			$(window).on('load', function() {
				scrollToAnchor();	
			});
		});
		
		var scrollId;
		var isScrolling = false;

		// OK ...
		//when scrolling...
		$(window).scroll(function(e){
			if(!options.autoScrolling){	

				var currentScroll = $(window).scrollTop();
				
				var scrolledSections = $('.section').map(function(){
					if ($(this).offset().top < (currentScroll + 100)){
						return $(this);
					}
				});
				
				//geting the last one, the current one on the screen
				var currentSection = scrolledSections[scrolledSections.length-1];
				
				//executing only once the first time we reach the section
				if(!currentSection.hasClass('active')){
					isScrolling = true;	
					
					var yMovement = getYmovement(currentSection);
					
					$('.section.active').removeClass('active');
					currentSection.addClass('active');
				
					var anchorLink  = currentSection.data('anchor');
					$.isFunction( options.onLeave ) && options.onLeave.call( this, currentSection.index('.section'), yMovement);

					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (currentSection.index('.section') + 1));
					
					activateMenuElement(anchorLink);	
					activateNavDots(anchorLink, 0);
					
				
					if(options.anchors.length && !isMoving){
						//needed to enter in hashChange event when using the menu with anchor links
						lastScrolledDestiny = anchorLink;
			
						location.hash = anchorLink;
					}
					
					//small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
					clearTimeout(scrollId);
					scrollId = setTimeout(function(){					
						isScrolling = false;
					}, 100);
				}
			}
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
			var prev = $('.section.active').prev('.section');
			
			//looping to the bottom if there's no more sections above
			if(options.loopTop && !prev.length){
				prev = $('.section').last();
			}

			if (prev.length > 0 || (!prev.length && options.loopTop)){
				scrollPage(prev);
			}
		};

		$.fn.tmallstudio.moveSectionDown = function (){
			var next = $('.section.active').next('.section');
			
			//looping to the top if there's no more sections below
			if(options.loopBottom && !next.length){
				next = $('.section').first();
			}
	
			if (next.length > 0 || (!next.length && options.loopBottom)){
				scrollPage(next);
			}
		};

		$.fn.tmallstudio.moveTo = function (section, slide){

		};

		function scrollPage(element, callback) {
			var scrollOptions = {}, scrolledElement;
			var dest = element.position();
			var dtop = dest !== null ? dest.top : null;
			var yMovement = getYmovement(element);
			var anchorLink  = element.data('anchor');
			var sectionIndex = element.index('.section');
			var leavingSection = $('.section.active').index('.section') + 1;
			
			element.addClass('active').siblings().removeClass('active');
			
			//preventing from activating the MouseWheelHandler event
			//more than once if the page is scrolling
			isMoving = true;
			
			if(!$.isFunction( callback )){
				if(typeof anchorLink !== 'undefined'){
					location.hash = anchorLink;
				}else{
					location.hash = '';
				}
			}
			
			if(options.autoScrolling){
				scrollOptions['top'] = -dtop;
				scrolledElement = '#superContainer';
			}else{
				scrollOptions['scrollTop'] = dtop;
				scrolledElement = 'html, body';
			}		
						
			if(options.css3 && options.autoScrolling){

				
				$.isFunction( options.onLeave ) && options.onLeave.call( this, leavingSection, yMovement);

				var translate3d = 'translate3d(0px, -' + dtop + 'px, 0px)';
				transformContainer(translate3d, true);
				
				setTimeout(function(){
					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (sectionIndex + 1));

						setTimeout(function(){
							isMoving = false;
							$.isFunction( callback ) && callback.call( this);
						}, scrollDelay);
				}, options.scrollingSpeed);
			}else{
				$.isFunction( options.onLeave ) && options.onLeave.call( this, leavingSection, yMovement);
				
				$(scrolledElement).animate(
					scrollOptions 
				, options.scrollingSpeed, options.easing, function() {
					//callback
					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (sectionIndex + 1));
					
					setTimeout(function(){
						isMoving = false;
						$.isFunction( callback ) && callback.call( this);
					}, scrollDelay);
				});
			}
			
			//flag to avoid callingn `scrollPage()` twice in case of using anchor links
			lastScrolledDestiny = anchorLink;
			
			//avoid firing it twice (as it does also on scroll)
			if(options.autoScrolling){
				activateMenuElement(anchorLink);
				activateNavDots(anchorLink, sectionIndex);
			}
		}

		function scrollToAnchor(){
			//getting the anchor link in the URL and deleting the `#`
			var value =  window.location.hash.replace('#', '').split('/');
			var section = value[0];
			var slide = value[1];
						
			if(section){  //if theres any #	
			    // This function -----------------------------------------------------------------------			
				scrollPageAndSlide(section, slide);
			}
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

		if (!isTablet) {

		}

		$(window).bind('orientationchange', function() {
			doneResizing();
		});

		/**
		* Scrolls the slider to the given slide destination for the given section
		*/
		$(document).on('click', '.fullPage-slidesNav a', function(e){


		});

		/**
		* Scrolls horizontal sliders.
		*/
		function landscapeScroll(slides, destiny){

		}

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
			$('#superContainer').toggleClass('easing', animated);
			
			$('#superContainer').css({
				'-webkit-transform': translate3d,
				'-moz-transform': translate3d,
				'-ms-transform':translate3d,
				'transform': translate3d
			});
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
		* OK...
		* Creates a landscape navigation bar with dots for horizontal sliders.
		*/
		function addSlidesNavigation(section, numSlides){
			section.append('<div class="fullPage-slidesNav"><ul></ul></div>');
			var nav = section.find('.fullPage-slidesNav');

			//top or bottom
			nav.addClass(options.slidesNavPosition);

			for(var i=0; i< numSlides; i++){			
				nav.find('ul').append('<li><a href="#"><span></span></a></li>');
			}
			
			//centering it
			nav.css('margin-left', '-' + (nav.width()/2) + 'px');
			
			nav.find('li').first().find('a').addClass('active');
		}

		/**
		* OK...
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