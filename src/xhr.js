/* jshint expr: true */ 
!function (root, factory) {
  if (typeof module === 'object' && module.exports)
    module.exports = factory(root);
  else
    root.XHR = factory(root);
}(typeof window !== 'undefined' ? window : this, function () {

  var XHR = function(async) {
    /* the request result object */
    var  _Result = function(xhrObj) {
      var text = xhrObj.responseText,
        status_code = xhrObj.status,
        status_text = xhrObj.statusText,
        response_type = xhrObj.responseType,
        header_text = xhrObj.getAllResponseHeaders(),
        json = function() {
          try {
            return JSON.parse(text);
          } catch(e) {
            return null;
          }
        },
        __xml = xhrObj.responseXML,
        xml = function() {
          return __xml;
        },
        __headers = null, // cached the header data, only calculate once.
        headers = function() {
          if (__headers === null) {
            __headers = {};

            if (header_text) {
              var tmp_array = header_text.split('\n');
              var tmp_line = '';
              for (var i = 0; i < tmp_array.length; i ++) {
                tmp_line = tmp_array[i].split(': ');
                if (tmp_line && tmp_line.length === 2 && tmp_line[0]) {
                  __headers[tmp_line[0]] = tmp_line[1];
                }
              }
            }
          }
          return __headers;
        };
      // the return object
      return {
        text: text,
        status_code: status_code,
        status_text: status_text,
        response_type: response_type,
        header_text: header_text,
        json: json,
        xml: xml,
        headers: headers
      };
    },

    __blank_func = function() {},

    __init_event = function() {
      return {
        'ready': __blank_func, // when connected to server 
        'error': __blank_func, // when 
        'success': __blank_func, // when server status code == 200
        'fail': __blank_func // when server status code != 200
      };
    }, 
    _method = '',
    _url = '',
    _headers = {},
    _body = '',
    _async = async === false ? false : true,

    _events = __init_event(),

    _xhr = new XMLHttpRequest(),

    // binding event
    on = function(event, callback) {
      if (event === 'ready' || event === 'error' || event === 'success' || event === 'fail') {
        if (typeof callback === 'function') {
          _events[event] = callback;
        }
      }
    },

    // onreadystatechange callback function 
    __on_request_callback = function() {
      var result = _Result(_xhr);
      if (_xhr.readyState === 4) {
        // ready
        _events.ready(result, _this);
        // success
        if (_xhr.status === 200) _events.success(result, _this);
        // fail
        else _events.fail(result, _this);
      }
      // error
      else _events.error(result, _this);
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
      // 设置header内容
      for (var key in _headers)
        _xhr.setRequestHeader(key, _headers[key]);

      _xhr.onreadystatechange = __on_request_callback;
      _xhr.send(_body);
      return _this;
    },

    // abort the XMLHttpRequest request.
    abort = function() {
      if (_xhr)
        _xhr.abort();
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
      _events = __init_event();
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