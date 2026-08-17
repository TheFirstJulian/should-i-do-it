export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const {
            decision,
            price,
            income,
            savings,
            debt,
            want,
            score,
            verdict
        } = req.body;

        // Basic validation
        if (
            !decision ||
            typeof price !== "number" ||
            typeof income !== "number"
        ) {
            return res.status(400).json({
                error: "Missing or invalid information."
            });
        }

        const prompt = `
You are the decision assistant for a website called "Should I Do It?"

Give the user a short, honest and practical "Better Move" based on their information.

Decision:
${decision}

Price:
$${price} CAD

Monthly income:
$${income} CAD

Savings:
$${savings} CAD

Debt:
$${debt} CAD

How badly they want it:
${want}/10

Decision score:
${score}/100

Current verdict:
${verdict}

Instructions:
- Give practical advice.
- Be honest, but not judgmental.
- Do not automatically tell the user not to buy something.
- Consider income, savings, debt, price and desire.
- Give one clear action the user should take next.
- Do not invent facts.
- Do not claim certainty about the user's financial future.
- Keep the response between 2 and 4 sentences.
- Sound like a smart friend, not a financial textbook.
- Do not mention that you are an AI.
`;

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({
                    model: "gpt-5.6",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI error:", data);

            return res.status(500).json({
                error: "The AI service returned an error."
            });
        }

        return res.status(200).json({
            betterMove: data.output_text
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: "Something went wrong."
        });
    }
}