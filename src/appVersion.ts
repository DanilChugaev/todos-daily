export let appVersion = '';

fetch(new URL('../package.json', import.meta.url))
  .then((res) => res.json())
  .then((pkg) => {
    appVersion = pkg.version;
  })
  .catch(() => {
    // ignore
  });
