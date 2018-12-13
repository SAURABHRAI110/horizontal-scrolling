// // menu

// var menu = $(".wrapper a");

// menu.on("click", function() {
//   var menuNum = $(this).data("menu");
//   $(this).toggleClass("menu-" + menuNum + "-active");
//   $(".block2").fadeIn(200);
// });

// //hjh

// $("#my-menu-button").click(function() {
//   $("#my-menu").slideToggle();
// });

// $(function() {
//   $("body").mousewheel(function(event, delta) {
//     this.scrollLeft -= delta * 30;

//     event.preventDefault();
//   });
// });

//Horizontal Scroll
//https://codepen.io/karlovidek/pen/LzgYYd?editors=1010
//--------------------------------------------------------------------
(function($) {
  var types = ["DOMMouseScroll", "mousewheel"];

  if ($.event.fixHooks) {
    for (var i = types.length; i; ) {
      $.event.fixHooks[types[--i]] = $.event.mouseHooks;
    }
  }

  $.event.special.mousewheel = {
    setup: function() {
      if (this.addEventListener) {
        for (var i = types.length; i; ) {
          this.addEventListener(types[--i], handler, false);
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function() {
      if (this.removeEventListener) {
        for (var i = types.length; i; ) {
          this.removeEventListener(types[--i], handler, false);
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
      return this.unbind("mousewheel", fn);
    }
  });

  function handler(event) {
    var orgEvent = event || window.event,
      args = [].slice.call(arguments, 1),
      delta = 0,
      returnValue = true,
      deltaX = 0,
      deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if (orgEvent.wheelDelta) {
      delta = orgEvent.wheelDelta / 120;
    }
    if (orgEvent.detail) {
      delta = -orgEvent.detail / 3;
    }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if (
      orgEvent.axis !== undefined &&
      orgEvent.axis === orgEvent.HORIZONTAL_AXIS
    ) {
      deltaY = 0;
      deltaX = -1 * delta;
    }

    // Webkit
    if (orgEvent.wheelDeltaY !== undefined) {
      deltaY = orgEvent.wheelDeltaY / 120;
    }
    if (orgEvent.wheelDeltaX !== undefined) {
      deltaX = (-1 * orgEvent.wheelDeltaX) / 120;
    }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }
})(jQuery);

// EXTEND jQuery
$.js = function(el) {
  return $("[data-js=" + el + "]");
};

var mainWrapper = $.js("main-wrapper");
var sectionWrapper = $.js("sections-wrapper");

var vW = $(window).width();

mainWrapper.mousewheel(function(event, delta) {
  this.scrollLeft -= delta * 50;

  event.preventDefault();
});

Draggable.create(mainWrapper, {
  type: "scrollLeft",
  throwProps: true,
  cursor: "ew-resize"
});

function setWidth() {
  var section = $.js("section");
  var totalWidth = 0;

  section.each(function() {
    totalWidth += parseInt($(this).width(), 10);
  });

  sectionWrapper.css("width", "" + (totalWidth + 1) + "px");
}

setWidth();

$(window).on("resize", function() {
  setWidth();
});

//Smooth mouse Scrolling
//https://codepen.io/ejingfx/pen/EVvPwz?editors=0010
//--------------------------------------------------------------

$(document).ready(function() {
  // $fn.scrollSpeed(step, speed, easing);
  jQuery.scrollSpeed(200, 800);
});

// Custom scrolling speed with jQuery
// Source: github.com/ByNathan/jQuery.scrollSpeed
// Version: 1.0.2

(function($) {
  jQuery.scrollSpeed = function(step, speed, easing) {
    var $document = $(document),
      $window = $(window),
      $body = $("html, body"),
      option = easing || "default",
      root = 0,
      scroll = false,
      scrollY,
      scrollX,
      view;

    if (window.navigator.msPointerEnabled) return false;

    $window
      .on("mousewheel DOMMouseScroll", function(e) {
        var deltaY = e.originalEvent.wheelDeltaY,
          detail = e.originalEvent.detail;
        scrollY = $document.height() > $window.height();
        scrollX = $document.width() > $window.width();
        scroll = true;

        if (scrollY) {
          view = $window.height();

          if (deltaY < 0 || detail > 0)
            root = root + view >= $document.height() ? root : (root += step);

          if (deltaY > 0 || detail < 0) root = root <= 0 ? 0 : (root -= step);

          $body.stop().animate(
            {
              scrollTop: root
            },
            speed,
            option,
            function() {
              scroll = false;
            }
          );
        }

        if (scrollX) {
          view = $window.width();

          if (deltaY < 0 || detail > 0)
            root = root + view >= $document.width() ? root : (root += step);

          if (deltaY > 0 || detail < 0) root = root <= 0 ? 0 : (root -= step);

          $body.stop().animate(
            {
              scrollLeft: root
            },
            speed,
            option,
            function() {
              scroll = false;
            }
          );
        }

        return false;
      })
      .on("scroll", function() {
        if (scrollY && !scroll) root = $window.scrollTop();
        if (scrollX && !scroll) root = $window.scrollLeft();
      })
      .on("resize", function() {
        if (scrollY && !scroll) view = $window.height();
        if (scrollX && !scroll) view = $window.width();
      });
  };

  jQuery.easing.default = function(x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  };
})(jQuery);
