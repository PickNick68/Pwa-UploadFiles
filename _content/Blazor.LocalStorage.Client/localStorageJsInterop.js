// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

export function getLocalStorageItem(key)
{
    const items = [];
    const value = localStorage.getItem(key);
    const itemSize = (key.length + value.length) * 2;
    const sizeInMb = (itemSize / (1024 * 1024));
    items.push({
        key: key,
        description: sizeInMb.toFixed(2) + ' MB',
        value: sizeInMb
    });

    return items;
}

export function getAllLocalStorageItems() {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const itemSize = (key.length + value.length) * 2;
        const sizeInMb = (itemSize / (1024 * 1024));
        items.push({
            key: key,
            description: sizeInMb.toFixed(2) + ' MB',
            value: sizeInMb
        });
    }
    return items;
}