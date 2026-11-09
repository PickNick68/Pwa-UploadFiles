window.audioRecorder = {

    mediaRecorder: null,
    stream: null,
    chunks: [],
    startTime: null,
    dotnetRef: null,

    async start(dotnetRef) {

        this.dotnetRef = dotnetRef;

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            throw new Error(
                "Microfono non supportato");
        }

        this.stream =
            await navigator.mediaDevices
                .getUserMedia({
                    audio: true
                });

        const mimeType =
            this.getBestMimeType();

        const options =
            mimeType
                ? { mimeType: mimeType }
                : undefined;

        this.mediaRecorder =
            new MediaRecorder(
                this.stream,
                options);

        this.chunks = [];

        this.mediaRecorder.ondataavailable =
            e => {

                if (e.data.size > 0)
                    this.chunks.push(e.data);
            };

        this.mediaRecorder.onerror =
            async e => {

                await this.dotnetRef
                    .invokeMethodAsync(
                        "RecordingError",
                        e.error?.message ??
                        "Errore registrazione");
            };

        this.mediaRecorder.onstop =
            async () =>
                await this.processRecording();

        this.startTime = new Date();

        this.mediaRecorder.start();
    },

    async processRecording() {

        try {

            const durationSeconds =
                Math.floor(
                    (Date.now() -
                        this.startTime.getTime())
                    / 1000);

            const blob =
                new Blob(
                    this.chunks,
                    {
                        type:
                            this.mediaRecorder.mimeType
                    });

            const extension =
                this.getExtension(
                    blob.type);

            const id =
                crypto.randomUUID();

            const fileName =
                `REC_${Date.now()}${extension}`;

            await window.audioStorage
                .saveRecording({
                    id: id,
                    name: fileName,
                    createdAt: new Date().toISOString(),
                    durationSeconds: durationSeconds,
                    size: blob.size,
                    contentType: blob.type,
                    uploaded: false,
                    blob: blob
                });

            await this.dotnetRef
                .invokeMethodAsync(
                    "RecordingSaved",
                    id);
        }
        finally {

            this.stream
                ?.getTracks()
                .forEach(t => t.stop());

            this.stream = null;
            this.chunks = [];
        }
    },

    getExtension(contentType) {

        if (contentType.includes("mp4"))
            return ".m4a";

        if (contentType.includes("mpeg"))
            return ".mp3";

        if (contentType.includes("ogg"))
            return ".ogg";

        return ".webm";
    },

    pause() {

        if (this.mediaRecorder &&
            this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
        }
    },

    resume() {

        if (this.mediaRecorder &&
            this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
        }
    },

    stop() {

        if (this.mediaRecorder &&
            this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
    },

    getBestMimeType()
    {

        const candidates = [
            'audio/mp4',
            'audio/mpeg',
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus'
        ];

        for (const mime of candidates) {

            if (window.MediaRecorder &&
                MediaRecorder.isTypeSupported(mime)) {

                return mime;
            }
        }

        return '';
    }
};