// Preload the twinkle frames so the first flares don't flicker.
function preloadImages() {
  var colours = ["w", "y", "b"];
  for (var c = 0; c < colours.length; c++) {
    for (var n = 1; n <= 3; n++) {
      var sprite = new Image();
      sprite.src = "images/twinkle_" + colours[c] + n + ".gif";
    }
  }
}

// Timestamp component: "This page was last updated on ..."
function lastUpdated() {
  var months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
  var d = new Date(document.lastModified);
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

// Hit counter: builds the odometer out of digit GIFs (images/counter_0.gif
// through counter_9.gif), like FrontPage's Hit Counter component.
function drawCounter(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var value = String(Math.max(0, parseInt(el.getAttribute("data-value"), 10) || 0));
  var digits = parseInt(el.getAttribute("data-digits"), 10) || 6;
  while (value.length < digits) value = "0" + value;

  var html = '<img src="images/counter_left.gif" width="2" height="25" alt="">';
  for (var i = 0; i < value.length; i++) {
    html += '<img src="images/counter_' + value.charAt(i) + '.gif" width="16" height="25" alt="">';
  }
  html += '<img src="images/counter_right.gif" width="1" height="25" alt="">';

  el.innerHTML = html;
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", value);
  el.style.display = "inline-block";
  el.style.margin = "4px 0";
  el.style.lineHeight = "0";
}

// Twinkling starfield. The background is one tile repeated across the page;
// this lays a grid over it (one cell per tile) and gives every cell its own
// random schedule of stars flaring, so no two tiles twinkle alike.
// Star positions come from starfield.js, generated alongside images/stars.gif.
var twinkleLayer = null;
var twinkleRun = 0;

function startTwinkling() {
  if (typeof STAR_POINTS == "undefined") return;

  twinkleRun++;
  if (twinkleLayer) twinkleLayer.parentNode.removeChild(twinkleLayer);

  var root = document.documentElement;
  var width = Math.max(root.scrollWidth, document.body.scrollWidth);
  var height = Math.max(root.scrollHeight, document.body.scrollHeight);

  twinkleLayer = document.createElement("div");
  var s = twinkleLayer.style;
  s.position = "absolute";
  s.left = "0px";
  s.top = "0px";
  s.width = width + "px";
  s.height = height + "px";
  s.overflow = "hidden";
  s.zIndex = "-1";
  s.pointerEvents = "none";
  twinkleLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(twinkleLayer);

  for (var tx = 0; tx < width; tx += STAR_TILE) {
    for (var ty = 0; ty < height; ty += STAR_TILE) {
      scheduleTwinkle(tx, ty, twinkleRun, true);
    }
  }
}

function scheduleTwinkle(tx, ty, run, first) {
  // First flare is spread out so the tiles don't all start together.
  var wait = first ? Math.random() * 6000 : 1500 + Math.random() * 6000;
  setTimeout(function () {
    if (run != twinkleRun) return;
    var p = STAR_POINTS[Math.floor(Math.random() * STAR_POINTS.length)];
    twinkle(tx + p[0], ty + p[1], run);
    scheduleTwinkle(tx, ty, run, false);
  }, wait);
}

function twinkle(x, y, run) {
  var colours = ["w", "w", "y", "b"];
  var c = colours[Math.floor(Math.random() * colours.length)];
  var steps = [[1, 80], [2, 90], [3, 140], [2, 90], [1, 80]];
  var img = document.createElement("img");
  img.width = 9;
  img.height = 9;
  img.alt = "";
  img.style.position = "absolute";
  img.style.left = (x - 4) + "px";
  img.style.top = (y - 4) + "px";
  twinkleLayer.appendChild(img);

  var i = 0;
  (function next() {
    if (run != twinkleRun) return;
    if (i == steps.length) {
      if (img.parentNode) img.parentNode.removeChild(img);
      return;
    }
    img.src = "images/twinkle_" + c + steps[i][0] + ".gif";
    setTimeout(next, steps[i++][1]);
  })();
}

var twinkleResizeTimer = null;
window.onresize = function () {
  clearTimeout(twinkleResizeTimer);
  twinkleResizeTimer = setTimeout(startTwinkling, 300);
};

// Header stars minimize / maximize their section.
function toggleSection(key) {
  var body = document.getElementById(key + "-body");
  var toggle = document.getElementById(key + "-toggle");
  if (!body || !toggle) return;
  var opening = body.style.display == "none";
  body.style.display = opening ? "" : "none";

  var label = opening ? "Minimize" : "Maximize";
  toggle.setAttribute("aria-expanded", opening ? "true" : "false");
  var star = toggle.getElementsByTagName("img")[0];
  if (star) star.alt = label + " " + key + " section";

  // Keep the tooltip in step if the pointer is still on the star.
  if (tooltip && tooltip.style.visibility == "visible") showSectionTooltip(toggle, key);

  // The page got taller or shorter, so re-cover it with twinkles.
  if (twinkleLayer) startTwinkling();
}

// Windows 98-style tooltip for the header stars: pale yellow box, thin black
// border, small sans-serif text, appearing just below the star.
var SECTION_NAMES = { about: "About Me", projects: "My Projects", contact: "Contact Me" };
var tooltip = null;
var tooltipTimer = null;

function setupSectionTooltips() {
  tooltip = document.createElement("div");
  var s = tooltip.style;
  s.position = "absolute";
  s.visibility = "hidden";
  s.zIndex = "10";
  s.padding = "2px 5px";
  s.background = "#FFFFE1";
  s.color = "#000000";
  s.border = "1px solid #000000";
  s.font = "11px Tahoma, Verdana, Arial, sans-serif";
  s.whiteSpace = "nowrap";
  s.pointerEvents = "none";
  s.boxShadow = "2px 2px 0 rgba(0, 0, 0, 0.5)";
  tooltip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tooltip);

  for (var key in SECTION_NAMES) {
    var toggle = document.getElementById(key + "-toggle");
    if (!toggle) continue;
    (function (toggle, key) {
      toggle.onmouseover = toggle.onfocus = function () {
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(function () { showSectionTooltip(toggle, key); }, 250);
      };
      toggle.onmouseout = toggle.onblur = hideSectionTooltip;
    })(toggle, key);
  }
}

function showSectionTooltip(toggle, key) {
  var open = document.getElementById(key + "-body").style.display != "none";
  tooltip.innerHTML = (open ? "Click to minimize " : "Click to open ") + SECTION_NAMES[key];
  var r = toggle.getBoundingClientRect();
  tooltip.style.left = (r.left + window.pageXOffset + 4) + "px";
  tooltip.style.top = (r.bottom + window.pageYOffset + 6) + "px";
  tooltip.style.visibility = "visible";
}

function hideSectionTooltip() {
  clearTimeout(tooltipTimer);
  if (tooltip) tooltip.style.visibility = "hidden";
}
