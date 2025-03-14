
// Load CSV data on page load
let eggPriceData = {};

// Fetch and parse CSV data
async function loadEggPriceData() {
    try {
        const response = await fetch('egg_prices_2016_2025.csv');
        const data = await response.text();
        eggPriceData = parseCSV(data);
        populateYearDropdown();
    } catch (error) {
        console.error("Error loading CSV data:", error);
    }
}

// Convert CSV to JSON
function parseCSV(csv) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');
    const jsonData = {};

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        if (values.length < 8) continue; // Ensure data integrity
        const quarter = values[0];
        jsonData[quarter] = {
            us: parseFloat(values[1]) || 0,
            california: parseFloat(values[2]) || 0,
            florida: parseFloat(values[3]) || 0,
            colorado: parseFloat(values[4]) || 0,
            texas: parseFloat(values[5]) || 0,
            newyork: parseFloat(values[6]) || 0,
            illinois: parseFloat(values[7]) || 0
        };
    }
    return jsonData;
}

// Populate Year Dropdown
function populateYearDropdown() {
    const yearDropdown = document.getElementById("year");
    const quarters = Object.keys(eggPriceData);
    const uniqueYears = [...new Set(quarters.map(q => q.split("-")[0]))];

    yearDropdown.innerHTML = "<option value='' disabled selected>Select Year</option>";
    uniqueYears.forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    yearDropdown.addEventListener("change", populateQuarterDropdown);
}

// Populate Quarter Dropdown
function populateQuarterDropdown() {
    const year = document.getElementById("year").value;
    const quarterDropdown = document.getElementById("quarter");
    quarterDropdown.innerHTML = "<option value='' disabled selected>Select Quarter</option>";

    const quarters = Object.keys(eggPriceData).filter(q => q.startsWith(year));
    quarters.forEach(quarter => {
        let option = document.createElement("option");
        option.value = quarter;
        option.textContent = quarter;
        quarterDropdown.appendChild(option);
    });

    quarterDropdown.addEventListener("change", populateStateDropdown);
}

// Populate State Dropdown
function populateStateDropdown() {
    const stateDropdown = document.getElementById("state");
    stateDropdown.innerHTML = "<option value='' disabled selected>Select State</option>";

    const states = ["us", "california", "florida", "colorado", "texas", "newyork", "illinois"];
    states.forEach(state => {
        let option = document.createElement("option");
        option.value = state;
        option.textContent = state.charAt(0).toUpperCase() + state.slice(1);
        stateDropdown.appendChild(option);
    });
}

// Fetch and display egg price
function fetchEggPrice() {
    const quarter = document.getElementById("quarter").value;
    const state = document.getElementById("state").value;

    if (!quarter || !state || !eggPriceData[quarter]) {
        document.getElementById("price-output").innerText = 'Please select a valid year, quarter, and state.';
        return;
    }

    const price = eggPriceData[quarter][state];
    if (isNaN(price) || price === 0) {
        document.getElementById("price-output").innerText = `No valid data for ${state.toUpperCase()} in ${quarter}.`;
    } else {
        document.getElementById("price-output").innerText = `Price for ${state.toUpperCase()} in ${quarter}: $${price.toFixed(2)} per dozen.`;
    }
    updateChart(state);
}

// Update chart with selected state's data
function updateChart(state) {
    const labels = Object.keys(eggPriceData);
    const prices = labels.map(quarter => eggPriceData[quarter][state] || 0);

    const ctx = document.getElementById('eggPriceChart').getContext('2d');
    if (window.eggPriceChartInstance) {
        window.eggPriceChartInstance.destroy();
    }

    window.eggPriceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${state.toUpperCase()} Egg Prices`,
                data: prices,
                borderColor: '#F5DF4D',
                backgroundColor: 'rgba(245, 223, 77, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Quarter' } },
                y: { title: { display: true, text: 'Price (USD per dozen)' }, beginAtZero: false }
            }
        }
    });
}

// Initialize page functions
window.onload = async function () {
    await loadEggPriceData();
};
