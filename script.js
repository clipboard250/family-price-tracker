document.addEventListener("DOMContentLoaded", function() {
    // List of years and states
    const years = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    const states = ["US_Average", "California", "Florida", "Colorado", "Texas", "New_York", "Illinois"];

    // Get the dropdowns
    const itemSelect = document.getElementById("item");
    const yearSelect = document.getElementById("year");
    const stateSelect = document.getElementById("state");

    // Safety check for dropdown elements
    if (!itemSelect || !yearSelect || !stateSelect) {
        console.error("One or more dropdown elements not found. Please check the HTML IDs.");
        return;
    }

    // Fill the Year dropdown
    years.forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    });

    // Fill the State dropdown
    states.forEach(state => {
        let option = document.createElement("option");
        option.value = state;
        option.text = state.replace("_", " ");
        stateSelect.appendChild(option);
    });

    // Initialize the Chart.js graph
    const ctx = document.getElementById("eggPriceChart").getContext("2d");
    if (!ctx) {
        console.error("Canvas element 'eggPriceChart' not found.");
        return;
    }
    let priceChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Price ($ per unit)",
                data: [],
                borderColor: "#FFD966",
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: function(context) {
                            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F5F5F5' : '#333';
                        }
                    }
                },
                x: {
                    ticks: {
                        color: function(context) {
                            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F5F5F5' : '#333';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '$' + context.parsed.y + ' per unit';
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Egg price data (annual averages, US_Average only for simplicity)
    const eggPriceData = {
        "2016": { "US_Average": 1.69, "California": 1.84, "Florida": 1.65, "Colorado": 1.58, "Texas": 1.53, "New_York": 1.76, "Illinois": 1.68 },
        "2017": { "US_Average": 1.47, "California": 1.53, "Florida": 1.45, "Colorado": 1.41, "Texas": 1.37, "New_York": 1.58, "Illinois": 1.49 },
        "2018": { "US_Average": 1.74, "California": 1.85, "Florida": 1.68, "Colorado": 1.62, "Texas": 1.58, "New_York": 1.80, "Illinois": 1.73 },
        "2019": { "US_Average": 1.38, "California": 1.44, "Florida": 1.33, "Colorado": 1.29, "Texas": 1.26, "New_York": 1.41, "Illinois": 1.37 },
        "2020": { "US_Average": 1.51, "California": 1.59, "Florida": 1.46, "Colorado": 1.44, "Texas": 1.40, "New_York": 1.54, "Illinois": 1.50 },
        "2021": { "US_Average": 1.63, "California": 1.76, "Florida": 1.60, "Colorado": 1.56, "Texas": 1.52, "New_York": 1.68, "Illinois": 1.63 },
        "2022": { "US_Average": 2.82, "California": 3.25, "Florida": 2.98, "Colorado": 2.88, "Texas": 2.84, "New_York": 3.14, "Illinois": 2.93 },
        "2023": { "US_Average": 2.84, "California": 3.44, "Florida": 3.14, "Colorado": 3.01, "Texas": 2.96, "New_York": 3.34, "Illinois": 3.16 },
        "2024": { "US_Average": 3.17, "California": 3.63, "Florida": 3.34, "Colorado": 3.21, "Texas": 3.15, "New_York": 3.44, "Illinois": 3.29 },
        "2025": { "US_Average": 4.95, "California": 5.60, "Florida": 5.43, "Colorado": 5.77, "Texas": 5.43, "New_York": 5.90, "Illinois": 5.90 }
    };

    // Diaper price data (annual averages, national only)
    const diaperPriceData = {
        "2016": 10.50,
        "2017": 11.00,
        "2018": 11.50,
        "2019": 12.00,
        "2020": 12.50,
        "2021": 13.00,
        "2022": 13.50,
        "2023": 14.00,
        "2024": 14.50,
        "2025": 15.00
    };

    // Function to fetch and display price
    async function fetchPrice() {
        const item = document.getElementById("item").value;
        const year = document.getElementById("year").value;
        const state = document.getElementById("state").value;
        const priceOutput = document.getElementById("price-output");
        const graphFootnote = document.getElementById("graph-footnote");
        const chartContainer = document.getElementById("chart-container");
        const resultsContainer = document.getElementById("results-container");

        if (!item || !year || !state) {
            priceOutput.innerHTML = "Please select an item, year, and state.";
            return;
        }

        // Add loading class
        chartContainer.classList.add("loading");

        // Simulate a delay for loading animation
        await new Promise(resolve => setTimeout(resolve, 1000));

        let price;
        let unit = item === "Eggs" ? "per dozen" : "per pack";

        if (item === "Eggs") {
            const stateKey = state === "US Average" ? "US_Average" : state.replace(" ", "_");
price = eggPriceData[year]?.[stateKey];
        } else if (item === "Diapers") {
            price = diaperPriceData[year];
        }

        if (price) {
            if (item === "Eggs") {
                priceOutput.innerHTML = `${item} prices for ${state.replace("_", " ")}, ${year}: \$${price} ${unit}.`;
            } else {
                priceOutput.innerHTML = `${item} prices for ${year}: \$${price} ${unit}.`;
            }
            graphFootnote.innerHTML = `${item === "Eggs" ? "📈" : "📈"} The graph shows all historical prices (2016–2025). Some years had extreme price spikes due to market changes.`;
            updateGraph(item, state);

            // Update submission links with the selected item
            const emailLink = document.getElementById("email-link");
            const githubLink = document.getElementById("github-link");
            const selectedItem = document.getElementById("item").value;
            if (emailLink && githubLink) {
                emailLink.href = `mailto:info@gofercontent.com?subject=Price%20Submission&body=Hi%20Gofer%20Content%2C%0D%0A%0D%0AI%20want%20to%20share%20a%20price%20I%20found%3A%0D%0A-%20Item%3A%20${selectedItem}%0D%0A-%20City%20%26%20State%3A%20%0D%0A-%20Date%3A%20%0D%0A-%20Price%3A%20%0D%0A-%20Optional%20Receipt%20or%20Photo%3A%20(please%20attach%20if%20available)%0D%0A%0D%0AThanks!`;
                githubLink.href = `https://github.com/clipboard250/egg-price-tracker/issues/new?template=price-submission.yml&title=${selectedItem}%20Price%20Submission&body=**Item:**%20${selectedItem}%0A**City%20&%20State:**%20%0A**Date:**%20%0A**Price:**%20%0A**Optional%20Receipt%20or%20Photo:**%20(please%20attach%20if%20available)`;
            } else {
                console.error("Submission links not found. Please check the HTML IDs for email-link and github-link.");
            }
        } else {
            priceOutput.innerHTML = "Data unavailable for selected period.";
            graphFootnote.innerHTML = '📊 Select item, year, and state, then "Get data" to reveal the graph.';
        }

        // Remove loading class
        chartContainer.classList.remove("loading");

        // Add scroll behavior for mobile (screen width ≤ 768px) to land on price data
        if (window.innerWidth <= 768) {
            if (resultsContainer) {
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
// Function to update the graph
function updateGraph(item, state) {
    const labels = Object.keys(item === "Eggs" ? eggPriceData : diaperPriceData);
    const prices = labels.map(year => {
        if (item === "Eggs") {
            const stateKey = state === "US Average" ? "US_Average" : state.replace(" ", "_");
            return eggPriceData[year][stateKey] || 0;
        } else {
            return diaperPriceData[year] || 0;
        }
    });

    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = prices;
    priceChart.update();
}
    // Add event listener to the button
    const button = document.querySelector("button");
    if (button) {
        button.addEventListener("click", fetchPrice);
    } else {
        console.error("Get data button not found.");
    }
});