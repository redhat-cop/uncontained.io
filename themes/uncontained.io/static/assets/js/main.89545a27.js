/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var shuffle = exports.shuffle = function shuffle(array) {
  var shuffled = [].concat(_toConsumableArray(array)),
      currIndex = array.length,
      tempValue = void 0,
      randIndex = void 0;

  while (currIndex) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex--;

    tempValue = shuffled[currIndex];
    shuffled[currIndex] = shuffled[randIndex];
    shuffled[randIndex] = tempValue;
  }

  return shuffled;
};

var detailsTagSupported = exports.detailsTagSupported = function detailsTagSupported() {
  var el = document.createElement('details');
  if (!('open' in el)) return false;

  el.innerHTML = '<summary>a</summary>b';
  document.body.appendChild(el);

  var diff = el.offsetHeight;
  el.open = true;
  var result = diff != el.offsetHeight;

  document.body.removeChild(el);
  return result;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = docReady;

function docReady(callback) {

    function completed() {
        document.removeEventListener("DOMContentLoaded", completed, false);
        window.removeEventListener("load", completed, false);
        callback();
    }

    //Events.on(document, 'DOMContentLoaded', completed)

    if (document.readyState === "complete") {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout(callback);
    } else {

        // Use the handy event callback
        document.addEventListener("DOMContentLoaded", completed, false);

        // A fallback to window.onload, that will always work
        window.addEventListener("load", completed, false);
    }
}

module.exports = exports["default"];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

var _es6Docready = __webpack_require__(1);

var _es6Docready2 = _interopRequireDefault(_es6Docready);

var _helpers = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _es6Docready2.default)(function () {
  var body = document.body;

  var taxonomyClouds = document.querySelectorAll('.taxonomy-cloud ul:not(.no-shuffle)');
  if (taxonomyClouds.length) {
    taxonomyClouds.forEach(function (taxonomyCloud) {
      var terms = taxonomyCloud.querySelectorAll('li');
      (0, _helpers.shuffle)(terms).forEach(function (term) {
        return term.parentElement.appendChild(term);
      });
    });
  }

  var toc = document.querySelector('.entry-toc');
  if (toc) {
    if (!(0, _helpers.detailsTagSupported)()) {
      document.body.classList.add('no-details');
      var tocToggler = document.querySelector('.toc-title');
      tocToggler.addEventListener('click', function () {
        if (toc.getAttribute('open')) {
          toc.open = false;
          toc.removeAttribute('open');
        } else {
          toc.open = true;
          toc.setAttribute('open', 'open');
        }
      });
    }
  }

  var sidebar = document.querySelector('#sidebar');
  if (sidebar) {
    var toggler = document.querySelector('#sidebar-toggler');
    var overlay = document.querySelector('.sidebar-overlay');

    var innerToggler = toggler.cloneNode(true);
    innerToggler.setAttribute('id', '#sidebar-inner-toggler');
    sidebar.appendChild(innerToggler);

    var hideSidebar = function hideSidebar() {
      body.classList.remove('sidebar-toggled');
      toggler.classList.remove('is-active');
      innerToggler.classList.remove('is-active');
      toggler.setAttribute('aria-expanded', 'false');
      innerToggler.setAttribute('aria-expanded', 'false');
      sidebar.setAttribute('aria-expanded', 'false');
    };

    var showSidebar = function showSidebar() {
      body.classList.add('sidebar-toggled');
      toggler.classList.add('is-active');
      innerToggler.classList.add('is-active');
      toggler.setAttribute('aria-expanded', 'true');
      innerToggler.setAttribute('aria-expanded', 'true');
      sidebar.setAttribute('aria-expanded', 'true');
    };

    var toggleSidebar = function toggleSidebar() {
      return body.classList.contains('sidebar-toggled') ? hideSidebar() : showSidebar();
    };

    sidebar.setAttribute('aria-expanded', 'false');

    toggler.addEventListener('click', toggleSidebar);
    innerToggler.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', hideSidebar);
  }
});

/***/ })
/******/ ]);