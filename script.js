let eggPriceData = {};

// Load CSV data
async function loadEggPriceData() {
    const response = await fetch('egg_prices_2016_2025.csv');
    const data = await response.text();
    eggPriceData = parseCSV(data);
}

// Parse CSV into usable data
function parseCSV(csv) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');
    const jsonData = {};

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        const quarter = values[0];
        jsonData[quarter] = {
            us: parseFloat(values[1]),
            california: parseFloat(values[2]),
            florida: parseFloat(values[3]),
            colorado: parseFloat(values[4]),
            texas: parseFloat(values[5]),
            newyork: parseFloat(values[6]),
            illinois: parseFloat(values[7])
        };
    }
    return jsonData;
}

// Fetch and display egg price
function fetchEggPrice() {
    const region = document.getElementById('region').value;
    const quarter = document.getElementById('quarter').value;

    if (!eggPriceData || !eggPriceData[quarter]) {
        document.getElementById('price-output').innerText = 'Egg price data unavailable for selected quarter.';
        return;
    }

    const price = eggPriceData[quarter][region];
    document.getElementById('price-output').innerText = `Price for ${region.toUpperCase()} in ${quarter}: $${price.toFixed(2)} per dozen.`;
    updateChart(region);
}

// Update the chart with selected region's data
function updateChart(region) {
    const labels = Object.keys(eggPriceData);
    const prices = labels.map(quarter => eggPriceData[quarter][region]);

    const ctx = document.getElementById('eggPriceChart').getContext('2d');
    if (window.eggPriceChartInstance) {
        window.eggPriceChartInstance.destroy();
    }

    window.eggPriceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${region.toUpperCase()} Egg Prices`,
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

// Replace the date picker with a dropdown for quarters
function setupQuarterDropdown() {
    const dropdown = document.getElementById('quarter');
    const quarters = Object.keys(eggPriceData);

    dropdown.innerHTML = ''; // Clear existing options
    quarters.forEach(q => {
        const option = document.createElement('option');
        option.value = q;
        option.textContent = q;
        dropdown.appendChild(option);
    });
}

window.onload = async function () {
    await loadEggPriceData();
    if (Object.keys(eggPriceData).length > 0) {
        setupQuarterDropdown(); // Ensure data is available before setting dropdown
    } else {
        setTimeout(setupQuarterDropdown, 1000); // Wait and try again if needed
    }
};

function setupQuarterDropdown() {
    const dropdown = document.getElementById('quarter');
    dropdown.innerHTML = ''; // Clear existing options

    if (!eggPriceData || Object.keys(eggPriceData).length === 0) {
        setTimeout(setupQuarterDropdown, 500); // Wait and retry if data isn’t ready
        return;
    }

    Object.keys(eggPriceData).forEach(q => {
        const option = document.createElement('option');
        option.value = q;
        option.textContent = q;
        dropdown.appendChild(option);
    });
}


function setupQuarterDropdown() {
    const dropdown = document.getElementById('quarter');
    dropdown.innerHTML = ''; // Clear existing options

    if (!eggPriceData || Object.keys(eggPriceData).length === 0) {
        setTimeout(setupQuarterDropdown, 500); // Wait and retry if data isn’t ready
        return;
    }

    Object.keys(eggPriceData).forEach(q => {
        const option = document.createElement('option');
        option.value = q;
        option.textContent = q;
        dropdown.appendChild(option);
    });
}


