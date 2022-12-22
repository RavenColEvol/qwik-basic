self.addEventListener('message', async function (event) {
  if(event.data.type !== 'PREFETCH_SNIPPETS') return;
  const { snippets } = event.data;
  const cache = await caches.open('test-cache')
  snippets.forEach(snippet => {
    const [fileName, funcName] = snippet.split('#');
    this.fetch(fileName)
      .then(res => {
        cache.put(`./${fileName}`, res)
      })
      .catch(err => {
        console.log(err)
      })
  })
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(res) {
          if (res) {
              console.log('Resource found in Cache Storage')
              return res;
          }
          return fetch(event.request).then(function(res) {
              return res;
          }).catch(function(err) {
              console.log(err);
          });
      }));
});