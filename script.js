document.addEventListener("DOMContentLoaded", () => {
    console.log("Should I Do It? JavaScript loaded.");

    const wantLevel = document.getElementById("wantLevel");
    const wantValue = document.getElementById("wantValue");

    const analyzeButton = document.getElementById("analyzeButton");
    const resetButton = document.getElementById("resetButton");

    const result = document.getElementById("result");
    const resultIcon = document.getElementById("resultIcon");
    const resultTitle = document.getElementById("resultTitle");
    const resultText = document.getElementById("resultText");

    const scoreNumber = document.getElementById("scoreNumber");
    const scoreFill = document.getElementById("scoreFill");
    const riskText = document.getElementById("riskText");

    const recommendationText =
        document.getElementById("recommendationText");

    const betterMoveText =
        document.getElementById("betterMoveText");

    const statPrice =
        document.getElementById("statPrice");

    const statIncome =
        document.getElementById("statIncome");

    const statSavings =
        document.getElementById("statSavings");

    const statDebt =
        document.getElementById("statDebt");

    const categories =
        document.querySelectorAll(".category");

    // Make sure the important elements actually exist.
    if (!wantLevel || !wantValue || !analyzeButton || !resetButton) {
        console.error("Required page elements are missing.");
        return;
    }

    let selectedCategory = "purchase";

    // -----------------------------
    // CATEGORY BUTTONS
    // -----------------------------

    categories.forEach((category) => {
        category.addEventListener("click", () => {
            categories.forEach((item) => {
                item.classList.remove("active");
            });

            category.classList.add("active");
            selectedCategory = category.dataset.category;
        });
    });

    // -----------------------------
    // SLIDER
    // -----------------------------

    function updateSlider() {
        const value = Number(wantLevel.value);
        const min = Number(wantLevel.min);
        const max = Number(wantLevel.max);

        const percentage =
            ((value - min) / (max - min)) * 100;

        wantValue.textContent = `${value}/10`;

        wantLevel.style.background = `
            linear-gradient(
                to right,
                #ff4d4d 0%,
                #ff4d4d ${percentage}%,
                #dededb ${percentage}%,
                #dededb 100%
            )
        `;
    }

    wantLevel.addEventListener("input", updateSlider);
    updateSlider();

    // -----------------------------
    // ANALYZE
    // -----------------------------

    analyzeButton.addEventListener("click", () => {
        console.log("Analyze button clicked.");

        const decision =
            document.getElementById("decision")?.value.trim();

        const price =
            Number(document.getElementById("price")?.value);

        const income =
            Number(document.getElementById("income")?.value);

        const savings =
            Number(document.getElementById("savings")?.value) || 0;

        const debt =
            Number(document.getElementById("debt")?.value) || 0;

        const want =
            Number(wantLevel.value);

        if (!decision) {
            alert("Tell us what you're thinking about.");
            return;
        }

        if (!price || price <= 0) {
            alert("Enter a valid price.");
            return;
        }

        if (!income || income <= 0) {
            alert("Enter your monthly income.");
            return;
        }

        let score = 50;
        const reasons = [];

        const incomeRatio = price / income;

        const savingsRatio =
            savings > 0
                ? price / savings
                : Infinity;

        // PRICE VS INCOME
        if (incomeRatio >= 0.75) {
            score -= 30;
            reasons.push(
                "This purchase is very large compared with your monthly income."
            );
        } else if (incomeRatio >= 0.50) {
            score -= 20;
            reasons.push(
                "This purchase would take a large chunk of your monthly income."
            );
        } else if (incomeRatio >= 0.25) {
            score -= 9;
            reasons.push(
                "This purchase represents a noticeable portion of your income."
            );
        } else {
            score += 8;
        }

        // SAVINGS
        if (savings === 0) {
            score -= 8;
            reasons.push(
                "You haven't listed any savings for this purchase."
            );
        } else if (savingsRatio >= 1) {
            score -= 24;
            reasons.push(
                "This purchase would cost more than your current savings."
            );
        } else if (savingsRatio >= 0.75) {
            score -= 17;
            reasons.push(
                "It would use most of your savings."
            );
        } else if (savingsRatio >= 0.50) {
            score -= 8;
            reasons.push(
                "It would use a meaningful portion of your savings."
            );
        } else if (savingsRatio <= 0.20) {
            score += 7;
        }

        // DEBT
        if (debt >= income * 2) {
            score -= 28;
            reasons.push(
                "Your debt is very high relative to your monthly income."
            );
        } else if (debt >= income) {
            score -= 17;
            reasons.push(
                "Your existing debt makes this purchase considerably riskier."
            );
        } else if (debt > 0) {
            score -= 6;
            reasons.push(
                "You already have outstanding debt."
            );
        }

        // WANT LEVEL
        if (want >= 9) {
            score += 8;
        } else if (want >= 7) {
            score += 5;
        } else if (want <= 3) {
            score -= 7;
            reasons.push(
                "You're not particularly excited about this purchase."
            );
        }

        // CATEGORY
        if (selectedCategory === "travel" && want <= 4) {
            score -= 3;
            reasons.push(
                "A low-priority trip is easier to postpone than a necessity."
            );
        }

        score = Math.round(
            Math.max(0, Math.min(100, score))
        );

        let title;
        let description;
        let betterMove;
        let icon;
        let risk;
        let iconBackground;
        let iconColor;
        let scoreColor;

        if (score >= 75) {
            icon = "✓";
            title = "Probably Do It";
            risk = "Low risk";

            description =
                `"${decision}" looks reasonably comfortable based on the information you gave us.`;

            betterMove =
                "You can probably afford this. Just make sure the purchase doesn't interfere with your essential bills, savings goals, or other priorities.";

            iconBackground = "#dff7e5";
            iconColor = "#16803c";
            scoreColor = "#2f9e44";

        } else if (score >= 55) {
            icon = "?";
            title = "Think About It";
            risk = "Moderate risk";

            description =
                `"${decision}" isn't necessarily a bad move, but there are a few reasons to slow down before deciding.`;

            betterMove =
                "Give yourself a little time before buying. Compare alternatives, think about what else that money could do for you, and see if you still want it after the excitement fades.";

            iconBackground = "#fff3cd";
            iconColor = "#a46b00";
            scoreColor = "#d99900";

        } else {
            icon = "✕";
            title = "Probably Don't";
            risk = "High risk";

            description =
                `"${decision}" looks like a risky move based on your current financial situation.`;

            betterMove =
                "I'd hold off for now and put the money toward savings or debt instead. You can always come back to this purchase later when your situation is stronger.";

            iconBackground = "#ffe1e1";
            iconColor = "#c62828";
            scoreColor = "#ff4d4d";
        }

        resultIcon.textContent = icon;
        resultIcon.style.background = iconBackground;
        resultIcon.style.color = iconColor;

        resultTitle.textContent = title;
        resultText.textContent = description;

        scoreNumber.textContent = `${score}/100`;
        riskText.textContent = `Risk level: ${risk}`;

        scoreFill.style.width = `${score}%`;
        scoreFill.style.background = scoreColor;

        recommendationText.textContent =
            reasons.length > 0
                ? reasons.slice(0, 3).join(" ")
                : "Your numbers look fairly comfortable.";

        betterMoveText.textContent = "Thinking...";

        generateAIBetterMove({
            decision,
            price,
            income,
            savings,
            debt,
            want,
            score,
            verdict: title
        });

        statPrice.textContent = money(price);
        statIncome.textContent = money(income);
        statDebt.textContent = money(debt);

        statSavings.textContent =
            savings > 0
                ? `${Math.round((price / savings) * 100)}%`
                : "—";

        result.classList.remove("hidden");

        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // -----------------------------
    // RESET
    // -----------------------------

    resetButton.addEventListener("click", () => {
        document.getElementById("decision").value = "";
        document.getElementById("price").value = "";
        document.getElementById("income").value = "";
        document.getElementById("savings").value = "";
        document.getElementById("debt").value = "";

        wantLevel.value = 5;

        categories.forEach((item) => {
            item.classList.remove("active");
        });

        if (categories[0]) {
            categories[0].classList.add("active");
        }

        selectedCategory = "purchase";

        updateSlider();

        result.classList.add("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    function money(value) {
        return new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
            maximumFractionDigits: 0
        }).format(value);
    }

    async function generateAIBetterMove(data) {
        try {
            const response = await fetch("/api/better-move", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "AI request failed."
                );
            }

            betterMoveText.textContent =
                result.betterMove;

        } catch (error) {
            console.error("AI error:", error);

            betterMoveText.textContent =
                "We couldn't generate the personalized recommendation right now. The basic recommendation above is still available.";
        }
    }
});