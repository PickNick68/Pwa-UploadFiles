const dbName = "AudioRecorderDb";
const storeName = "recordings";

export function openDb() {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = e => {
            const db = e.target.result;

            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {
                    keyPath: "id"
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveRecording(recording) {
    const db = await openDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");

        tx.objectStore(storeName).put(recording);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getRecording(id) {
    const db = await openDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");

        const request = tx.objectStore(storeName).get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllRecordings() {
    const db = await openDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");

        const request = tx.objectStore(storeName).getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteRecording(id) {
    const db = await openDb();

    const tx = db.transaction(storeName, "readwrite");

    tx.objectStore(storeName).delete(id);
}

export async function markUploaded(id) {
    const record = await getRecording(id);

    if (!record) {
        return;
    }

    record.uploaded = true;

    await saveRecording(record);
}

export async function createAudioUrl(id) {
    const record = await getRecording(id);

    if (!record) {
        return null;
    }

    return URL.createObjectURL(record.blob);
}