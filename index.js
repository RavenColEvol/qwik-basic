if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((serviceWorker) => {
      const prefetchClickElements = Array.from(document.querySelectorAll('[on\\:click]'));
      const onClickFiles = prefetchClickElements.map(el => el.getAttribute('on:click'));

      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH_SNIPPETS',
        snippets: onClickFiles
      })
      console.log("service worker registration successful");
    })
    .catch(() => {
      console.error("service worker registration failed");
    });
} else {
  console.log("service worker unavailable");
}


document.onclick = async function(event) {
  const clickPath = event.composedPath().slice(0, -4);
  for(const el of clickPath) {
    if(!el.getAttribute('on:click')) continue;
    const [fileName, funcName] = el.getAttribute('on:click').split('#');
    const res = await import(`./${fileName}`);
    res[funcName]();
  }
}