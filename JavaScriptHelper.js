var JavaScriptHelper = {};

JavaScriptHelper.BlazorFocusElement = function (element)
{
        if (element instanceof HTMLElement) {
            element.focus();
        }
}

JavaScriptHelper.BlazorFocusElementId = function (id) {

    var element = document.getElementById(id);
    if (element != null) {
        element.focus();
        element.select();
        return;
    }
  
}

JavaScriptHelper.LazyBlazorFocusElementId = function (id) {
   
    setTimeout(JavaScriptHelper.BlazorFocusElementId, 350, id)
}

JavaScriptHelper.Back = function () {
    window.history.back();
}

JavaScriptHelper.ShowAlert = function (message)
{
    alert(message);
}

JavaScriptHelper.Reload = async function () {
    try {
        await fetch('/');
        location.reload();
    }
    catch { }
}

JavaScriptHelper.ScrollToId = function (id) {
    const element = document.getElementById(id);
    if (element instanceof HTMLElement) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }
}

JavaScriptHelper.ScrollTo = function (top, left) {

    window.scrollTo({
        top: top,
        left: left,
        behavior: 'smooth'
    });
        
}


JavaScriptHelper.LazyScrollTo = function (top, left) {

    setTimeout(JavaScriptHelper.ScrollTo, 500, top, left)

}

JavaScriptHelper.ScrollToTop = function () {

    document.documentElement.scrollTop = 0;
}

JavaScriptHelper.LazyScrollToBottom = function (elementName) {

    setTimeout(JavaScriptHelper.ScrollToBottom, 100, elementName)

}

JavaScriptHelper.ScrollToBottom = function (elementName) {
    element = document.getElementById(elementName);
    element.scrollTo({ top: element.scrollHeight,left:0, behavior: 'smooth' });
   
}

JavaScriptHelper.GetCookie = function () {
    return Promise.resolve(document.cookie);
};

JavaScriptHelper.CheckConnection = function (interop)
{

    
    function handler() {
       
        interop.invokeMethodAsync("Network.StatusChanged", navigator.onLine);
    }
   
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);

    if (!navigator.onLine)
        handler(navigator.onLine);
    

   
}

JavaScriptHelper.RegisterScrollInfoService = function (interop) 
{
    function scrollHandler() {

        interop.invokeMethodAsync("OnScroll", window.height);
        
    }

    window.addEventListener('scroll', scrollHandler);

}

JavaScriptHelper.GetDimensions = function () {
        return {
            width: window.innerWidth,
            height: window.innerHeight
               }
}

JavaScriptHelper.IsMobile = function () {
    return window.matchMedia("only screen and (max-width: 760px)").matches;
}

JavaScriptHelper.OpenInNewTab = function (pdfUrl) {
  
    try {
        window.open(pdfUrl, '_blank');
    } catch (error) {
        console.error('Errore durante l\'apertura del PDF in una nuova scheda:', error);
    }
   
}

