// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

export async function forceDeleteCache() {

    var cacheNamePrefix = 'offline-cache-';
    var cacheKeys = await caches.keys();
    await Promise.all(cacheKeys
        .filter(key => key.startsWith(cacheNamePrefix))
        .map(key => caches.delete(key)));
}

export async function forceReload() {
    await window.location.reload();
}