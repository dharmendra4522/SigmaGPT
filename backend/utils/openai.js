import "dotenv/config";


const getOpenAPIResponse = async (messages) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: messages
            }],
        }),
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        // console.log(data.choices[0].message.content); //reply
        if (!data.choices || data.choices.length === 0) {
            throw new Error("Invalid response from OpenAI API: No choices found.");
        }
        return data.choices[0].message.content; //reply
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}


export default getOpenAPIResponse;