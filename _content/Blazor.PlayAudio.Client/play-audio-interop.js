// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
    return prompt(message, 'Type anything here');
}

export function playSound(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).loop = false;
        document.getElementById(id).play();
    }
    
       
    console.info(id);
}

export function stopSound(id) {
    document.getElementById(id).pause();
    document.getElementById(id).currentTime = 0;
}
