"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function autocompleteGemini(words: string) {
    try {
        const genAI = new GoogleGenerativeAI(
            process.env.GOOGLE_AI_KEY as string,
        );
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `You are an autocomplete bot. I will give a phrase or a random of words and you will try to complete it based on the context. 
    Here are the rules: 
    
    1. You will only output the next words if the set of words can be autocompleted.
    2. If the set of words can be autocompleted, reply through outputting the next words and if don't, reply with a word "false".
    3. You will not process any words that are indecent, offensive, or malicious.
    4. The next words should be based on the context of the set of words and should be relevant. 
    6. If the next words can is a continuation of the set of words, add a space in the beginning of the next words and do not capitalize the first letter of the next words.
    Here are the words: ${words}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        if (text.includes("false") || text.includes("False")) return false;
        return text;
    } catch (err) {
        return false;
    }
}
