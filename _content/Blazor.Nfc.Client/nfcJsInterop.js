// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

export async function scanTag(dotNetHelper) {
        try {
            const reader = new NDEFReader();
            await reader.scan();

            reader.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    if (record.recordType === "text") {
                        const text = decoder.decode(record.data);
                        // Invia il testo letto al metodo C#
                        dotNetHelper.invokeMethodAsync('OnTagRead', text);
                    }
                }
            };
        } catch (error) {
            console.error("Errore NFC:", error);
            dotNetHelper.invokeMethodAsync('OnTagError', error.toString());
        }
    }

export async function  writeTag(dotNetHelper, messageToWrite) {
    try {
        const reader = new NDEFReader();
        // La scrittura richiede che il sensore sia "pronto"
        await reader.write(messageToWrite);

        dotNetHelper.invokeMethodAsync('OnWriteSuccess');
    } catch (error) {
        console.error("Errore scrittura NFC:", error);
        dotNetHelper.invokeMethodAsync('OnTagError', error.toString());
    }
}

export function isSupported  () {
    return ('NDEFReader' in window);
}
