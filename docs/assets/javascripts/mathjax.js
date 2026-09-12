// MathJax 3 configuration.
//
// KaTeX is not usable here: the thesis uses \cal{T} in argument form, which
// KaTeX rejects. MathJax tolerates it, and display equations carry explicit
// \tag{} numbers so the printed thesis's numbering survives.
window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    tags: "none"
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

// Material's instant navigation swaps page content without a reload, so
// re-typeset on every navigation.
if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.startup.output.clearCache();
      window.MathJax.typesetClear();
      window.MathJax.texReset();
      window.MathJax.typesetPromise();
    }
  });
}
