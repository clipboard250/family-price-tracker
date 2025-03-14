
// Load CSV data on page load
let eggPriceData = {};

// Auto-popup function (triggers after 1 min) with new design
setTimeout(function() {
    let popup = document.createElement("div");
    popup.id = "autoPopup";
    popup.innerHTML = `
        <div class="popup-container">
            <div class="popup-header">
                <span class="close-arrow" onclick="document.getElementById('autoPopup').style.display='none'">⬇</span>
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

// Fetch and parse CSV data
async function loadEggPriceData() {
    const response = await fetch('egg_prices_2016_2025.csv');
    const data = await response.text();
    eggPriceData = parseCSV(data);
}

// Convert CSV to JSON
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
