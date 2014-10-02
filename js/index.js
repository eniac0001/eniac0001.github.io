function Initialize() {
	canvas.addEventListener("mousemove", MouseMove, false);
	window.addEventListener("resize", ResizeCanvas, false);
	setInterval(TimeUpdate, 20);
	context.beginPath();
	ResizeCanvas()
}

function TimeUpdate(e) {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	var t, n, r, i = new Array(points.length);
	for (n = 0; n < particles.length; n++) {
		i[n] = new Array(particles.length);
		for (r = 0; r < particles.length; r++) {
			i[n][r] = 0
		}
	}
	for (var n = 0; n < particles.length; n++) {
		particles[n].x += particles[n].vx;
		particles[n].y += particles[n].vy;
		if (particles[n].x > window.innerWidth) {
			particles[n].vx = -1 - Math.random()
		} else if (particles[n].x < 0) {
			particles[n].vx = 1 + Math.random()
		} else {
			particles[n].vx *= 1 + Math.random() * .005
		} if (particles[n].y > window.innerHeight) {
			particles[n].vy = -1 - Math.random()
		} else if (particles[n].y < 0) {
			particles[n].y = window.innerHeight;
			particles[n].vy = 1
		} else {
			particles[n].vy *= 1
		}
		context.strokeStyle = particles[n].color;
		context.beginPath();
		var s = MAX_DIST_2;
		particles.forEach(function(e, t) {
			var r = Math.pow(e.x - particles[n].x, 2) + Math.pow(e.y - particles[n].y, 2);
			if (r < s && e != particles[n]) s = r;
			if (e == particles[n] || r > MAX_DIST_2 || i[n][t]) return;
			context.moveTo(particles[n].x, particles[n].y);
			var o = particles[n].x > e.x ? particles[n].x : e.x;
			var u = particles[n].y < e.y ? particles[n].y : e.y;
			context.quadraticCurveTo(o, u, e.x, e.y);
			context.strokeStyle = "rgba(179,249,121," + (1 - r / MAX_DIST_2) + " )";
			i[n][t] = 1;
			i[t][n] = 1
		});
		context.stroke();
		var o = DistanceBetween(mouse, particles[n]);
		o = Math.max(Math.min(15 - o / 10, 10), 1);
		context.fillStyle = particles[n].color;
		context.beginPath();
		context.arc(particles[n].x, particles[n].y, particles[n].size * o, 0, Math.PI * 2, true);
		context.closePath();
		context.fill()
	}
}

function MouseMove(e) {
	mouse.x = e.layerX;
	mouse.y = e.layerY
}

function Draw(e, t) {
	context.strokeStyle = "#ff0000";
	context.lineWidth = 4;
	context.lineTo(e, t);
	context.stroke()
}

function ResizeCanvas(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 5
}

function DistanceBetween(e, t) {
	var n = t.x - e.x;
	var r = t.y - e.y;
	return Math.sqrt(n * n + r * r)
}

function scrollToElement(e, t, n) {
	t = typeof t != "undefined" ? t : 1e3;
	n = typeof n != "undefined" ? n : 0;
	element = $(e);
	offset = element.offset();
	offsetTop = offset.top + n;
	$("html, body").animate({
		scrollTop: offsetTop
	}, t)
}
var particles = [];
var dots = Math.floor(window.innerWidth / 25);
for (var i = 0; i < dots; i++) {
	particles.push({
		x: Math.random() * window.innerWidth,
		y: Math.random() * window.innerHeight,
		vx: 0,
		vy: -1 * Math.random() - Math.random() - .05,
		history: [],
		size: 2,
		color: "#B3F979"
	})
}
var mouse = {
	x: 0,
	y: 0
};
var canvas = document.getElementById("canvasElement");
var points = [],
	width = canvas.width,
	height = canvas.height,
	intsy;
var MAX_DIST_2 = 100 * 100;
var circRadius = 4;
if (canvas && canvas.getContext) {
	var context = canvas.getContext("2d");
	Initialize()
}(function(e) {
	e.fn.vAlign = function() {
		return this.each(function(t) {
			var n = e(this).height();
			var r = e(this).parent().height();
			var i = Math.ceil((r - n) / 2);
			e(this).css("margin-top", i)
		})
	}
})(jQuery);
var body = document.body,
	timer;
window.addEventListener("scroll", function() {
	clearTimeout(timer);
	if (!body.classList.contains("disable-hover")) {
		body.classList.add("disable-hover")
	}
	timer = setTimeout(function() {
		body.classList.remove("disable-hover")
	}, 500)
}, false);
$(document).ready(function() {
	var e = $("nav.main").offset().top;
	var t = $("#canvasElement");
	$("a.tohome").click(function() {
		scrollToElement("body")
	});
	$("a.toprojects").click(function() {
		scrollToElement(".projectinfo")
	});
	$("a.toservices").click(function() {
		scrollToElement("#section5")
	});
	$("a.tocontact").click(function() {
		$("html, body").animate({
			scrollTop: $(document).height()
		}, 1e3)
	});
	$(".foliolink").hover(function() {
		if ($(this).attr("href") == "#") {
			$(this).css("cursor", "default")
		}
	});
	$(".foliolink").click(function() {
		if ($(this).attr("href") == "#") {
			event.preventDefault()
		}
	});
	$(".foliohover").click(function() {
		event.preventDefault()
	});
	$(window).bind("scroll", function() {
		if ($(window).scrollTop() > e) {
			$("nav.main").fadeOut(function() {
				$("nav.main").addClass("sticky");
				$("nav.sticky").removeClass("main")
			})
		} else {
			$("nav.sticky").addClass("main");
			$("nav.main").removeClass("sticky");
			$("nav.main").slideDown()
		}
		var n = t.offset();
		var r = $(this).scrollTop();
		var i = $(window).height();
		if (r > i) {
			t.fadeOut()
		}
		if (r <= i / 2) {
			t.fadeIn()
		}
	})
})