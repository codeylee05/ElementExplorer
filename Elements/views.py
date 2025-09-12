from pathlib import Path
import json
from django.shortcuts import render
from mendeleev import element

ROOM_K = 298.15  # 25°C

'''
def classify_element_type(el):

    if getattr(el, "is_metal", False):
        return "Metal"
    if getattr(el, "is_nonmetal", False):
        return "Nonmetal"
    if getattr(el, "is_metalloid", False):
        return "Metalloid"

    series = getattr(el, "series", None)
    if series:
        s = series.lower()
        if "nonmetal" in s or "noble gas" in s or "halogen" in s or "chalcogen" in s:
            return "Nonmetal"
        if "metalloid" in s:
            return "Metalloid"
        if "metal" in s:
            return "Metal"

    return "Unknown"
'''
'''
def compute_standard_state(melt_k, boil_k):

    try:
        if melt_k and boil_k:

            if melt_k > ROOM_K:

                return "Solid"
            if boil_k <= ROOM_K:

                return "Gas"
            return "Liquid"
        if melt_k:

            return "Solid" if melt_k > ROOM_K else "Liquid/Maybe gas"
        if boil_k:

            return "Gas" if boil_k <= ROOM_K else "Solid/Maybe liquid"
    except:

        pass

    return "Unknown"
'''


def safe_celsius(kelvin):

    if kelvin is None:

        return None
    return round(kelvin - 273.15, 2)


'''
def index(request):

    q = request.GET.get("q", "").strip()
    eldata = None

    if q:
        try:
            if q.isalpha():
                q_norm = q.capitalize()
            else:
                q_norm = q

            el = element(q_norm)
            eldata = {
                "symbol": el.symbol,
                "atomic_number": el.atomic_number,
                "mass": round(el.atomic_weight, 3),
                "name": el.name,
                "protons": el.atomic_number,
                "neutrons": el.neutrons,
                "electrons": el.electrons,
                "econf": el.econf,
                "series": el.series,
                "classification": classify_element_type(el),
                "melting_point_c": safe_celsius(el.melting_point),
                "boiling_point_c": safe_celsius(el.boiling_point),
                "standard_state": compute_standard_state(el.melting_point, el.boiling_point),
            }
        except:
            eldata = None

    return render(request, "index.html", {"el": eldata, "q": q})
'''

"""Periodic Table View"""

'''
def build_periodic_grid():
    """
    Returns:
      - rows: list of 7 rows. Each row is a list of 18 cells: either element dict or None.
      - lanthanides: list of element dicts (57..71)
      - actinides: list of element dicts (89..103)
    Element dict minimal fields: atomic_number, symbol, name, type (metal/nonmetal...), group, period
    """
    # precreate empty 7x18 grid (rows indexed 1..7 -> using 0..6)
    rows = [[None for _ in range(18)] for _ in range(7)]

    # fetch all elements 1..118
    elements = {}
    for z in range(1, 119):
        try:
            el = element(z)
        except Exception:
            el = None
        elements[z] = el

    # place main-block elements by period & group (group_id 1..18)
    for z, el in elements.items():
        if el is None:
            continue
        # skip lanthanides (57–71) & actinides (89–103) for main grid placement
        if 57 <= z <= 71 or 89 <= z <= 103:
            continue

        period = getattr(el, "period", None)
        group = getattr(el, "group_id", None)
        if period is None or group is None:
            # Some elements may have no group (e.g., H handled but usually has group)
            continue
        # map to zero-based indexes: period 1->row 0, group 1->col 0
        r = int(period) - 1
        c = int(group) - 1
        if 0 <= r < 7 and 0 <= c < 18:
            rows[r][c] = {
                "atomic_number": el.atomic_number,
                "symbol": el.symbol,
                "name": el.name,
                "group": el.group_id,
                "period": el.period,
                "type": classify_element_type(el),
            }

    # special placement for Hydrogen (H, group 1, period 1) and Helium (group 18, period 1)
    # they should already fit via group/period logic above.

    # Create lanthanides and actinides lists
    lanthanides = []
    for z in range(57, 72):
        el = elements.get(z)
        if el:
            lanthanides.append({
                "atomic_number": el.atomic_number,
                "symbol": el.symbol,
                "name": el.name,
                "type": classify_element_type(el),
            })
    actinides = []
    for z in range(89, 104):
        el = elements.get(z)
        if el:
            actinides.append({
                "atomic_number": el.atomic_number,
                "symbol": el.symbol,
                "name": el.name,
                "type": classify_element_type(el),
            })

    return rows, lanthanides, actinides


def periodic_table(request):
    rows, lanthanides, actinides = build_periodic_grid()
    # color legend mapping (use in template)
    legend = {
        "metal": "Metals",
        "nonmetal": "Nonmetals",
        "metalloid": "Metalloids",
        "unknown": "Unknown",
    }
    return render(request, "periodic_table.html", {
        "rows": rows,
        "lanthanides": lanthanides,
        "actinides": actinides,
        "legend": legend,
    })
'''

# Load JSON once at startup
BASE_DIR = Path(__file__).resolve().parent
with open(BASE_DIR / 'static' / 'Elements' / 'data' / 'elements.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# JSON structure: {"elements": [ ... ]}
ELEMENTS = data["elements"]

# Create lookup dictionaries
ELEMENTS_BY_SYMBOL = {el['symbol'].capitalize(): el for el in ELEMENTS}
ELEMENTS_BY_NAME = {el['name'].capitalize(): el for el in ELEMENTS}

# Map category to simplified classification
CATEGORY_MAP = {
    "alkali metal": "Metal",
    "alkaline earth metal": "Metal",
    "transition metal": "Metal",
    "post-transition metal": "Metal",
    "metalloid": "Metalloid",
    "diatomic nonmetal": "Nonmetal",
    "noble gas": "Nonmetal",
    "lanthanide": "Metal",
    "actinide": "Metal",
}


def kelvin_to_celsius(k):
    if k is None:
        return None
    return round(k - 273.15, 2)


def index(request):
    q = request.GET.get('q', '').strip()
    el = None

    if q:
        key = q.capitalize()
        element_json = ELEMENTS_BY_SYMBOL.get(key) or ELEMENTS_BY_NAME.get(key)

        if element_json:
            # Map JSON fields to your template fields
            el = {
                "name": element_json["name"],
                "symbol": element_json["symbol"],
                "atomic_number": element_json["number"],
                "mass": element_json["atomic_mass"],
                "protons": element_json["number"],
                "electrons": element_json["number"],  # assuming neutral atom
                "neutrons": round(element_json["atomic_mass"]) - element_json["number"],
                "econf": element_json.get("electron_configuration", ""),
                "classification": CATEGORY_MAP.get(element_json.get("category", "").lower(), "Unknown"),
                "standard_state": element_json.get("phase", "Unknown"),
                "melting_point_c": kelvin_to_celsius(element_json.get("melt")),
                "boiling_point_c": kelvin_to_celsius(element_json.get("boil")),

            }

    return render(request, "index.html", {"el": el, "q": q})
