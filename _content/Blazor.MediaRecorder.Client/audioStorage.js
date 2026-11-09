window.audioStorage = {

    dbName: "AudioRecorderDb",
    storeName: "recordings",

    openDb() {

        return new Promise((resolve, reject) => {

            const request =
                indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = e => {

                const db = e.target.result;

                if (!db.objectStoreNames.contains(this.storeName)) {

                    db.createObjectStore(
                        this.storeName,
                        {
                            keyPath: "id"
                        });
                }
            };

            request.onsuccess =
                () => resolve(request.result);

            request.onerror =
                () => reject(request.error);
        });
    },

    async saveRecording(recording) {

        const db =
            await this.openDb();

        return new Promise((resolve, reject) => {

            const tx =
                db.transaction(
                    this.storeName,
                    "readwrite");

            tx.objectStore(this.storeName)
                .put(recording);

            tx.oncomplete =
                () => resolve();

            tx.onerror =
                () => reject(tx.error);
        });
    },

    async getRecording(id) {

        const db =
            await this.openDb();

        return new Promise((resolve, reject) => {

            const tx =
                db.transaction(
                    this.storeName,
                    "readonly");

            const request =
                tx.objectStore(
                    this.storeName)
                    .get(id);

            request.onsuccess =
                () => resolve(request.result);

            request.onerror =
                () => reject(request.error);
        });
    },

    async getAllRecordings() {

        const db =
            await this.openDb();

        return new Promise((resolve, reject) => {

            const tx =
                db.transaction(
                    this.storeName,
                    "readonly");

            const request =
                tx.objectStore(
                    this.storeName)
                    .getAll();

            request.onsuccess =
                () => resolve(request.result);

            request.onerror =
                () => reject(request.error);
        });
    },

    async deleteRecording(id) {

        const db =
            await this.openDb();

        const tx =
            db.transaction(
                this.storeName,
                "readwrite");

        tx.objectStore(
            this.storeName)
            .delete(id);
    },

    async markUploaded(id) {

        const record =
            await this.getRecording(id);

        if (!record)
            return;

        record.uploaded = true;

        await this.saveRecording(record);
    },

    async createAudioUrl(id) {

        const record =
            await this.getRecording(id);

        if (!record)
            return null;

        return URL.createObjectURL(
            record.blob);
    }
};