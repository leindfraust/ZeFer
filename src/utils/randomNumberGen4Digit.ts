export default function generateRandom4DigitNumber() {
    // Generate a random decimal between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale the random decimal to the range of 1000 to 9999
    const random4DigitNumber = Math.floor(randomDecimal * 9000) + 1000;

    return random4DigitNumber;
}