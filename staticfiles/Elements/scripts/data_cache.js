
let elementsData = [];

async function loadElements() {
    try {
        const response = await fetch("/static/data/elements.json");
        elementsData = await response.json();
        console.log("Elements loaded:", elementsData.elements.length);
    } catch (err) {
        console.error("Failed to load elements:", err);
    }
}

window.addEventListener("DOMContentLoaded", loadElements);

function formatQuery(q) {
    return q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
}

function searchElement(query) {
    query = query.trim().toLowerCase();
    if (!query) return null;
    return elementsData.elements.find(
        el => el.name.toLowerCase() === query || el.symbol.toLowerCase() === query
    );
}

function renderElement(el) {
    // Element heading
    const heading = document.getElementById("elementName");
    heading.textContent = el.name;

    const card = document.getElementById("elementCard");
    card.innerHTML = `
        <div class="atomic-number">${el.number}</div>
        <div class="symbol">${el.symbol}</div>
        <div class="mass">${el.atomic_mass}</div>
    `;

    const category = el.category.toLowerCase();
    if (category.includes("metal")) card.style.backgroundColor = "#ffd700";
    else if (category.includes("nonmetal")) card.style.backgroundColor = "#7ec0ee";
    else if (category.includes("metalloid") || category.includes("semimetal")) card.style.backgroundColor = "#dda0dd";
    else card.style.backgroundColor = "#ccc";

    const info = document.getElementById("infoCard");
    info.innerHTML = `
        <dl class="row">
            <dt class="col-5"><i class="bi bi-plus-circle"></i> Protons</dt><dd class="col-7">${el.number}</dd>
            <dt class="col-5"><i class="bi bi-circle-fill"></i> Neutrons</dt><dd class="col-7">${Math.round(el.atomic_mass - el.number)}</dd>
            <dt class="col-5"><i class="bi bi-dash-circle"></i> Electrons</dt><dd class="col-7">${el.number} (${el.electron_configuration})</dd>
            <dt class="col-5"><i class="bi bi-patch-check-fill"></i> Type</dt><dd class="col-7">${el.category}</dd>
            <dt class="col-5"><i class="bi bi-thermometer-half"></i> Standard state</dt><dd class="col-7">${el.phase}</dd>
            <dt class="col-5"><i class="bi bi-arrow-up-circle"></i> Melting point</dt><dd class="col-7">${el.melt ? el.melt + "°C" : "Unknown"}</dd>
            <dt class="col-5"><i class="bi bi-arrow-down-circle"></i> Boiling point</dt><dd class="col-7">${el.boil ? el.boil + "°C" : "Unknown"}</dd>
        </dl>
    `;
}

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("searchInput").value;
    const result = searchElement(q);
    if (result) renderElement(result);
    else alert(`No element found for "${q}"`);
});
