import { saveRecording } from "./audioStorage.js";

let mediaRecorder = null;
let stream = null;
let chunks = [];
let startTime = null;
let dotnetRef = null;

export async function start(dotNetReference) {

    dotnetRef = dotNetReference;

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        throw new Error("Microfono non supportato");
    }

    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    const mimeType = getBestMimeType();

    const options = mimeType
        ? { mimeType }
        : undefined;

    mediaRecorder = new MediaRecorder(
        stream,
        options);

    chunks = [];

    mediaRecorder.ondataavailable = e => {

        if (e.data.size > 0) {
            chunks.push(e.data);
        }
    };

    mediaRecorder.onerror = async e => {

        await dotnetRef.invokeMethodAsync(
            "RecordingError",
            e.error?.message ?? "Errore registrazione");
    };

    mediaRecorder.onstop = async () =>
        await processRecording();

    startTime = new Date();

    mediaRecorder.start();
}

export async function processRecording() {

    try {

        const durationSeconds =
            Math.floor(
                (Date.now() - startTime.getTime()) / 1000);

        const blob = new Blob(
            chunks,
            {
                type: mediaRecorder.mimeType
            });

        const extension =
            getExtension(blob.type);

        const id =
            crypto.randomUUID();

        const fileName =
            `REC_${Date.now()}${extension}`;

        await saveRecording({
            id,
            name: fileName,
            createdAt: new Date().toISOString(),
            durationSeconds,
            size: blob.size,
            contentType: blob.type,
            uploaded: false,
            blob
        });

        await dotnetRef.invokeMethodAsync(
            "RecordingSaved",
            id);
    }
    finally {

        stream
            ?.getTracks()
            .forEach(t => t.stop());

        stream = null;
        chunks = [];
    }
}

export function getExtension(contentType) {

    if (contentType.includes("mp4")) {
        return ".m4a";
    }

    if (contentType.includes("mpeg")) {
        return ".mp3";
    }

    if (contentType.includes("ogg")) {
        return ".ogg";
    }

    return ".webm";
}

export function pause() {

    if (mediaRecorder &&
        mediaRecorder.state === "recording") {

        mediaRecorder.pause();
    }
}

export function resume() {

    if (mediaRecorder &&
        mediaRecorder.state === "paused") {

        mediaRecorder.resume();
    }
}

export function stop() {

    if (mediaRecorder &&
        mediaRecorder.state !== "inactive") {

        mediaRecorder.stop();
    }
}

export function getBestMimeType() {

    const candidates = [
        "audio/mp4",
        "audio/mpeg",
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus"
    ];

    for (const mime of candidates) {

        if (window.MediaRecorder &&
            MediaRecorder.isTypeSupported(mime)) {

            return mime;
        }
    }

    return "";
}