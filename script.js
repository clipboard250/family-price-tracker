document.addEventListener("DOMContentLoaded", function() {
    // List of years, quarters, and states
    const years = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const states = ["US_Average", "California", "Florida", "Colorado", "Texas", "New_York", "Illinois"];

    // Get the dropdowns
    const yearSelect = document.getElementById("year");
    const quarterSelect = document.getElementById("quarter");
    const stateSelect = document.getElementById("state");

    // Fill the Year dropdown
    years.forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    });

    // Fill the Quarter dropdown
    quarters.forEach(quarter => {
        let option = document.createElement("option");
        option.value = quarter;
        option.text = quarter;
        quarterSelect.appendChild(option);
    });

    // Fill the State dropdown
    states.forEach(state => {
        let option = document.createElement("option");
        option.value = state;
        option.text = state.replace("_", " "); // Replace underscore with space
        stateSelect.appendChild(option);
    });

    // Function to fetch and display egg price
    async function fetchEggPrice() {
        const year = document.getElementById("year").value;
        const quarter = document.getElementById("quarter").value;
        const state = document.getElementById("state").value;
        const priceOutput = document.getElementById("price-output");
        const graphFootnote = document.getElementById("graph-footnote");

        if (!year || !quarter || !state) {
            priceOutput.innerHTML = "Please select a year, quarter, and state.";
            return;
        }

        // Simple mock data (replace with actual data fetch later)
        const priceData = {
            "2016-Q1": { "US Average": 2.23, "California": 2.4, "Florida": 2.1, "Colorado": 2.05, "Texas": 2.0, "New York": 2.3, "Illinois": 2.15 },
            "2016-Q2": { "US Average": 1.66, "California": 1.85, "Florida": 1.6, "Colorado": 1.55, "Texas": 1.5, "New York": 1.75, "Illinois": 1.68 },
            // Add more data as needed (up to 2025-Q1)
            "2025-Q1": { "US Average": 4.95, "California": 5.6, "Florida": 5.43, "Colorado": 5.77, "Texas": 5.43, "New York": 5.9, "Illinois": 5.9 }
        };

        const period = `${year}-${quarter}`;
        const price = priceData[period]?.[state.replace("_", " ")]; // Match state names

        if (price) {
            priceOutput.innerHTML = `Price for ${state.replace("_", " ")} in ${year}-${quarter}: $${price} per dozen.`;
            graphFootnote.innerHTML = "📈 The graph shows all historical prices (2016–2025). Some past quarters had extreme price spikes due to market changes.";
        } else {
            priceOutput.innerHTML = "Data unavailable for selected period.";
        }
    }

    // Add event listener to the button
    document.querySelector("button").addEventListener("click", fetchEggPrice);
});