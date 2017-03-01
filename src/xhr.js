/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: %%GULP_INJECT_VERSION%%
 * https://github.com/hustcc/xhr.js
**/
/* jshint expr: true */
!function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root); // nodejs support
    module.exports['default'] = module.exports; // es6 support
  }
  else root.XHR = factory(root);
}(typeof window !== 'undefined' ? window : this, function () {

  var XHR = function(async) {
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

    // binding event
    on = function(event, callback) {
      if (event && callback) _events[event] = callback;
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

    // set req header, key = value
    setRequestHeader = function(key, value) {
      _headers[key] = value;
    },

    // set req async or sync, default async
    setAsync = function(async) {
      _async = async;
    },

    // change array to url get format: a=b&c=d
    __params_2_url = function(params) {
      if (params && typeof params === 'object') {
          var encode = encodeURIComponent;
          var p = [];
          for (var key in params) {
              p.push(encode(key) + '=' + encode(params[key]));
          }
          return p.join('&');
      } 
      return '';
    },

    // req with method, url
    request = function(method, url, body, onsuccess, onfail) {
      _method = method;
      _url = url;
      _body = body;
      on('success', onsuccess);
      on('fail', onfail);
      return __request();
    },

    // get req
    get = function(url, params, onsuccess, onfail) {
      // url中包含get参数和params合并
      params = __params_2_url(params);
      if (params) url = url + '?' + params;
      return request('GET', url, '', onsuccess, onfail);
    },

    // post req
    post = function(url, params, onsuccess, onfail) {
      setRequestHeader('Content-Type', 'application/json');
      if (typeof params === 'object') {
        params = __params_2_url(params);
        setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
        
      return request('POST', url, params, onsuccess, onfail);
    },

    // private method, use XMLHttpRequest to send a request.
    __request = function() {
      _xhr.open(_method, _url, _async);
      // 设置 header 内容
      for (var key in _headers) _xhr.setRequestHeader(key, _headers[key]);
      _xhr.onreadystatechange = __on_request_callback;
      _xhr.send(_body);
      return _this;
    },

    // abort the XMLHttpRequest request.
    abort = function() {
      if (_xhr) _xhr.abort();
    },

    // get the request url, if method is GET, will add the params at the end of url.
    reqUrl = function() {
      return _url;
    },

    // request body, if method is POST, will add the params into the body.
    reqBody = function() {
      return _body;
    },
    // reset xhr
    reset = function() {
      _async = true;
      _url = '';
      _body = '';
      _method = '';
      _headers = {};
      _events = {};
    },

    // the return object.
    _this =  {
      // method
      url: reqUrl,
      body: reqBody,
      on: on,
      setRequestHeader: setRequestHeader,
      setAsync: setAsync,
      request: request,
      get: get,
      post: post,
      abort: abort,
      reset: reset
    };
    return _this;
  };
  return XHR;
});