JavaScriptHelper.DownloadFile = function (name) {
   
    var link = document.createElement('a');
    link.href = 'api/Files/GetFile/' + window.encodeURIComponent(name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


JavaScriptHelper.Update = () => {
    location.reload();
}

JavaScriptHelper.GetUserAgent = () => {
    return navigator.userAgent;
}
JavaScriptHelper.PlayAudio = (elementName) => {
    document.getElementById(elementName).play();
}

JavaScriptHelper.DownloadPdf = function (fileName, byteBase64) {

    var link = document.createElement('a');
    link.download = fileName;
    link.href = "data:application/octet-stream;base64," + byteBase64;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

JavaScriptHelper.ViewPdfInIframe = function (iframeid, byteBase64) {

    document.getElementById(iframeid).innerHTML = "";
    var ifr = document.createElement('iframe');
    ifr.setAttribute("src", "data:application/pdf;base64," + byteBase64);
    ifr.style.width = "100%";
    ifr.style.height = "688px";
    document.getElementById(iframeid).appendChild(ifr);
}

JavaScriptHelper.WiewFileInIframe= async function (iframeId, fileName, contentType, stream){
    const iframe = document.getElementById(iframeId);
    if (!iframe) {
        console.error(`Iframe con ID '${iframeId}' non trovato.`);
        return;
    }

    // Se l'iframe ha già un URL temporaneo, lo rilasciamo prima di crearne uno nuovo.
    if (iframe.src && iframe.src.startsWith('blob:')) {
        URL.revokeObjectURL(iframe.src);
    }

    // Legge lo stream come array di byte
    const arrayBuffer = await stream.arrayBuffer();

    // Crea un Blob (Binary Large Object) con il contenuto e il tipo MIME corretto
    const blob = new Blob([arrayBuffer], { type: contentType });

    // Crea un URL temporaneo per il Blob
    const url = URL.createObjectURL(blob);

    // Imposta l'URL del Blob come sorgente dell'iframe
    iframe.src = url;
}


JavaScriptHelper.OpenFileNewTab = async function (fileName, contentType, stream) {
    const arrayBuffer = await stream.arrayBuffer();

    // Crea un Blob (Binary Large Object) con il contenuto e il tipo MIME corretto
    const blob = new Blob([arrayBuffer], { type: contentType });

    // Crea un URL temporaneo per il Blob
    const url = URL.createObjectURL(blob);

    // Apre l'URL in una nuova scheda. Se il tipo MIME è supportato (es. PDF, PNG), il browser visualizzerà il file.
    window.open(url, '_blank');

    // Pulizia: rilascia la memoria associata al Blob URL dopo un breve periodo.
    setTimeout(() => URL.revokeObjectURL(url), 10000);

}


JavaScriptHelper.OpenPdfNewTab = function (fileName, byteBase64) {

    function base64ToArrayBuffer(base64) {
        sliceSize = 64;
        var binary_string = window.atob(base64);
        var byteArrays = [];
        for (var offset = 0; offset < binary_string.length; offset += sliceSize) {
            var slice = binary_string.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }   

        var blob = new Blob(byteArrays, { type: 'application/pdf' });
      
        return blob;
    }

    var blob = base64ToArrayBuffer(byteBase64);
    var url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

JavaScriptHelper.readTextFromClipboard= async function() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        return null;
    }
}

//JavaScriptHelper.writeTextToClipboard = async function (text) {
//    try {
//        await navigator.clipboard.writeText(text);
//    } catch (err) {
//        return null;
//    }
//}

JavaScriptHelper.writeTextToClipboard = (text) => {
    if (!document.hasFocus()) {
        window.focus();
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand("copy");
        return true;
    } catch {
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
};


JavaScriptHelper.BlazorDownloadImageFast = function (imgId, contentType, content) {
    // Convert the parameters to actual JS types
    const nameStr = 'file.bin';
    const contentTypeStr = BINDING.conv_string(contentType);
    const contentArray = Blazor.platform.toUint8Array(content);

    const file = new File([contentArray], nameStr, { type: contentTypeStr });
    const exportUrl = URL.createObjectURL(file);
    document.getElementById(BINDING.conv_string(imgId)).src = exportUrl;

    //URL.revokeObjectURL(exportUrl);
}

JavaScriptHelper.BlazorDownloadFileFast = function (fileName, contentType, content) {
    // Convert the parameters to actual JS types
    const nameStr = BINDING.conv_string(fileName)
    const contentTypeStr = BINDING.conv_string(contentType);
    const contentArray = Blazor.platform.toUint8Array(content);

    const file = new File([contentArray], nameStr, { type: contentTypeStr });
    const exportUrl = URL.createObjectURL(file);
 
    // Create the <a> element and click on it
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = exportUrl;
    a.download = fileName;
    a.target = "_self";
    a.click();

    URL.revokeObjectURL(exportUrl);
}

