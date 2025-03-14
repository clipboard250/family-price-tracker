
// Load CSV data on page load
let eggPriceData = {};

// Auto-popup function (triggers after 1 min) with collapsible behavior
setTimeout(function() {
    let popup = document.createElement("div");
    popup.id = "autoPopup";
    popup.innerHTML = `
        <div class="popup-container">
            <div class="popup-header">
                <button class="collapse-btn" onclick="togglePopup()">−</button>
            </div>
            <div class="popup-content">
                <p>Like this tool?</p>
                <p>I'm a copywriter who learned to code using AI.<br>
                Coffee fuels my creativity (and future Gofer Content builds).<br>
                <a href="https://buymeacoffee.com/gofercontent" target="_blank" class="coffee-button">Keep me coding ☕️</a></p>
            </div>
        </div>`;
    document.body.appendChild(popup);
    popup.style.display = "block";
}, 60000); // Triggers after 1 minute

// Function to collapse/expand popup
function togglePopup() {
    let popup = document.getElementById('autoPopup');
    if (popup.style.height === "40px") {
        popup.style.height = "auto";
    } else {
        popup.style.height = "40px";
    }
}

// Fetch and parse CSV data
async function loadEggPriceData() {
    try {
        const response = await fetch('egg_prices_2016_2025.csv');
        const data = await response.text();
        eggPriceData = parseCSV(data);
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

// Fetch and display egg price
function fetchEggPrice() {
    const region = document.getElementById('region').value;
    const quarter = document.getElementById('quarter').value;

    if (!eggPriceData || !eggPriceData[quarter]) {
        document.getElementById('price-output').innerText = 'Egg price data unavailable for selected quarter.';
        return;
    }

    const price = eggPriceData[quarter][region];
    if (isNaN(price)) {
        document.getElementById('price-output').innerText = `No valid data for ${region.toUpperCase()} in ${quarter}.`;
    } else {
        document.getElementById('price-output').innerText = `Price for ${region.toUpperCase()} in ${quarter}: $${price.toFixed(2)} per dozen.`;
    }
    updateChart(region);
}

// Update chart with selected region's data
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

// Improved Dropdown Formatting
function setupDropdownSearch() {
    const dropdown = document.getElementById('region');
    dropdown.setAttribute('onchange', 'searchDropdown()');

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search states...';
    searchBox.id = 'dropdownSearch';
    searchBox.style.width = '100%';
    searchBox.style.marginBottom = '10px';
    dropdown.parentNode.insertBefore(searchBox, dropdown);

    searchBox.addEventListener('keyup', function () {
        let filter = searchBox.value.toUpperCase();
        for (let i = 0; i < dropdown.options.length; i++) {
            let txt = dropdown.options[i].text.toUpperCase();
            dropdown.options[i].style.display = txt.includes(filter) ? '' : 'none';
        }
    });
}

// Statement about why only certain states are available
function addStateInfoMessage() {
    let infoBox = document.createElement("div");
    infoBox.id = "stateInfoBox";
    infoBox.innerHTML = `<p>Currently, we only have data for certain states. 
    As users submit real-time egg prices, we will expand this for 2025. 
    Want to contribute? Submit your prices with a verified receipt.</p>`;
    document.body.appendChild(infoBox);
}

// Popups for data credibility (hover or tap-to-show)
function setupPopups() {
    const faqItems = document.querySelectorAll('details');
    faqItems.forEach(item => {
        let citation = document.createElement('span');
        citation.className = 'tooltip-text';
        citation.innerText = 'Data from USDA, BLS & verified sources.';
        item.appendChild(citation);
        item.addEventListener('mouseover', () => citation.style.visibility = 'visible');
        item.addEventListener('mouseout', () => citation.style.visibility = 'hidden');
    });
}

// Initialize page functions
window.onload = async function () {
    await loadEggPriceData();
    setupDropdownSearch();
    setupPopups();
    addStateInfoMessage();
};
Text = `No valid data for ${state.toUpperCase()} in ${quarter}.`;
    } else {
        document.getElementById("price-output").innerText = `Price for ${state.toUpperCase()} in ${quarter}: $${price.toFixed(2)} per dozen.`;
    }
    updateChart(state);
}

// Update chart with selected state's data
function updateChart(state) {
    const labels = Object.keys(eggPriceData);
    const prices = labels.map(quarter => eggPriceData[quarter][state]);

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
