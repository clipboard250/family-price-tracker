document.addEventListener("DOMContentLoaded", function() {
    // Graph Container
    const chartContainer = document.getElementById("chart-container");
    const chartInstructions = document.getElementById("chart-instructions");
    
    // Default Placeholder Before Graph Appears
    chartInstructions.innerHTML = "📊 Select a location to reveal the graph.";
    
    async function fetchEggPrice() {
        const year = document.getElementById("year").value;
        const quarter = document.getElementById("quarter").value;
        const state = document.getElementById("state").value;
        const priceOutput = document.getElementById("price-output");

        if (!year || !quarter || !state) {
            priceOutput.innerHTML = "Please select a year, quarter, and state.";
            return;
        }

        // Simulate fetching data (Replace with actual fetch logic)
        let price = mockFetchPrice(year, quarter, state);

        if (price) {
            priceOutput.innerHTML = `Price for ${state.toUpperCase()} in ${year}-${quarter}: $${price} per dozen.`;

            // Update graph instructions AFTER data loads
            chartInstructions.innerHTML = "📈 The graph shows all historical prices (2016–2025). Some past quarters had extreme price spikes due to market changes.";

            // Generate Graph (Replace this with actual Chart.js graph update function)
            updateGraph(year, quarter, state, price);
        } else {
            priceOutput.innerHTML = "Data unavailable for selected period.";
        }
    }

    // Placeholder function to simulate price fetching
    function mockFetchPrice(year, quarter, state) {
        const mockData = {
            "2016-Q1": { "Florida": 2.40, "California": 2.55 },
            "2019-Q2": { "Florida": 1.28, "California": 1.35 }
        };
        return mockData[`${year}-${quarter}`]?.[state] || null;
    }

    // Placeholder function for updating the graph
    function updateGraph(year, quarter, state, price) {
        console.log(`Updating graph for ${state} in ${year}-${quarter} with price $${price}`);
        // Chart.js graph update logic goes here
    }

    // Assign fetch function to button
    document.querySelector("button").addEventListener("click", fetchEggPrice);
});

