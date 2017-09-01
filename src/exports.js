/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: %%GULP_INJECT_VERSION%%
 * https://github.com/hustcc/xhr.js
 **/

!function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root); // nodejs support
    module.exports['default'] = module.exports; // es6 support
  }
  else root.XHR = factory(root);
}(typeof window !== 'undefined' ? window : this, function () {

  {{ SOURCE_CODE }}

  return XHR;
});