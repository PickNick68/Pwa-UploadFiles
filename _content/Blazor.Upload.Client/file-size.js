// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

export async function getImageDimensions(content) {
    const url = URL.createObjectURL(new Blob([await content.arrayBuffer()]))
    const dimensions = await new Promise(resolve => {
        const img = new Image();
        img.onload = function () {
            const data = { Width: img.naturalWidth, Height: img.naturalHeight };
            resolve(data);
        };
        img.src = url;
    });
    return JSON.stringify(dimensions);
}
