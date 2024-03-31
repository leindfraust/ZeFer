type Options = {
    startingLength: number;
    lastLength: number;
};

export default function maskString(text: string, options?: Options) {
    const startingLength = options?.startingLength ?? 2;
    const lastLength = options?.lastLength ?? 2;
    const mask = "*".repeat(text.length - (startingLength + lastLength));
    return (
        text.substring(0, startingLength) +
        mask +
        text.substring(text.length - lastLength)
    );
}
