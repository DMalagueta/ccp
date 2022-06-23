/* !(function () {
  var agent = navigator.userAgent,
    isB = !1,
    totalLoaded = 0,
    loadedScripts = {};
  function loadPlainScripts() {
    var scripts = document.querySelectorAll("script[type*=plain]");
    0 < scripts.length &&
      ((scripts = Array.from(scripts)),
      scripts.forEach(function (s) {
        var src = s.getAttribute("data-src"),
          userScripts = "user-scripts-file" === s.getAttribute("id");
        null === src || userScripts ? eval(s.innerText) : loadScript(src);
      }));
  }
  function loadScript(t, e) {
    var i, r;
    (e = e || function () {}),
      !0 === loadedScripts[t] && void 0 !== e
        ? e()
        : Array.isArray(loadedScripts[t])
        ? loadedScripts[t].push(e)
        : ((loadedScripts[t] = []),
          loadedScripts[t].push(e),
          (r = !1),
          ((i = document.createElement("script")).type = "text/javascript"),
          (i.src = t),
          (i.async = !0),
          (i.onload = i.onreadystatechange =
            function () {
              if (!(r || (this.readyState && "complete" != this.readyState))) {
                r = !0;
                let e = loadedScripts[t];
                for (let t = 0; t < e.length; t++) void 0 !== e[t] && e[t]();
                loadedScripts[t] = !0;
              }
            }),
          (e =
            document.getElementsByTagName("script")[0]).parentNode.insertBefore(
            i,
            e
          ));
  }
  function loadScriptsSeq() {
    loadScript(window.BondLayerScripts[totalLoaded], function () {
      (++totalLoaded >= window.BondLayerScripts.length
        ? loadPlainScripts
        : loadScriptsSeq)();
    });
  }
  if (void 0 !== window.atob) {
    let agents = [
      "U3BlZWQgSW5zaWdodHM=",
      "Q2hyb21lLUxpZ2h0aG91c2U=",
      "UGluZ2RvbVBhZ2VTcGVlZA==",
    ];
    for (let index = 0; index < agents.length; index++)
      -1 < agent.indexOf(window.atob(agents[index])) && (isB = !0);
  }
  (window.CookieConsent = !1 === isB), window.CookieConsent && loadScriptsSeq();
})(); */
