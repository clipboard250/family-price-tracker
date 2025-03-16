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

    // Initialize the Chart.js graph
    const ctx = document.getElementById("eggPriceChart").getContext("2d");
    let eggChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], // Will be filled with periods (e.g., 2016-Q1)
            datasets: [{
                label: "Egg Price ($ per dozen)",
                data: [], // Will be filled with prices
                borderColor: "#E5A663",
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '$' + context.parsed.y + ' per dozen';
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Egg price data from the CSV
    const priceData = {
        "2016-Q1": { "US_Average": 2.23, "California": 2.4, "Florida": 2.1, "Colorado": 2.05, "Texas": 2.0, "New_York": 2.3, "Illinois": 2.15 },
        "2016-Q2": { "US_Average": 1.66, "California": 1.85, "Florida": 1.6, "Colorado": 1.55, "Texas": 1.5, "New_York": 1.75, "Illinois": 1.68 },
        "2016-Q3": { "US_Average": 1.49, "California": 1.6, "Florida": 1.45, "Colorado": 1.4, "Texas": 1.35, "New_York": 1.58, "Illinois": 1.5 },
        "2016-Q4": { "US_Average": 1.36, "California": 1.5, "Florida": 1.35, "Colorado": 1.32, "Texas": 1.28, "New_York": 1.42, "Illinois": 1.38 },
        "2017-Q1": { "US_Average": 1.49, "California": 1.55, "Florida": 1.48, "Colorado": 1.45, "Texas": 1.4, "New_York": 1.6, "Illinois": 1.5 },
        "2017-Q2": { "US_Average": 1.39, "California": 1.45, "Florida": 1.37, "Colorado": 1.35, "Texas": 1.3, "New_York": 1.5, "Illinois": 1.42 },
        "2017-Q3": { "US_Average": 1.37, "California": 1.42, "Florida": 1.35, "Colorado": 1.3, "Texas": 1.28, "New_York": 1.48, "Illinois": 1.4 },
        "2017-Q4": { "US_Average": 1.62, "California": 1.7, "Florida": 1.58, "Colorado": 1.55, "Texas": 1.5, "New_York": 1.75, "Illinois": 1.65 },
        "2018-Q1": { "US_Average": 1.79, "California": 1.92, "Florida": 1.75, "Colorado": 1.7, "Texas": 1.65, "New_York": 1.88, "Illinois": 1.8 },
        "2018-Q2": { "US_Average": 1.9, "California": 2.03, "Florida": 1.85, "Colorado": 1.78, "Texas": 1.75, "New_York": 1.98, "Illinois": 1.9 },
        "2018-Q3": { "US_Average": 1.67, "California": 1.8, "Florida": 1.62, "Colorado": 1.55, "Texas": 1.5, "New_York": 1.75, "Illinois": 1.68 },
        "2018-Q4": { "US_Average": 1.59, "California": 1.65, "Florida": 1.5, "Colorado": 1.45, "Texas": 1.42, "New_York": 1.6, "Illinois": 1.55 },
        "2019-Q1": { "US_Average": 1.49, "California": 1.58, "Florida": 1.42, "Colorado": 1.4, "Texas": 1.35, "New_York": 1.55, "Illinois": 1.48 },
        "2019-Q2": { "US_Average": 1.34, "California": 1.4, "Florida": 1.28, "Colorado": 1.26, "Texas": 1.22, "New_York": 1.38, "Illinois": 1.32 },
        "2019-Q3": { "US_Average": 1.28, "California": 1.32, "Florida": 1.22, "Colorado": 1.18, "Texas": 1.15, "New_York": 1.3, "Illinois": 1.25 },
        "2019-Q4": { "US_Average": 1.4, "California": 1.45, "Florida": 1.38, "Colorado": 1.35, "Texas": 1.32, "New_York": 1.48, "Illinois": 1.42 },
        "2020-Q1": { "US_Average": 1.48, "California": 1.55, "Florida": 1.44, "Colorado": 1.42, "Texas": 1.38, "New_York": 1.55, "Illinois": 1.5 },
        "2020-Q2": { "US_Average": 1.74, "California": 1.85, "Florida": 1.68, "Colorado": 1.65, "Texas": 1.6, "New_York": 1.8, "Illinois": 1.72 },
        "2020-Q3": { "US_Average": 1.36, "California": 1.45, "Florida": 1.32, "Colorado": 1.3, "Texas": 1.25, "New_York": 1.38, "Illinois": 1.35 },
        "2020-Q4": { "US_Average": 1.45, "California": 1.52, "Florida": 1.4, "Colorado": 1.38, "Texas": 1.35, "New_York": 1.45, "Illinois": 1.42 },
        "2021-Q1": { "US_Average": 1.56, "California": 1.65, "Florida": 1.52, "Colorado": 1.5, "Texas": 1.48, "New_York": 1.6, "Illinois": 1.55 },
        "2021-Q2": { "US_Average": 1.56, "California": 1.68, "Florida": 1.5, "Colorado": 1.45, "Texas": 1.42, "New_York": 1.58, "Illinois": 1.52 },
        "2021-Q3": { "US_Average": 1.66, "California": 1.78, "Florida": 1.63, "Colorado": 1.6, "Texas": 1.55, "New_York": 1.7, "Illinois": 1.65 },
        "2021-Q4": { "US_Average": 1.74, "California": 1.92, "Florida": 1.76, "Colorado": 1.74, "Texas": 1.68, "New_York": 1.84, "Illinois": 1.78 },
        "2022-Q1": { "US_Average": 1.99, "California": 2.2, "Florida": 2.05, "Colorado": 1.98, "Texas": 1.92, "New_York": 2.15, "Illinois": 2.0 },
        "2022-Q2": { "US_Average": 2.53, "California": 2.9, "Florida": 2.75, "Colorado": 2.65, "Texas": 2.6, "New_York": 2.85, "Illinois": 2.7 },
        "2022-Q3": { "US_Average": 2.99, "California": 3.4, "Florida": 3.1, "Colorado": 3.0, "Texas": 2.95, "New_York": 3.3, "Illinois": 3.05 },
        "2022-Q4": { "US_Average": 3.75, "California": 4.5, "Florida": 4.0, "Colorado": 3.9, "Texas": 3.8, "New_York": 4.25, "Illinois": 3.95 },
        "2023-Q1": { "US_Average": 4.16, "California": 5.1, "Florida": 4.8, "Colorado": 4.7, "Texas": 4.5, "New_York": 5.0, "Illinois": 4.85 },
        "2023-Q2": { "US_Average": 2.72, "California": 3.2, "Florida": 3.0, "Colorado": 2.85, "Texas": 2.8, "New_York": 3.1, "Illinois": 2.95 },
        "2023-Q3": { "US_Average": 2.24, "California": 2.7, "Florida": 2.55, "Colorado": 2.4, "Texas": 2.35, "New_York": 2.65, "Illinois": 2.5 },
        "2023-Q4": { "US_Average": 2.24, "California": 2.75, "Florida": 2.5, "Colorado": 2.38, "Texas": 2.3, "New_York": 2.6, "Illinois": 2.45 },
        "2024-Q1": { "US_Average": 2.84, "California": 3.2, "Florida": 3.0, "Colorado": 2.85, "Texas": 2.8, "New_York": 3.1, "Illinois": 2.95 },
        "2024-Q2": { "US_Average": 2.76, "California": 3.1, "Florida": 2.92, "Colorado": 2.78, "Texas": 2.7, "New_York": 3.0, "Illinois": 2.85 },
        "2024-Q3": { "US_Average": 3.37, "California": 3.9, "Florida": 3.55, "Colorado": 3.42, "Texas": 3.35, "New_York": 3.65, "Illinois": 3.5 },
        "2024-Q4": { "US_Average": 3.72, "California": 4.3, "Florida": 3.9, "Colorado": 3.8, "Texas": 3.7, "New_York": 4.0, "Illinois": 3.85 },
        "2025-Q1": { "US_Average": 4.95, "California": 5.6, "Florida": 5.43, "Colorado": 5.77, "Texas": 5.43, "New_York": 5.9, "Illinois": 5.9 }
    };

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

        const period = `${year}-${quarter}`;
        const price = priceData[period]?.[state === "US_Average" ? "US_Average" : state.replace("_", " ")];

        if (price) {
            priceOutput.innerHTML = `Egg Prices for ${state.replace("_", " ")}, ${quarter}-${year}: $${price} per dozen.`;
            graphFootnote.innerHTML = "📈 The graph shows all historical prices (2016–2025). Some past quarters had extreme price spikes due to market changes.";
            updateGraph(state);
        } else {
            priceOutput.innerHTML = "Data unavailable for selected period.";
            graphFootnote.innerHTML = '📊 Select year, quarter, and state, the "Get Data" to reveal the graph.';
        }
    }

    // Function to update the graph
    function updateGraph(selectedState) {
        const labels = Object.keys(priceData); // e.g., ["2016-Q1", "2016-Q2", ...]
        const prices = labels.map(period => priceData[period][selectedState === "US_Average" ? "US_Average" : selectedState.replace("_", " ")] || 0);

        eggChart.data.labels = labels;
        eggChart.data.datasets[0].data = prices;
        eggChart.update();
    }

    // Add event listener to the button
    document.querySelector("button").addEventListener("click", fetchEggPrice);
});