/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v1.0.3
 * https://github.com/hustcc/xhr.js
 **/

!function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root); // nodejs support
    module.exports['default'] = module.exports; // es6 support
  }
  else root.XHR = factory(root);
}(typeof window !== 'undefined' ? window : this, function () {

  /**
 * XHR: the function to get `XHR` instance.
 * - async: request async or sync, default is async.
 *
 * How to use it?
 * var XHRLib = require('xhr.js');
 * var xhr = XHRLib(); // all use default.
 * var xhr = XHRLib(false); // use async to request.
**/
var XHR = function(async) {
  /**
   * Result: the function to get `Result` instance. The request result object.
   * - xhrObj: the xhr obj which can get the xhr result.
   *
   * How to use it? if `r` is the instance of `Result`.
   * var r_json = r.json();
   * var status = r.status_code;
   * var headers = r.headers;
  **/
  var Result = function(xhrObj) {
    var headers = {}, header;
    // code from https://github.com/developit/unfetch/blob/master/src/index.js
    xhrObj.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, function(m, key, value) {
      header = headers[key];
      headers[key] = header ? header + ',' + value : value;
    });
    return {
      status: xhrObj.status,
      statusText: xhrObj.statusText,
      url: xhrObj.responseURL,
      text: xhrObj.responseText,
      responseType: xhrObj.responseType,
      headers: headers,
      ok: function() { return (xhrObj.status/200|0) == 1; },    // 200-399
      json: function() { return JSON.parse(xhrObj.responseText); },
      xml: function() { return xhrObj.responseXML; },
      blob: function() { return new Blob([xhrObj.response]); }
    };
  },

  _method = '',
  _url = '',
  _headers = {},
  _body = '',
  _async = async !== false,
  _events = {},

  _xhr = new XMLHttpRequest(),

  _typeof = function(v) {
    if (v === null) return 'null';
    if (v !== Object(v)) return typeof v;
    return ({}).toString.call(v).slice(8, -1).toLowerCase();
  },
  /**
   * on: the function `on` to binding event.
   * - event: the event name. can be `ready`, `error`, `success`, `fail`.
   * - callback: when event trigger, do the callback.
   *
   * How to use it?
   * var XHRLib = require('xhr.js');
   * var xhr = XHRLib(); // all use default.
   * xhr.on('ready', function(r) {});
   * xhr.on('error', function(r) {});
   * xhr.on('success', function(r) {});
   * xhr.on('fail', function(r) {});
  **/
  on = function(event, callback) {
    if ('ready-success-fail'.split('-').indexOf(event) >= 0 && _typeof(callback) == 'function')
      _events[event] = callback;
  },
  __callback_func = function(t) {
    return _events[t] ? _events[t]: function() {};
  },
  // onreadystatechange callback function
  __on_request_callback = function() {
    if (_xhr.readyState === 4) {
      var result = Result(_xhr);
      // ready
      __callback_func('ready')(result, _this);
      // success
      if (_xhr.status === 200) __callback_func('success')(result, _this);
      // fail
      else __callback_func('fail')(result, _this);
    }
  },

  /**
   * setRequestHeader: set the request header.
   * - key: the header key.
   * - value: the header value.
   *
   * How to use it?
   * var xhr = new require('xhr.js')();
   *
   * xhr.setRequestHeader('Content-Type', 'application/json');
  **/
  setRequestHeader = function(key, value) {
    _headers[key] = value;
  },

  /**
   * setAsync: set the request async / sync.
   * - async: the default is async.
   *
   * How to use it?
   * var xhr = new require('xhr.js')();
   *
   * xhr.setAsync(false);
  **/
  setAsync = function(async) {
    _async = async;
  },


  // change array to url get format: a=b&c=d
  _params_2_url = function(params) {
    var encode = encodeURIComponent,
      p = [],
      key;
    for (key in params) p.push(encode(key) + '=' + encode(params[key]));

    return p.join('&');
  },

  /**
   * request: submit a request.
   * - method: the request method.
   * - url: the request url.
   * - body: the request body, can be dict / formdata.
   * - onsuccess: when request success.
   * - onfail: when request fail.
   *
   * How to use it?
   * var xhr = new require('xhr.js')();
   *
   * xhr.request('GET', '/update_name', {'name': 'hustcc'}, onsuccess, onerror);
  **/
  request = function(method, url, body, onsuccess, onfail) {
    _method = method;
    _url = url;
    _body = body;
    on('success', onsuccess);
    on('fail', onfail);
    return _request();
  },

  /**
   * get: submit a request with method = 'GET'.
   * - url: the request url.
   * - params: the request params.
   * - onsuccess: when request success.
   * - onfail: when request fail.
   *
   * How to use it?
   * var xhr = new require('xhr.js')();
   *
   * xhr.get('/update_name', {'name': 'hustcc'}, onsuccess, onerror);
  **/
  get = function(url, params, onsuccess, onfail) {
    // url中包含 get 参数和 params 合并
    if (_typeof(params) == 'object') params = _params_2_url(params);
    else params = '';

    if (params) url = url + '?' + params;
    return request('GET', url, '', onsuccess, onfail);
  },

  /**
   * post: submit a request with method = 'POST'.
   * - url: the request url.
   * - params: the request params.
   * - onsuccess: when request success.
   * - onfail: when request fail.
   *
   * How to use it?
   * var xhr = new require('xhr.js')();
   *
   * xhr.post('/update_name', {'name': 'hustcc'}, onsuccess, onerror);
   * xhr.post('/update_img', new FormData(), onsuccess, onerror);
  **/
  post = function(url, params, onsuccess, onfail) {
    var t = _typeof(params), cn = 'Content-Type', cv = 'application/';

    if (t == 'object') {
      params = _params_2_url(params);
      setRequestHeader(cn, cv + 'x-www-form-urlencoded');
    }
    else if (t == 'formdata') {} // for formdata type.
    else setRequestHeader(cn, cv + 'json');
    // if is string / formdata
    return request('POST', url, params, onsuccess, onfail);
  },


  // private method, use XMLHttpRequest to send a request.
  _request = function() {
    _xhr.open(_method, _url, _async);
    // 设置 header 内容
    for (var key in _headers) _xhr.setRequestHeader(key, _headers[key]);
    _xhr.onreadystatechange = __on_request_callback;
    _xhr.send(_body);
    return _this;
  },

  // the return object.
  _this =  {
    /**
     * url: get the request url.
     *
     * How to use it?
     * var xhr = new require('xhr.js')();
     *
     * xhr.url();
    **/
    url: function() {return _url;},
    /**
     * body: get the request body.
     *
     * How to use it?
     * var xhr = new require('xhr.js')();
     *
     * xhr.body();
    **/
    body: function() {return _body;},
    on: on,
    setRequestHeader: setRequestHeader,
    setAsync: setAsync,
    request: request,
    get: get,
    post: post,
    /**
     * abort: to abort request.
     *
     * How to use it?
     * var xhr = new require('xhr.js')();
     *
     * xhr.abort();
    **/
    abort: _xhr.abort,
    /**
     * reset: to reset the xhr instance, all will again.
     *
     * How to use it?
     * var xhr = new require('xhr.js')();
     *
     * xhr.reset();
    **/
    reset: function() {
      _async = true;
      _url = _body = _method = '';
      _headers = _events = {};
    }
  };
  return _this;
};


  return XHR;
});