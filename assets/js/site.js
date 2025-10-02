// Auto-inject nav/footer & fix GitHub Pages paths
(function () {
  var path = window.location.pathname;
  var baseMatch = path.indexOf('/safetycheckpro/') === 0 || path === '/safetycheckpro' ? '/safetycheckpro' : '';
  var BASE = baseMatch;

  function withBase(url) {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return BASE + url;
    return url;
  }

  function rewriteAttributes() {
    var selectors = [
      ['link', 'href'], ['script', 'src'], ['a', 'href'], ['img', 'src']
    ];
    selectors.forEach(function (pair) {
      var els = document.querySelectorAll(pair[0] + '[' + pair[1] + ']');
      els.forEach(function (el) {
        var val = el.getAttribute(pair[1]);
        if (val && val.startsWith('/')) el.setAttribute(pair[1], withBase(val));
      });
    });
  }

  function includePartials() {
    var includes = document.querySelectorAll('[data-include]');
    var fetches = [];
    includes.forEach(function (el) {
      var url = withBase(el.getAttribute('data-include'));
      fetches.push(
        fetch(url, { cache: 'no-cache' })
          .then(function (res) { return res.text(); })
          .then(function (html) { el.outerHTML = html; })
          .catch(function (err) { console.error('Include failed:', url, err); })
      );
    });
    return Promise.all(fetches);
  }

  document.addEventListener('DOMContentLoaded', function () {
    includePartials().then(rewriteAttributes);
  });
})();
