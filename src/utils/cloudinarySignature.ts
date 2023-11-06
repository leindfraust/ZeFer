import crypto from "crypto"

const generateSHA1 = (data: any) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
}

const generateSignature = (id: string, apiSecret: string, folder: string, timestamp: number) => {
    return `folder=${folder}&format=jpg&public_id=${id}&timestamp=${timestamp}${apiSecret}`;
};

export default function cloudinarySignature(id: string, apiSecret: string, folder: string, timestamp: number) {
    return generateSHA1(generateSignature(id, apiSecret, folder, timestamp))
}