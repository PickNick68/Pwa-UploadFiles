// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.


export function setupBarcodeListener(element, dotNetReference) {
    element.addEventListener('keyup', function (e) {
        // Controlla se il tasto premuto è 'Enter' (codice 13)
        if (e.keyCode === 13 || e.keyCode ===9) {
            e.preventDefault(); // Evita l'invio del form

            // Invocare il metodo C# quando l'Invio è rilevato
            // Passiamo il valore del campo di input
            dotNetReference.invokeMethodAsync('HandleEnterPressed', element.value);
        }
    });
}
