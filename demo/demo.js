function do_get_psot_demo() {
  var xhr = XHR();
  xhr.get('package.json', {'a': 'b'}, function(r) {
    r = r.json();
    console.log(r);
    alert(r.name + '\n' + r.summary);
  });
}

function do_on_function() {
  var xhr = XHR();
  xhr.on('success', function(r) {
    r = r.json();
    console.log(r);
    alert(r.name + ' code is here: ' + r.repository.url);
  });
  xhr.request('GET', 'package.json', null);
}

function do_sync_request() {
  var xhr = XHR(false);
  xhr.request('DELETE', 'package.json', null, function(r) {
    r = r.json();
    console.log(r);
    alert(r.name + ' code is here: ' + r.repository.url);
  }, function(r) {
    alert('Request error: \n' + r.status + '\n' + r.statusText);
  });
}