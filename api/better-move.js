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
- If the user mentions a possible future increase in income, acknowledge it when it is relevant to the decision.
- Treat future income as potential income, not guaranteed income.
- If future income could make the decision more affordable, explain that it could change the decision and consider whether waiting until that income actually arrives would be smarter.
- Do not judge the decision solely from the user's current financial situation when relevant future circumstances are provided.
- Do not invent facts or assume a future income increase will definitely happen.
- Consider the user's current situation as well as any future circumstances they mention, such as an expected change in income.
- Do not assume future circumstances are guaranteed, but acknowledge them when they could reasonably change the decision.
- Do not judge the decision solely based on the user's current financial situation when the user has provided relevant future context.
- Give one clear action the user should take next.
- Do not claim certainty about the user's financial future.
- Keep the response between 2 and 4 sentences.
- Sound like a smart friend, not a financial textbook.
- Do not write "Better Move:" at the beginning.
- Return only the recommendation itself.
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

        const betterMove =
            data.output_text ||
            data.output
                ?.filter(item => item.type === "message")
                ?.flatMap(item => item.content || [])
                ?.filter(content => content.type === "output_text")
                ?.map(content => content.text)
                ?.join("\n") ||
            "I couldn't generate a recommendation right now.";

        return res.status(200).json({
            betterMove
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: "Something went wrong."
        });
    }
}