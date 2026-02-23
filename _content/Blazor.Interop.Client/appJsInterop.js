// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

export function showAlert(message) {
    alert(message);
}

export function backPage() {
    window.history.back();
}

export function getDimensions() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

export function blazorFocusElementId(id) {

    var element = document.getElementById(id);
    if (element != null) {
        element.focus();
        element.select();
        return;
    }

}

export function lazyBlazorFocusElementId(id) {

    setTimeout(blazorFocusElementId, 350, id)
}

export function scrollTo(top, left) {

    window.scrollTo({
        top: top,
        left: left,
        behavior: 'smooth'
    });

}

export function scrollToTop() {

    document.documentElement.scrollTop = 0;
}

export function lazyScrollToBottom(elementName) {

    setTimeout(scrollToBottom, 500, elementName)

}