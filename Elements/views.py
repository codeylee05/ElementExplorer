from pathlib import Path
import json
from django.shortcuts import render
from mendeleev import element

ROOM_K = 298.15  # 25°C


def safe_celsius(kelvin):

    if kelvin is None:

        return None
    return round(kelvin - 273.15, 2)


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
    '''q = request.GET.get('q', '').strip()
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

            }'''

    return render(request, "index.html")  # Removed context: {"el": el, "q": q}
