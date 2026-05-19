const axios = require('axios');

exports.analyzeComplaint = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, error: 'Please provide a title and description' });
        }

        const prompt = `
You are an AI assistant for a Complaint Management System.
Analyze the following complaint and provide a structured JSON response.

Complaint Title: ${title}
Complaint Description: ${description}

You MUST return STRICT JSON format (without markdown code blocks, just raw JSON) with the following fields:
{
  "priority": "High" | "Medium" | "Low",
  "department": "The responsible department (e.g., Water Department, Electricity Department, Sanitation Department, etc.)",
  "summary": "Short 1-2 sentence summary of the complaint",
  "response": "A professional and empathetic automated response message acknowledging the issue."
}
        `;

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        let aiText = response.data.choices[0].message.content;
        
        // Remove markdown formatting if the model still outputs it
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

        const aiResult = JSON.parse(aiText);

        res.status(200).json({
            success: true,
            data: aiResult
        });
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).json({ success: false, error: 'Failed to analyze complaint using AI' });
    }
};
