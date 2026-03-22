const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { messages } = JSON.parse(event.body);

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid messages array' })
            };
        }

        // Get API Key from Netlify Environment Variables
        const apiKey = process.env.SARVAM_API_KEY;

        if (!apiKey) {
            console.error("SARVAM_API_KEY environment variable is missing.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server Configuration Error' })
            };
        }

        // Call the Sarvam API
        const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'sarvam-m',
                messages: messages,
                temperature: 0.6,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Sarvam API returned error: ${JSON.stringify(data)}`);
        }

        if (data.choices && data.choices.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ response: data.choices[0].message.content })
            };
        } else {
            throw new Error('Unexpected format from Sarvam API');
        }

    } catch (error) {
        console.error('API Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
};
