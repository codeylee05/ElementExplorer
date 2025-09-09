from django.shortcuts import render
from mendeleev import element

ROOM_K = 298.15  # 25°C


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


def safe_celsius(kelvin):

    if kelvin is None:

        return None
    return round(kelvin - 273.15, 2)


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
