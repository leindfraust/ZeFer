"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function autocompleteGemini(words: string) {
    try {
        const genAI = new GoogleGenerativeAI(
            process.env.GOOGLE_AI_KEY as string,
        );
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
        });
        const prompt = `Complete the following phrase based on its context. Only output the next words if the phrase can be autocompleted. If not, reply with "false". 

    Rules:
    
    1. Do not output indecent, offensive, or malicious content.
    2.  The next words should be relevant and contextually appropriate.
    3. If a space is needed before the next words, include it, if not leave it be.

    Phrase: ${words}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        if (text.includes("false") || text.includes("False")) return false;
        return text;
    } catch (err) {
        return false;
    }
}
