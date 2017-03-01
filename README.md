# xhr.js

> xhr.js is a library(< 2Kb) to make AJAX/HTTP restful requests with **XMLHttpRequest**. It has similar API with Python-requests.

[![Build Status](https://travis-ci.org/hustcc/xhr.js.svg?branch=master)](https://travis-ci.org/hustcc/xhr.js) [![npm](https://img.shields.io/npm/v/xhr.js.svg?style=flat-square)](https://www.npmjs.com/package/xhr.js) [![npm](https://img.shields.io/npm/dt/xhr.js.svg?style=flat-square)](https://www.npmjs.com/package/xhr.js) [![npm](https://img.shields.io/npm/l/xhr.js.svg?style=flat-square)](https://www.npmjs.com/package/xhr.js)


# Usage

**1. Install xhr.js**

```sh
npm install xhr.js
```

**2. import xhr.js**


UMD import is supported, then get global object: `XHR`.

```js
import XHR from 'xhr.js';

// or

var XHR = require("xhr.js");
```

or link with `script` in html files: 

```js
<script src="dist/xhr.min.js"></script>
```

**3. use class `XHR`**

```js
var xhr = XHR(async); // default is async. you can set sync use  XHR(false)
xhr.on('success', function(result) {
	console.log('status:', result.status);
	console.log('statusText:', result.statusText);
	console.log('url:', result.url);
	console.log('responseType:', result.responseType);
	console.log('text:', result.text);
	console.log('headers:', result.headers);

	console.log('ok:', result.ok()); // get the json result.
	console.log('json:', result.json()); // get the json result.
	console.log('xml:', result.xml());
	console.log('blob:', result.blob());
});

xhr.get('package.json', {'a': 'b'});
```

Another `post` demo:

```js
var xhr = XHR();
xhr.post('/post_url', {'a': 'b'}, function(r) {
	r = r.json(); // get the json result.
	// write your code
});
```


# Detail API

## 1. XHR API

The API of xhr instance.

1. **`xhr.request(method, url, body, onsuccess, onfail)`**: request the url, with the method.
2. **`xhr.on(event_key, event_func)`**: bind the request result(ready, error, success, fail), with result instance as it input.
2. **`xhr.get(url, params, onsuccess, onfail)`**: get request.
3. **`xhr.post(url, params, onsuccess, onfail)`**: post request.
4. **`xhr.setRequestHeader(header_name, header_value)`**: append a header.
5. **`xhr.setAsync(aysnc)`**: set request async / sync.
6. **`xhr.url()`**: get the request url.
7. **`xhr.body()`**: get the request body.
8. **`xhr.abort()`**: abort request.
9. **`xhr.reset()`**: reset the xhr instance, such url, headers, body, events.


## 2. XHR Event key

The evnet keys is for API `on`.

1. **`ready`**: when `xhr` is ready.
2. **`success`**: when `status_code is 200`.
3. **`fail`**: when `status_code is not 200`.

## 3. Response API

The api is for request callback function paramter `result`.

1. **`result.text`**: get all response text;
2. **`result.status`**: the server response code;
3. **`result.statusText`**: the server response code text, e.g. `ok` (status code is `200`).
4. **`result.responseType`**: response type;
5. **`result.headers`**: get all the response headers object;
6. **`result.ok()`**: is request ok;
7. **`result.json()`**: get the json object of response text;
8. **`result.xml()`**: get the xml object of response text;
9. **`result.blob()`**: get the blob object of response text;


# TODO

 - request auth
 - a http test chrome plugin, like postman.


# LICENSE

MIT