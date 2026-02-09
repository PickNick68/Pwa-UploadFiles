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
    }
};
