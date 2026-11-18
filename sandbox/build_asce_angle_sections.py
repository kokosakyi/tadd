"""
Generates src/data/asce/angleSectionsDatabase.ts from sandbox/angle sections.xlsx.

Reads Sheet1 of sandbox/angle sections.xlsx via stdlib zipfile + xml.etree.ElementTree,
filters to the 427 valid structural angle profiles (SAE, SAU, SAW, DAE, DAL, DAS),
converts Excel metric units (cm, cm^2, N/m) to U.S. customary units (in., in.^2, plf),
derives exact fillet allowance from the sheet's w/t Ratio and polar principal radius ru,
and writes a strongly-typed TypeScript database module.
"""

from pathlib import Path
import math
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
XLSX_PATH = ROOT / "sandbox" / "angle sections.xlsx"
OUT_PATH = ROOT / "src" / "data" / "asce" / "angleSectionsDatabase.ts"

NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
VALID_ANGLE_TYPES = {"SAE", "SAU", "SAW", "DAE", "DAL", "DAS"}

CM_PER_IN = 2.54
CM2_PER_IN2 = 6.4516
PLF_PER_NM = 0.3048 / 4.4482216152605  # 1 N/m -> lb/ft (~0.068521766)

TYPE_LABELS = {
    "SAE": "Single Equal",
    "SAU": "Single Unequal",
    "SAW": "Single Welded Equal",
    "DAE": "Double Equal LBB",
    "DAL": "Double Unequal LBB",
    "DAS": "Double Unequal SBB",
}


def parse_xlsx_rows(xlsx_path: Path):
    with zipfile.ZipFile(xlsx_path) as zf:
        ss_root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
        shared_strings = ["".join(si.itertext()) for si in ss_root.findall(".//a:si", NS)]
        sheet_root = ET.fromstring(zf.read("xl/worksheets/sheet1.xml"))

    rows = []
    for row_el in sheet_root.findall(".//a:sheetData/a:row", NS):
        vals = {}
        for cell_el in row_el.findall("a:c", NS):
            col_ref = "".join(ch for ch in cell_el.attrib["r"] if ch.isalpha())
            cell_type = cell_el.attrib.get("t")
            val_el = cell_el.find("a:v", NS)
            if val_el is not None:
                raw_val = val_el.text
                vals[col_ref] = shared_strings[int(raw_val)] if cell_type == "s" else raw_val
        if vals:
            rows.append(vals)
    return rows


def build_sections():
    rows = parse_xlsx_rows(XLSX_PATH)
    sections = []

    for r in rows[1:]:
        angle_type = (r.get("B") or "").strip()
        if angle_type not in VALID_ANGLE_TYPES:
            continue

        row_number = int(float(r["A"]))
        angle_size = r["C"].strip()
        leg_long_cm = float(r["D"])
        leg_short_cm = float(r["E"])
        thickness_cm = float(r["F"])
        unit_weight_nm = float(r["G"])
        gross_area_cm2 = float(r["H"])
        wt_ratio = float(r["I"])
        rx_cm = float(r["J"])
        ry_cm = float(r["K"])
        rz_cm = float(r["L"])
        cross_section = r["M"].strip()
        wind_width_cm = float(r.get("N", 0.0))
        short_edge_dist_cm = float(r.get("O", 0.0))
        opt_cost_factor = float(r.get("Q", 0.0))

        leg_long_in = round(leg_long_cm / CM_PER_IN, 4)
        leg_short_in = round(leg_short_cm / CM_PER_IN, 4)
        thickness_in = round(thickness_cm / CM_PER_IN, 4)
        area_in2 = round(gross_area_cm2 / CM2_PER_IN2, 4)
        rx_in = round(rx_cm / CM_PER_IN, 4)
        ry_in = round(ry_cm / CM_PER_IN, 4)
        rz_in = round(rz_cm / CM_PER_IN, 4)

        # Exact polar radius identity: I_x + I_y = I_u + I_z => r_u^2 = r_x^2 + r_y^2 - r_z^2
        ru_sq = max(0.0001, rx_in * rx_in + ry_in * ry_in - rz_in * rz_in)
        ru_in = round(math.sqrt(ru_sq), 4)

        # Reconcile fillet allowance k - t from sheet's w/t ratio: w/t = (L - t - fillet) / t
        fillet_in = round(max(0.0, leg_long_in - thickness_in - wt_ratio * thickness_in), 4)
        unit_weight_plf = round(unit_weight_nm * PLF_PER_NM, 3)

        sec_id = f"{angle_type}_{angle_size}"
        designation = f"{angle_type} {angle_size} ({TYPE_LABELS[angle_type]})"

        sections.append(
            {
                "id": sec_id,
                "designation": designation,
                "rowNumber": row_number,
                "angleType": angle_type,
                "angleSize": angle_size,
                "crossSectionType": cross_section,
                "isDoubleAngle": cross_section != "Single",
                "legLongIn": leg_long_in,
                "legShortIn": leg_short_in,
                "thicknessIn": thickness_in,
                "filletRadiusIn": fillet_in,
                "areaIn2": area_in2,
                "rxIn": rx_in,
                "ryIn": ry_in,
                "rzIn": rz_in,
                "ruIn": ru_in,
                "wOverTRatio": round(wt_ratio, 3),
                "unitWeightNm": round(unit_weight_nm, 3),
                "unitWeightPlf": unit_weight_plf,
                "legLongCm": round(leg_long_cm, 4),
                "legShortCm": round(leg_short_cm, 4),
                "thicknessCm": round(thickness_cm, 4),
                "grossAreaCm2": round(gross_area_cm2, 4),
                "rxCm": round(rx_cm, 4),
                "ryCm": round(ry_cm, 4),
                "rzCm": round(rz_cm, 4),
                "windWidthCm": round(wind_width_cm, 4),
                "windWidthIn": round(wind_width_cm / CM_PER_IN, 4),
                "shortEdgeDistCm": round(short_edge_dist_cm, 4),
                "shortEdgeDistIn": round(short_edge_dist_cm / CM_PER_IN, 4),
                "optimizeCostFactor": round(opt_cost_factor, 4),
            }
        )

    sections.sort(key=lambda s: s["designation"])
    return sections


