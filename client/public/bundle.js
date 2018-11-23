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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/index.jsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/index.jsx":
/*!******************************!*\
  !*** ./client/src/index.jsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: G:\\\\Personal Projects\\\\test\\\\client\\\\src\\\\index.jsx: Unexpected token (8:4)\\n\\n   6 | \\n   7 | ReactDOM.render(\\n>  8 |     <Provider store={store}>\\n     |     ^\\n   9 |         <App/>\\n  10 |     </Provider>\\n  11 | , document.getElementById('root'));\\n    at Parser.raise (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:4028:15)\\n    at Parser.unexpected (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5343:16)\\n    at Parser.parseExprAtom (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6432:20)\\n    at Parser.parseExprSubscripts (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6019:21)\\n    at Parser.parseMaybeUnary (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5998:21)\\n    at Parser.parseExprOps (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5907:21)\\n    at Parser.parseMaybeConditional (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5879:21)\\n    at Parser.parseMaybeAssign (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5826:21)\\n    at Parser.parseExprListItem (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7111:18)\\n    at Parser.parseCallExpressionArguments (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6227:22)\\n    at Parser.parseSubscript (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6129:32)\\n    at Parser.parseSubscripts (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6039:19)\\n    at Parser.parseExprSubscripts (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6029:17)\\n    at Parser.parseMaybeUnary (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5998:21)\\n    at Parser.parseExprOps (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5907:21)\\n    at Parser.parseMaybeConditional (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5879:21)\\n    at Parser.parseMaybeAssign (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5826:21)\\n    at Parser.parseExpression (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5779:21)\\n    at Parser.parseStatementContent (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7391:21)\\n    at Parser.parseStatement (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7277:17)\\n    at Parser.parseBlockOrModuleBlockBody (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7829:23)\\n    at Parser.parseBlockBody (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7816:10)\\n    at Parser.parseTopLevel (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7242:10)\\n    at Parser.parse (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:8642:17)\\n    at parse (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:10648:38)\\n    at parser (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\normalize-file.js:170:34)\\n    at normalizeFile (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\normalize-file.js:138:11)\\n    at runSync (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\index.js:44:43)\\n    at runAsync (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\index.js:35:14)\\n    at process.nextTick (G:\\\\Personal Projects\\\\test\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transform.js:34:34)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jbGllbnQvc3JjL2luZGV4LmpzeC5qcyIsInNvdXJjZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./client/src/index.jsx\n");

/***/ })

/******/ });