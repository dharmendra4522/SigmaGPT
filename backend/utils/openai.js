// import "dotenv/config";
// import fetch from 'node-fetch'; // node-fetch install hona chahiye

// const getOpenAPIResponse = async (chatHistory) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             // --- YEH SABSE ZAROORI CHANGE HAI ---
//             // Hum poori chat history (jo ek array hai) seedhe yahan bhej rahe hain
//             messages: chatHistory,
//         }),
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
        
//         if (data.error) {
//             console.error("OpenAI API Error:", data.error.message);
//             throw new Error(data.error.message);
//         }

//         if (!data.choices || data.choices.length === 0) {
//             throw new Error("Invalid response from OpenAI API: No choices found.");
//         }
//         return data.choices[0].message.content;
//     } catch (error) {
//         console.error("Error calling OpenAI API:", error);
//         throw error; // Re-throw the error to be handled by the calling function
//     }
// }

// export default getOpenAPIResponse;




// backend/utils/openai.js

import "dotenv/config";
import fetch from 'node-fetch';

const getOpenAPIResponseStream = async (chatHistory) => {
    // Note: We are not awaiting the full JSON response here
    return fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: chatHistory,
            stream: true, // <-- This is the most important change
        }),
    });
};

export default getOpenAPIResponseStream;