def write_ts(sections):
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "import type { AsceAngleSection } from '../../types/asce10';",
        "",
        "/**",
        f" * Full Structural Angle Section Library imported from sandbox/angle sections.xlsx ({len(sections)} profiles).",
        " * Includes Single (SAE, SAU, SAW) and Back-to-Back Double (DAE, DAL, DAS) steel angles.",
        " */",
        "export const EXCEL_ANGLE_SECTIONS: AsceAngleSection[] = [",
    ]
    for s in sections:
        is_double = "true" if s["isDoubleAngle"] else "false"
        lines.append(
            "  {"
            f" id: {s['id']!r}, designation: {s['designation']!r},"
            f" rowNumber: {s['rowNumber']}, angleType: {s['angleType']!r}, angleSize: {s['angleSize']!r},"
            f" crossSectionType: {s['crossSectionType']!r}, isDoubleAngle: {is_double},"
            f" legLongIn: {s['legLongIn']}, legShortIn: {s['legShortIn']}, thicknessIn: {s['thicknessIn']},"
            f" filletRadiusIn: {s['filletRadiusIn']}, areaIn2: {s['areaIn2']},"
            f" rxIn: {s['rxIn']}, ryIn: {s['ryIn']}, rzIn: {s['rzIn']}, ruIn: {s['ruIn']},"
            f" wOverTRatio: {s['wOverTRatio']}, unitWeightNm: {s['unitWeightNm']}, unitWeightPlf: {s['unitWeightPlf']},"
            f" legLongCm: {s['legLongCm']}, legShortCm: {s['legShortCm']}, thicknessCm: {s['thicknessCm']},"
            f" grossAreaCm2: {s['grossAreaCm2']}, rxCm: {s['rxCm']}, ryCm: {s['ryCm']}, rzCm: {s['rzCm']},"
            f" windWidthCm: {s['windWidthCm']}, windWidthIn: {s['windWidthIn']},"
            f" shortEdgeDistCm: {s['shortEdgeDistCm']}, shortEdgeDistIn: {s['shortEdgeDistIn']},"
            f" optimizeCostFactor: {s['optimizeCostFactor']}"
            " },"
        )
    lines.append("];")
    lines.append("")
    lines.append("export const LEGACY_SECTION_ID_ALIASES: Record<string, string> = {")
    aliases = {
        "L1.75x1.25x3/16": "SAU_1.75X1.25X0.1875",
        "L2x2x3/16": "SAE_2X2X0.1875",
        "L2.5x2.5x1/4": "SAE_2.5X2.5X0.25",
        "L3x3x1/4": "SAE_3X3X0.25",
        "L3.5x3.5x5/16": "SAE_3.5X3.5X0.3125",
        "L4x4x3/8": "SAE_4X4X0.375",
        "L5x5x3/8": "SAE_5X5X0.375",
        "L6x6x5/16": "SAE_6X6X0.3125",
        "L6x6x3/8": "SAE_6X6X0.375",
        "L8x8x1/2": "SAE_8X8X0.5",
        "L8x8x9/16": "SAE_8X8X0.5625",
    }
    valid_ids = {s["id"] for s in sections}
    for k, v in aliases.items():
        if v not in valid_ids:
            raise ValueError(f"Alias target missing from Excel database: {k} -> {v}")
        lines.append(f"  {k!r}: {v!r},")
    lines.append("};")
    lines.append("")
    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(sections)} angle sections to {OUT_PATH}")


if __name__ == "__main__":
    secs = build_sections()
    write_ts(secs)
