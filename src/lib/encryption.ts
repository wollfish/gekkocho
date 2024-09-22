const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

let cachedKey: CryptoKey | null = null;

// Function to decode a base64 string to a Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
};

// Function to get the AES key
const getKey = async (): Promise<CryptoKey> => {
    if (cachedKey) return cachedKey;

    const rawKey = base64ToUint8Array(process.env.AUTH_ENCRYPTION_KEY!); // Non-null assertion

    if (![16, 24, 32].includes(rawKey.length)) {
        throw new Error('Invalid key length. Key must be 16, 24, or 32 bytes.');
    }

    cachedKey = await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );

    return cachedKey;
};

// Function to encrypt a token
export const encryptToken = async (token: string): Promise<string> => {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedToken = textEncoder.encode(token);
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedToken
    );

    const encryptedData = new Uint8Array(iv.length + encrypted.byteLength);

    encryptedData.set(iv);
    encryptedData.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...encryptedData));
};

// Function to decrypt an encrypted token
export const decryptToken = async (encryptedToken: string): Promise<string> => {
    const encryptedData = Uint8Array.from(atob(encryptedToken), (c) => c.charCodeAt(0));
    const iv = encryptedData.slice(0, 12);
    const encrypted = encryptedData.slice(12);

    const key = await getKey();
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
    );

    return textDecoder.decode(decrypted);
};
