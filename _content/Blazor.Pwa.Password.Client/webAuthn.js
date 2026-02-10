window.webAuthnFunctions = {
    isSupported: async () => {
        return window.PublicKeyCredential &&
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
            await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    },
    // Registra un nuovo dato biometrico
    register: async (username, challengeStr) => {
        const challenge = Uint8Array.from(atob(challengeStr), c => c.charCodeAt(0));
        const createOptions = {
            publicKey: {
                challenge: challenge,
                rp: { name: "Mia App Sicura", id: window.location.hostname },
                user: {
                    id: Uint8Array.from("USER_ID_123", c => c.charCodeAt(0)),
                    name: username,
                    displayName: username
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256
                authenticatorSelection: { authenticatorAttachment: "platform" }, // Forza biometria locale
                timeout: 60000
            }
        };

        const credential = await navigator.credentials.create(createOptions);
        return {
            id: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            type: credential.type
        };
    },

    // Verifica la biometria
    authenticate: async (challengeStr, credentialIdStr) => {
        const challenge = Uint8Array.from(atob(challengeStr), c => c.charCodeAt(0));
        const credentialId = Uint8Array.from(atob(credentialIdStr), c => c.charCodeAt(0));

        const getOptions = {
            publicKey: {
                challenge: challenge,
                allowCredentials: [{ id: credentialId, type: 'public-key' }],
                timeout: 60000
            }
        };

        const assertion = await navigator.credentials.get(getOptions);
        return assertion != null;
    },

    isAppleDevice: async () => {
        // 1. Tenta con le moderne Client Hints (se disponibili, es. Chrome su iOS)
        if (navigator.userAgentData) {
            const brands = navigator.userAgentData.brands.map(b => b.brand.toLowerCase());
            if (brands.includes('ios') || brands.includes('iphone')) return true;
        }

        // 2. Fallback per Safari (che non supporta userAgentData)
        // Controlliamo il numero di tocchi massimi (iPad/iPhone ne hanno almeno 5) 
        // e la presenza di "Mac" nell'User Agent (per iPadOS che si finge Mac)
        const isMacLike = /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
        const hasTouch = navigator.maxTouchPoints > 1;

        // Se è un Mac con touch, è quasi certamente un iPad.
        // Se l'User Agent contiene iPhone/iPod/iPad, è un dispositivo iOS.
        return isMacLike && hasTouch;

    }
    
};

