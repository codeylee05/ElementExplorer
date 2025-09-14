
(() => {
    const DATA_PATHS = [
        "/static/Elements/data/elements.json", // primary (recommended)
        "/static/data/elements.json"           // fallback (some setups)
    ];

    let elementsData = [];
    let loadPromise = null;

    // Convert Kelvin -> Celsius (returns null if input falsy)
    function kelvinToCelsius(k) {
        if (k === null || k === undefined || k === "") return null;
        const n = Number(k);
        if (Number.isNaN(n)) return null;
        return Number((n - 273.15).toFixed(2));
    }

    // Try to fetch dataset from one of the candidate paths
    async function loadElements() {
        if (loadPromise) return loadPromise;
        loadPromise = (async () => {
            for (const p of DATA_PATHS) {
                try {
                    const res = await fetch(p, { cache: "reload" });
                    if (!res.ok) {
                        // try next path
                        console.warn(`elements.json not found at ${p} (status ${res.status})`);
                        continue;
                    }
                    const json = await res.json();
                    // dataset might be either { "elements": [...] } or an array directly
                    elementsData = Array.isArray(json) ? json : (json.elements || []);
                    console.log("ElementExplorer: loaded", elementsData.length, "elements from", p);
                    return elementsData;
                } catch (err) {
                    console.warn("Error fetching", p, err);
                    // try next path
                }
            }
            // If we reach here, no path worked
            console.error("ElementExplorer: failed to load elements.json from known paths.");
            elementsData = [];
            return elementsData;
        })();
        return loadPromise;
    }

    function normalizeQuery(q) {
        return (q || "").trim().toLowerCase();
    }

    // Find element by symbol, name or number
    function findElement(q) {
        const query = normalizeQuery(q);
        if (!query) return null;
        // exact symbol or name
        let el = elementsData.find(e =>
            (e.symbol || "").toLowerCase() === query || (e.name || "").toLowerCase() === query
        );
        if (el) return el;
        // numeric atomic number match
        const n = Number(query);
        if (!Number.isNaN(n)) {
            el = elementsData.find(e => Number(e.number) === n);
            if (el) return el;
        }
        // not found
        // Clear previous results
        document.getElementById("elementName").textContent = "";
        document.getElementById("elementCard").innerHTML = "";
        document.getElementById("infoCard").innerHTML = "";

        return null;
    }

    // map category string -> simplified type and pick colors
    function classifyAndColor(category) {
        const s = (category || "").toLowerCase();
        if (s.includes("nonmetal") || s.includes("noble gas") || s.includes("halogen") || s.includes("chalcogen")) {
            return { type: "Nonmetal", bg: "linear-gradient(135deg,#e9f7ea,#bfeac1)", color: "#0a4a1a" };
        }
        if (s.includes("metalloid") || s.includes("semimetal")) {
            return { type: "Metalloid", bg: "linear-gradient(135deg,#fff5d9,#ffd88b)", color: "#5a3f00" };
        }
        if (s.includes("metal")) {
            return { type: "Metal", bg: "linear-gradient(135deg,#d9e6ff,#9fb3ff)", color: "#0b2f6b" };
        }
        return { type: "Unknown", bg: "linear-gradient(135deg,#f2f2f2,#d9d9d9)", color: "#333" };
    }

    function formatMass(m) {
        if (m === null || m === undefined || m === "") return "";
        const n = Number(m);
        if (Number.isNaN(n)) return String(m);
        if (Math.abs(n) >= 100) return n.toFixed(0);
        if (Math.abs(n) >= 10) return n.toFixed(2);
        return n.toFixed(3);
    }

    // Show element container + hide placeholder
    function showElementContainer() {
        const elContainer = document.getElementById("elementContainer");
        const placeholder = document.getElementById("placeholderCard");
        if (elContainer) elContainer.classList.remove("d-none");
        if (placeholder) placeholder.classList.add("d-none");
    }

    // Reset to placeholder view (hide element container)
    function resetView() {
        const elContainer = document.getElementById("elementContainer");
        const placeholder = document.getElementById("placeholderCard");
        const heading = document.getElementById("elementName");
        const card = document.getElementById("elementCard");
        const info = document.getElementById("infoCard");
        if (elContainer) elContainer.classList.add("d-none");
        if (placeholder) placeholder.classList.remove("d-none");
        if (card) card.innerHTML = "";
        // Reset animation
        card.classList.remove("animation_pop-in");
        void card.offsetWidth; // force reflow
        card.classList.add("animation_pop-in");

        if (info) info.innerHTML = "";
    }

    // Render element details into DOM
    function renderElement(el) {
        if (!el) return;
        // prepare fields with fallbacks
        const number = el.number ?? el.atomic_number ?? el.atomicNumber;
        const name = el.name ?? "";
        const symbol = el.symbol ?? "";
        const atomic_mass = el.atomic_mass ?? el.atomicMass ?? el.atomic_mass;
        const econfig = el.electron_configuration ?? el.electronConfiguration ?? el.electron_configuration_semantic ?? "";
        const category = el.category ?? el.block ?? "";
        const phase = el.phase ?? el.standard_state ?? el.phase;
        const meltK = el.melt ?? el.melting_point ?? null;
        const boilK = el.boil ?? el.boiling_point ?? null;

        // compute numbers
        const protons = number;
        const electrons = number;
        const neutrons = (atomic_mass ? Math.round(Number(atomic_mass)) - Number(number) : null);

        // convert temps from K -> C where possible
        const meltC = kelvinToCelsius(meltK);
        const boilC = kelvinToCelsius(boilK);

        // classification + color
        const cls = classifyAndColor(category);

        // show containers
        showElementContainer();

        // heading
        const heading = document.getElementById("elementName");
        if (heading) heading.textContent = name;

        // element card
        const card = document.getElementById("elementCard");
        if (card) {
            card.innerHTML = `
        <div class="atomic-number">${number ?? ""}</div>
        <div class="symbol">${symbol}</div>
        <div class="mass">${formatMass(atomic_mass)}</div>
      `;
            // apply color style (keeps existing element-card class)
            card.style.background = cls.bg;
            card.style.color = cls.color;
        }

        // info card
        const info = document.getElementById("infoCard");
        if (info) {
            info.innerHTML = `
        <dl class="row">
          <dt class="col-5"><i class="bi bi-plus-circle"></i> Protons</dt><dd class="col-7">${protons ?? "Unknown"}</dd>

          <dt class="col-5"><i class="bi bi-circle-fill"></i> Neutrons</dt><dd class="col-7">${neutrons !== null ? neutrons : "Unknown"}</dd>

          <dt class="col-5"><i class="bi bi-dash-circle"></i> Electrons</dt><dd class="col-7">${electrons ?? "Unknown"} ${econfig ? `(${econfig})` : ""}</dd>

          <dt class="col-5"><i class="bi bi-patch-check-fill"></i> Type</dt><dd class="col-7">${cls.type}${category ? " — " + category : ""}</dd>

          <dt class="col-5"><i class="bi bi-thermometer-half"></i> Standard state</dt><dd class="col-7">${phase ?? "Unknown"}</dd>

          <dt class="col-5"><i class="bi bi-arrow-up-circle"></i> Melting point</dt><dd class="col-7">${meltC !== null ? meltC + "°C" : "Unknown"}</dd>

          <dt class="col-5"><i class="bi bi-arrow-down-circle"></i> Boiling point</dt><dd class="col-7">${boilC !== null ? boilC + "°C" : "Unknown"}</dd>
        </dl>
      `;
            info.style.color = cls.color;
        }
    }

    // main init - attach handlers, load data, optional auto-search from ?q=
    document.addEventListener("DOMContentLoaded", async () => {
        const searchForm = document.getElementById("searchForm");
        const searchInput = document.getElementById("searchInput");
        const submitButton = searchForm ? searchForm.querySelector('button[type="submit"]') : null;

        // set initial UI state
        resetView();

        // temporarily disable input/button until dataset loaded
        if (searchInput) searchInput.disabled = true;
        if (submitButton) submitButton.disabled = true;

        await loadElements();

        // enable input/button
        if (searchInput) searchInput.disabled = false;
        if (submitButton) submitButton.disabled = false;

        // auto-search from URL param ?q= if present
        try {
            const params = new URLSearchParams(window.location.search);
            const qParam = params.get("q");
            if (qParam) {
                const el = findElement(qParam);
                if (el) {
                    renderElement(el);
                }
            }
        } catch (e) {
            // ignore
        }

        // attach submit handler
        if (searchForm) {
            searchForm.addEventListener("submit", async (ev) => {
                ev.preventDefault();
                const q = (searchInput && searchInput.value) || "";
                if (!q.trim()) {
                    // empty search => go back to placeholder
                    resetView();
                    return;
                }
                if (!elementsData || elementsData.length === 0) {
                    // if still not loaded, wait
                    await loadElements();
                }
                const el = findElement(q);
                if (el) {
                    renderElement(el);
                } else {
                    // not found -> show a small inline message instead of blocking alert
                    // try to gracefully show message
                    const placeholder = document.getElementById("placeholderCard");
                    if (placeholder) {
                        // brief message using Bootstrap alert (create and remove)
                        const existing = document.getElementById("searchNotFound");
                        if (existing) existing.remove();
                        const alertEl = document.createElement("div");
                        alertEl.id = "searchNotFound";
                        alertEl.className = "alert alert-warning text-center mt-2";
                        alertEl.textContent = `No element found for "${q}"`;
                        placeholder.prepend(alertEl);
                        // remove after 4 seconds
                        setTimeout(() => {
                            const a = document.getElementById("searchNotFound");
                            if (a) a.remove();
                        }, 4000);
                    } else {
                        alert(`No element found for "${q}"`);
                    }
                    // keep placeholder visible
                    resetView();
                }
            });
        }

    });

})();
