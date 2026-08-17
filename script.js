document.addEventListener("DOMContentLoaded", () => {

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


    // -------------------------
    // SLIDER
    // -------------------------

    function updateWantValue() {
        wantValue.textContent = `${wantLevel.value}/10`;
    }

    wantLevel.addEventListener("input", updateWantValue);

    updateWantValue();


    // -------------------------
    // ANALYZE
    // -------------------------

    analyzeButton.addEventListener("click", () => {

        const decision =
            document.getElementById("decision").value.trim();

        const price =
            Number(document.getElementById("price").value);

        const income =
            Number(document.getElementById("income").value);

        const savings =
            Number(document.getElementById("savings").value) || 0;

        const debt =
            Number(document.getElementById("debt").value) || 0;

        const want =
            Number(wantLevel.value);


        // Validation

        if (!decision) {
            alert("Tell us what you're thinking about.");
            return;
        }

        if (price <= 0) {
            alert("Enter a valid price.");
            return;
        }

        if (income <= 0) {
            alert("Enter your monthly income.");
            return;
        }


        // -------------------------
        // SCORE
        // -------------------------

        let score = 50;

        const reasons = [];

        const incomeRatio = price / income;
        const savingsRatio = savings > 0 ? price / savings : Infinity;


        // PRICE VS INCOME

        if (incomeRatio >= 0.75) {

            score -= 30;

            reasons.push(
                "The purchase is extremely large compared with your monthly income."
            );

        } else if (incomeRatio >= 0.50) {

            score -= 20;

            reasons.push(
                "The purchase represents a very large portion of your monthly income."
            );

        } else if (incomeRatio >= 0.25) {

            score -= 10;

            reasons.push(
                "The purchase represents a noticeable portion of your income."
            );

        } else {

            score += 8;
        }


        // SAVINGS

        if (savings <= 0) {

            score -= 15;

            reasons.push(
                "You don't currently have savings available for this purchase."
            );

        } else if (savingsRatio >= 1) {

            score -= 25;

            reasons.push(
                "The purchase costs more than your current savings."
            );

        } else if (savingsRatio >= 0.75) {

            score -= 20;

            reasons.push(
                "It would consume most of your savings."
            );

        } else if (savingsRatio >= 0.40) {

            score -= 10;

            reasons.push(
                "It would take a significant chunk of your savings."
            );

        } else {

            score += 10;
        }


        // DEBT

        if (debt >= income * 2) {

            score -= 30;

            reasons.push(
                "Your debt is very high compared with your monthly income."
            );

        } else if (debt >= income) {

            score -= 20;

            reasons.push(
                "Your existing debt makes this purchase considerably riskier."
            );

        } else if (debt > 0) {

            score -= 8;

            reasons.push(
                "You already have outstanding debt."
            );
        }


        // WANT LEVEL

        if (want >= 9) {

            score += 8;

        } else if (want >= 7) {

            score += 4;

        } else if (want <= 3) {

            score -= 8;

            reasons.push(
                "You don't seem very interested in it."
            );
        }


        score = Math.round(
            Math.max(0, Math.min(100, score))
        );


        // -------------------------
        // VERDICT
        // -------------------------

        let title;
        let text;
        let betterMove;
        let icon;
        let risk;


        if (score >= 75) {

            icon = "✓";
            title = "Go For It";
            risk = "Low risk";

            text =
                `"${decision}" looks reasonably affordable based on what you entered.`;

            betterMove =
                "If this is something you've wanted for a while, set a spending limit and go for it without touching money you need for essentials.";

            resultIcon.style.background = "#dff7e5";
            resultIcon.style.color = "#16803c";


        } else if (score >= 55) {

            icon = "?";
            title = "Think About It";
            risk = "Moderate risk";

            text =
                `"${decision}" isn't necessarily a bad move, but your situation suggests waiting or comparing alternatives first.`;

            betterMove =
                "Wait a little, shop around, or find a cheaper alternative. If you still want it later, reassess.";

            resultIcon.style.background = "#fff3cd";
            resultIcon.style.color = "#a46b00";


        } else {

            icon = "✕";
            title = "Probably Don't";
            risk = "High risk";

            text =
                `"${decision}" looks like a risky move given your current financial situation.`;

            betterMove =
                "Delay the purchase and redirect that money toward savings or debt. You can always buy it later.";

            resultIcon.style.background = "#ffe1e1";
            resultIcon.style.color = "#c62828";
        }


        // -------------------------
        // DISPLAY
        // -------------------------

        resultIcon.textContent = icon;

        resultTitle.textContent = title;

        resultText.textContent = text;

        scoreNumber.textContent = `${score}/100`;

        scoreFill.style.width = `${score}%`;

        riskText.textContent = `Risk level: ${risk}`;

        recommendationText.textContent =
            reasons.length > 0
                ? reasons.slice(0, 3).join(" ")
                : "Your numbers look fairly comfortable.";

        betterMoveText.textContent = betterMove;


        // Result bar styling

        if (score >= 75) {
            scoreFill.style.background = "#2f9e44";
        } else if (score >= 55) {
            scoreFill.style.background = "#e09f00";
        } else {
            scoreFill.style.background = "#ff4d4d";
        }


        result.classList.remove("hidden");

        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });


    // -------------------------
    // START OVER
    // -------------------------

    resetButton.addEventListener("click", () => {

        document.getElementById("decision").value = "";
        document.getElementById("price").value = "";
        document.getElementById("income").value = "";
        document.getElementById("savings").value = "";
        document.getElementById("debt").value = "";

        wantLevel.value = 5;

        updateWantValue();

        result.classList.add("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});