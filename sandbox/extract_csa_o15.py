"""
Extractor for CSA O15-15: Wood utility poles and reinforcing stubs
Generates sandbox/csa_o15_clauses.json
"""

import os
import re
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OCR_DIR = os.path.join(BASE_DIR, "csa_o15_ocr_tmp")
OUT_JSON = os.path.join(BASE_DIR, "csa_o15_clauses.json")

def clean_lines(lines):
    cleaned = []
    for l in lines:
        s = l.strip()
        if not s:
            continue
        if s in ["CAN/CSA-015-15", "Wood utility poles and reinforcing stubs", "January 2015", "© 2015 CSA Group"]:
            continue
        if re.search(r"^[0-9]+\s*CSA Group", s) or re.search(r"CSA Group\s*[0-9]+", s):
            continue
        if "H W WE wyt" in s or "pruirwiiAQ" in s or "0 2015 CSA Group" in s:
            continue
        if re.match(r"^\d+$", s):
            continue
        cleaned.append(s)
    return cleaned

def parse_definitions():
    """Extract definitions from Clause 3 (pages 16-18)."""
    raw_lines = []
    for p in range(16, 19):
        p_path = os.path.join(OCR_DIR, f"page_{p}.txt")
        if os.path.exists(p_path):
            with open(p_path, "r", encoding="utf-8") as f:
                raw_lines.extend(clean_lines(f.readlines()))

    defs = {}
    recording = False
    curr_term = None
    curr_def = []

    for l in raw_lines:
        if "3 Definitions" in l:
            recording = True
            continue
        if recording:
            if l.startswith("4 Material requirements") or l.startswith("4.1 General"):
                break
            if l.startswith("The following definitions apply"):
                continue

            m = re.match(r"^([A-Za-z0-9\(\)\/\s\-\,\'\"]+?)\s+[—–-]\s+(.*)", l)
            is_subitem = l.startswith("Note:") or l.startswith("a)") or l.startswith("b)") or l.startswith("c)") or l.startswith("d)")
            if m and not is_subitem and len(m.group(1).split()) <= 6:
                if curr_term:
                    defs[curr_term] = " ".join(curr_def).strip()
                curr_term = m.group(1).strip()
                curr_def = [m.group(2).strip()] if m.group(2).strip() else []
            else:
                if curr_term:
                    curr_def.append(l)

    if curr_term:
        defs[curr_term] = " ".join(curr_def).strip()

    return defs

KNOWN_TITLES = {
    "0": "Introduction",
    "1": "Scope",
    "1.1": "Scope and general application",
    "1.2": "Structural application exclusions",
    "1.3": "Preservative treatment and conditioning",
    "1.4": "Units of measurement",
    "1.5": "Mandatory language and notes",
    "2": "Reference publications",
    "3": "Definitions",
    "4": "Material requirements",
    "4.1": "General",
    "4.1.1": "Permitted commercial species",
    "4.1.2": "Classification according to fibre stresses",
    "4.1.3": "Supplier requirements and ordering information",
    "4.2": "Prohibited defects",
    "4.3": "Permitted defects",
    "4.4": "Limited defects",
    "4.4.1": "Contiguous checks, through-checks, and splits",
    "4.4.2": "Compression wood",
    "4.4.3": "Dead streaks",
    "4.4.4": "Decay in knots",
    "4.4.5": "Defective butts",
    "4.4.6": "Insect damage",
    "4.4.7": "Knot diameter",
    "4.4.8": "Scars (cat faces)",
    "4.4.8.1": "Sound scars",
    "4.4.8.2": "Bark inclusions",
    "4.4.8.3": "Mechanical damage",
    "4.4.9": "Shakes in butts",
    "4.4.10": "Shakes in tops",
    "4.4.11": "Spiral grain",
    "4.4.12": "Crooks and sweep",
    "4.4.12.1": "Short crook",
    "4.4.12.2": "Sweep",
    "4.4.12.3": "Reinforcing stubs sweep",
    "4.4.13": "Rate of growth",
    "4.4.13.1": "Douglas fir and western larch rate of growth",
    "4.4.13.2": "Southern yellow pine rate of growth",
    "4.4.13.3": "Scots pine rate of growth",
    "5": "Dimensions",
    "5.1": "Poles",
    "5.1.1": "General",
    "5.1.2": "Length",
    "5.1.3": "Circumference",
    "5.1.4": "Classification method",
    "5.2": "Reinforcing stub circumference",
    "6": "Quality of work and finish, markings, handling, storage, and inspection",
    "6.1": "Bark removal",
    "6.1.1": "Outer bark removal and inner bark limits",
    "6.1.2": "Shaving depth of cut",
    "6.2": "Sawing",
    "6.3": "Trimming",
    "6.4": "Framing",
    "6.5": "Markings",
    "6.5.1": "Butt marking",
    "6.5.2": "Side marking",
    "6.5.2.1": "Side marking location",
    "6.5.2.2": "Side marking code layout",
    "6.5.3": "Code letters for country of origin and pole species",
    "6.6": "Handling of poles and reinforcing stubs",
    "6.6.1": "Handling equipment restrictions",
    "6.6.2": "Treated pole surface protection",
    "6.6.3": "Loading irons and cant hooks restriction",
    "6.6.4": "Rough handling prohibition",
    "6.7": "Storage",
    "6.8": "Inspection",
    "A.1": "Objective",
    "A.2": "Definitions",
    "A.3": "Strength determination",
    "A.4": "Coefficient of variation",
    "A.5": "Sample exclusions",
    "A.6": "Moisture content",
    "A.7": "Additional data",
    "A.8": "Seasoning and treatment numbers",
    "A.8.1": "Seasoning method designations",
    "A.8.2": "Preservative treatment designations",
    "A.9": "References",
    "B.1": "Derivation",
    "B.1.1": "Calculation of minimum circumferences and horizontal loads",
    "B.1.2": "Cantilever groundline stress assumptions and taper calculation",
    "B.1.3": "Theoretical groundline vs above groundline maximum stress",
    "B.2": "Shrinkage",
    "C.1": "Classification",
    "C.2": "Lengths",
    "C.3": "Size determination",
    "C.4": "Shrinkage",
    "D.1": "Information to be specified",
    "D.2": "Special condition instructions",
    "E.1": "Application",
}

def parse_all_clauses():
    """Parse all normative clauses and informative annex clauses."""
    clauses = {}
    clause_list = []

    current_section = "0 Introduction"
    current_clause = None

    header_re = re.compile(
        r"^((?:Annex\s+[A-E]|[A-E]\.[0-9I]+(?:\.[0-9I]+)*|[0-9]+(?:\.[0-9]+)+|[0-9]+\s+[A-Za-z][A-Za-z\s\,\-]+))\s*(.*)$"
    )

    def normalize_table_refs(text):
        # Normalize Table A.I -> Table A.1, Table B.I -> Table B.1, etc.
        def repl(m):
            t = m.group(0)
            t = t.replace(".I", ".1").replace(".IO", ".10").replace(".II", ".11").replace(".I2", ".12").replace(".I3", ".13")
            t = t.replace(".I4", ".14").replace(".I5", ".15").replace(".I6", ".16").replace(".I7", ".17").replace(".I8", ".18").replace(".I9", ".19")
            t = re.sub(r"Table\s+I\b", "Table 1", t)
            return t
        matches = sorted(list(set(re.findall(r"Table\s+[A-E0-9\.]+", text))))
        return sorted(list(set([repl(re.match(r".*", t)) for t in matches])))

    def finalize_clause(c):
        if not c:
            return
        text = " ".join(c["raw_lines"]).strip()
        text = re.sub(r"\s+", " ", text)
        c["text"] = text
        del c["raw_lines"]

        c["tables_referenced"] = normalize_table_refs(text)

        cross = sorted(list(set(re.findall(r"Clause\s+([A-E0-9\.]+)", text))))
        cross_norm = [x.replace(".I", ".1") for x in cross]
        c["cross_references"] = sorted(list(set(cross_norm)))

        cid = c["clause_id"]
        parts = cid.split(".")
        if len(parts) > 1:
            c["parent_id"] = ".".join(parts[:-1])
        else:
            c["parent_id"] = None

        if not c["title"] and cid in KNOWN_TITLES:
            c["title"] = KNOWN_TITLES[cid]

        clauses[cid] = c
        clause_list.append(c)

    # 1. Main body pages (15 to 25)
    for p in range(15, 26):
        p_path = os.path.join(OCR_DIR, f"page_{p}.txt")
        if not os.path.exists(p_path):
            continue
        with open(p_path, "r", encoding="utf-8") as f:
            lines = clean_lines(f.readlines())

        for line in lines:
            # Check for 0 Introduction / O Introduction
            if line.startswith("O Introduction") or line.startswith("0 Introduction"):
                finalize_clause(current_clause)
                current_section = "0 Introduction"
                current_clause = {
                    "clause_id": "0",
                    "title": "Introduction",
                    "section": current_section,
                    "page_start": p,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
                continue

            # Check for top section headings
            if re.match(r"^[1-6]\s+[A-Za-z]", line) and not line.startswith("6 ft") and not line.startswith("1 ft") and not line.startswith("1 in"):
                finalize_clause(current_clause)
                current_section = line
                sec_id = line.split()[0]
                sec_title = " ".join(line.split()[1:])
                current_clause = {
                    "clause_id": sec_id,
                    "title": sec_title,
                    "section": current_section,
                    "page_start": p,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
                continue

            # Check if this line is clause 1.4 which starts with "The values given in SI units"
            if line.startswith("The values given in SI units are the units of record"):
                finalize_clause(current_clause)
                current_clause = {
                    "clause_id": "1.4",
                    "title": "Units of measurement",
                    "section": current_section,
                    "page_start": p,
                    "standard": "CSA O15-15",
                    "raw_lines": [line]
                }
                continue

            # Check if this line is a table start on page 25
            if line.startswith("Table 1") or line.startswith("Table 2"):
                finalize_clause(current_clause)
                current_clause = None
                break

            m = header_re.match(line)
            is_measurement = re.match(r"^[0-9]+(?:\.[0-9]+)*\s*(?:m|ft|in|mm|cm|kg|N|lbf|kPa|MPa|complete)", line)
            if m and not is_measurement:
                cid = m.group(1).strip()
                ctitle = m.group(2).strip()

                if "." in cid or cid in ["1", "2", "3", "4", "5", "6"]:
                    finalize_clause(current_clause)
                    current_clause = {
                        "clause_id": cid,
                        "title": ctitle if ctitle else KNOWN_TITLES.get(cid, ""),
                        "section": current_section,
                        "page_start": p,
                        "standard": "CSA O15-15",
                        "raw_lines": []
                    }
                    continue

            if current_clause:
                current_clause["raw_lines"].append(line)

    finalize_clause(current_clause)
    current_clause = None

    # 2. Annex A (pages 50 to 53)
    current_section = "Annex A (informative) Database for classification stresses"
    for p in range(50, 54):
        p_path = os.path.join(OCR_DIR, f"page_{p}.txt")
        if not os.path.exists(p_path):
            continue
        with open(p_path, "r", encoding="utf-8") as f:
            lines = clean_lines(f.readlines())

        for line in lines:
            # Avoid line wraps of 'Table A.1.'
            if line.startswith("A.I .") or line.startswith("A.1 .") or line.startswith("A.I.") or line.startswith("A.1."):
                if current_clause:
                    current_clause["raw_lines"].append(line)
                continue
            m = re.match(r"^(A\.[0-9I]+(?:\.[0-9I]+)*)\s*(.*)", line)
            if m:
                cid = m.group(1).strip().replace(".I", ".1")
                ctitle = m.group(2).strip()
                if ctitle in [".", ",", ""]:
                    ctitle = KNOWN_TITLES.get(cid, "")
                finalize_clause(current_clause)
                current_clause = {
                    "clause_id": cid,
                    "title": ctitle if ctitle else KNOWN_TITLES.get(cid, ""),
                    "section": current_section,
                    "page_start": p,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
            elif current_clause:
                current_clause["raw_lines"].append(line)

    finalize_clause(current_clause)
    current_clause = None

    # 3. Annex B (pages 63 to 64)
    current_section = "Annex B (informative) Classification procedure for poles"
    for p in range(63, 65):
        p_path = os.path.join(OCR_DIR, f"page_{p}.txt")
        if not os.path.exists(p_path):
            continue
        with open(p_path, "r", encoding="utf-8") as f:
            lines = clean_lines(f.readlines())

        for line in lines:
            if line.startswith("Table B"):
                finalize_clause(current_clause)
                current_clause = None
                break
            m = re.match(r"^(B\.[0-9I]+(?:\.[0-9I]+)*)\s*(.*)", line)
            if m:
                cid = m.group(1).strip().replace(".I", ".1")
                ctitle = m.group(2).strip()
                finalize_clause(current_clause)
                current_clause = {
                    "clause_id": cid,
                    "title": ctitle if ctitle else KNOWN_TITLES.get(cid, ""),
                    "section": current_section,
                    "page_start": p,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
            elif current_clause:
                current_clause["raw_lines"].append(line)

    finalize_clause(current_clause)
    current_clause = None

    # 4. Annex C (pages 65 to 66)
    current_section = "Annex C (informative) Classification procedure for reinforcing stubs"
    for p in range(65, 67):
        p_path = os.path.join(OCR_DIR, f"page_{p}.txt")
        if not os.path.exists(p_path):
            continue
        with open(p_path, "r", encoding="utf-8") as f:
            lines = clean_lines(f.readlines())

        for line in lines:
            if line.startswith("Table C"):
                finalize_clause(current_clause)
                current_clause = None
                break
            m = re.match(r"^(C\.[0-9I]+(?:\.[0-9I]+)*)\s*(.*)", line)
            if m:
                cid = m.group(1).strip().replace(".I", ".1")
                ctitle = m.group(2).strip()
                finalize_clause(current_clause)
                current_clause = {
                    "clause_id": cid,
                    "title": ctitle if ctitle else KNOWN_TITLES.get(cid, ""),
                    "section": current_section,
                    "page_start": p,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
            elif current_clause:
                current_clause["raw_lines"].append(line)

    finalize_clause(current_clause)
    current_clause = None

    # 5. Annex D (page 67)
    current_section = "Annex D (informative) Ordering information"
    p_path = os.path.join(OCR_DIR, "page_67.txt")
    if os.path.exists(p_path):
        with open(p_path, "r", encoding="utf-8") as f:
            lines = clean_lines(f.readlines())
        for line in lines:
            m = re.match(r"^(D\.[0-9I]+(?:\.[0-9I]+)*)\s*(.*)", line)
            if m:
                cid = m.group(1).strip().replace(".I", ".1")
                ctitle = m.group(2).strip()
                finalize_clause(current_clause)
                current_clause = {
                    "clause_id": cid,
                    "title": ctitle if ctitle else KNOWN_TITLES.get(cid, ""),
                    "section": current_section,
                    "page_start": 67,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
            elif current_clause:
                current_clause["raw_lines"].append(line)

    finalize_clause(current_clause)
    current_clause = None

    # 6. Annex E (page 68)
    current_section = "Annex E (informative) SI (metric) versions of Tables 1 to 23"
    p_path = os.path.join(OCR_DIR, "page_68.txt")
    if os.path.exists(p_path):
        with open(p_path, "r", encoding="utf-8") as f:
            lines = clean_lines(f.readlines())
        for line in lines:
            if line.startswith("Table E.1") or line.startswith("Table E.I"):
                finalize_clause(current_clause)
                current_clause = None
                break
            m = re.match(r"^(E\.[0-9I]+(?:\.[0-9I]+)*)\s*(.*)", line)
            if m:
                cid = m.group(1).strip().replace(".I", ".1")
                ctitle = m.group(2).strip()
                finalize_clause(current_clause)
                current_clause = {
                    "clause_id": cid,
                    "title": ctitle if ctitle else KNOWN_TITLES.get(cid, ""),
                    "section": current_section,
                    "page_start": 68,
                    "standard": "CSA O15-15",
                    "raw_lines": []
                }
            elif current_clause:
                current_clause["raw_lines"].append(line)

    finalize_clause(current_clause)

    return clauses, clause_list

def parse_all_tables():
    """Extract and compile all normative and informative tables."""
    tables = {}

    table_meta = [
        # Normative Tables (Imperial)
        {"id": "Table 1", "title": "Maximum knot sizes", "pages": [25]},
        {"id": "Table 2", "title": "Maximum spiral grain", "pages": [25]},
        {"id": "Table 3", "title": "Strength and stiffness properties by species", "pages": [26, 27, 28]},
        {"id": "Table 4", "title": "Dimensions of eastern white cedar poles (fibre stress 3700 psi)", "pages": [29]},
        {"id": "Table 5", "title": "Dimensions of spruce and eastern white pine poles (fibre stress 4900 psi)", "pages": [30]},
        {"id": "Table 6", "title": "Dimensions of amabilis fir poles (fibre stress 5400 psi)", "pages": [31, 32]},
        {"id": "Table 7", "title": "Dimensions of western red cedar and ponderosa pine poles (fibre stress 5600 psi)", "pages": [33, 34]},
        {"id": "Table 8", "title": "Dimensions of red pine poles (fibre stress 6000 psi)", "pages": [35]},
        {"id": "Table 9", "title": "Dimensions of jack pine poles (fibre stress 6400 psi)", "pages": [36]},
        {"id": "Table 10", "title": "Dimensions of yellow cedar and lodgepole pine poles (fibre stress 6600 psi)", "pages": [37, 38]},
        {"id": "Table 11", "title": "Dimensions of western hemlock and interior Douglas fir poles (fibre stress 6800 psi)", "pages": [39, 40]},
        {"id": "Table 12", "title": "Dimensions of southern yellow and Scots pine poles (fibre stress 7800 psi)", "pages": [41]},
        {"id": "Table 13", "title": "Dimensions of western larch and coastal Douglas fir poles (fibre stress 8000 psi)", "pages": [42, 43]},
        {"id": "Table 14", "title": "Dimensions of eastern white cedar reinforcing stubs (fibre stress 3700 psi)", "pages": [44]},
        {"id": "Table 15", "title": "Dimensions of spruce and eastern white pine reinforcing stubs (fibre stress 4900 psi)", "pages": [44]},
        {"id": "Table 16", "title": "Dimensions of amabilis fir reinforcing stubs (fibre stress 5400 psi)", "pages": [44]},
        {"id": "Table 17", "title": "Dimensions of western red cedar and ponderosa pine reinforcing stubs (fibre stress 5600 psi)", "pages": [45]},
        {"id": "Table 18", "title": "Dimensions of red pine reinforcing stubs (fibre stress 6000 psi)", "pages": [45]},
        {"id": "Table 19", "title": "Dimensions of jack pine reinforcing stubs (fibre stress 6400 psi)", "pages": [45]},
        {"id": "Table 20", "title": "Dimensions of yellow cedar and lodgepole pine reinforcing stubs (fibre stress 6600 psi)", "pages": [46]},
        {"id": "Table 21", "title": "Dimensions of western hemlock and interior Douglas fir reinforcing stubs (fibre stress 6800 psi)", "pages": [46]},
        {"id": "Table 22", "title": "Dimensions of southern yellow and Scots pine reinforcing stubs (fibre stress 7800 psi)", "pages": [46]},
        {"id": "Table 23", "title": "Dimensions of western larch and coastal Douglas fir reinforcing stubs (fibre stress 8000 psi)", "pages": [47]},
        
        # Informative Tables
        {"id": "Table A.1", "title": "Summary of full-size wood pole test data", "pages": [54, 55, 56, 57, 58, 59, 60]},
        {"id": "Table A.2", "title": "Source of data in Table A.1", "pages": [61, 62]},
        {"id": "Table B.1", "title": "Horizontal loads for standard classes of wood utility poles", "pages": [64]},
        {"id": "Table C.1", "title": "Standard classes of reinforcing stubs", "pages": [65]},
        
        # Annex E SI Metric Tables
        {"id": "Table E.1", "title": "Maximum knot sizes (metric)", "pages": [68]},
        {"id": "Table E.2", "title": "Maximum spiral grain (metric)", "pages": [69]},
        {"id": "Table E.3", "title": "Strength and stiffness properties by species (metric)", "pages": [70, 71, 72]},
        {"id": "Table E.4", "title": "Dimensions of eastern white cedar poles (fibre stress 26 MPa)", "pages": [73]},
        {"id": "Table E.5", "title": "Dimensions of spruce and eastern white pine poles (fibre stress 34 MPa)", "pages": [74]},
        {"id": "Table E.6", "title": "Dimensions of amabilis fir poles (fibre stress 37 MPa)", "pages": [75, 76]},
        {"id": "Table E.7", "title": "Dimensions of western red cedar and ponderosa pine poles (fibre stress 39 MPa)", "pages": [77, 78]},
        {"id": "Table E.8", "title": "Dimensions of red pine poles (fibre stress 41 MPa)", "pages": [79]},
        {"id": "Table E.9", "title": "Dimensions of jack pine poles (fibre stress 44 MPa)", "pages": [80]},
        {"id": "Table E.10", "title": "Dimensions of yellow cedar and lodgepole pine poles (fibre stress 46 MPa)", "pages": [81, 82]},
        {"id": "Table E.11", "title": "Dimensions of western hemlock and interior Douglas fir poles (fibre stress 47 MPa)", "pages": [83, 84]},
        {"id": "Table E.12", "title": "Dimensions of southern yellow and Scots pine poles (fibre stress 54 MPa)", "pages": [85]},
        {"id": "Table E.13", "title": "Dimensions of western larch and coastal Douglas fir poles (fibre stress 55 MPa)", "pages": [86, 87]},
        {"id": "Table E.14", "title": "Dimensions of eastern white cedar reinforcing stubs (fibre stress 26 MPa)", "pages": [88]},
        {"id": "Table E.15", "title": "Dimensions of spruce and eastern white pine reinforcing stubs (fibre stress 34 MPa)", "pages": [88]},
        {"id": "Table E.16", "title": "Dimensions of amabilis fir reinforcing stubs (fibre stress 37 MPa)", "pages": [88]},
        {"id": "Table E.17", "title": "Dimensions of western red cedar and ponderosa pine reinforcing stubs (fibre stress 39 MPa)", "pages": [89]},
        {"id": "Table E.18", "title": "Dimensions of red pine reinforcing stubs (fibre stress 41 MPa)", "pages": [89]},
        {"id": "Table E.19", "title": "Dimensions of jack pine reinforcing stubs (fibre stress 44 MPa)", "pages": [89]},
        {"id": "Table E.20", "title": "Dimensions of yellow cedar and lodgepole pine reinforcing stubs (fibre stress 46 MPa)", "pages": [90]},
        {"id": "Table E.21", "title": "Dimensions of western hemlock and interior Douglas fir reinforcing stubs (fibre stress 47 MPa)", "pages": [90]},
        {"id": "Table E.22", "title": "Dimensions of southern yellow and Scots pine reinforcing stubs (fibre stress 54 MPa)", "pages": [90]},
        {"id": "Table E.23", "title": "Dimensions of western larch and coastal Douglas fir reinforcing stubs (fibre stress 55 MPa)", "pages": [91]},
    ]

    for tm in table_meta:
        tid = tm["id"]
        tlines = []
        for p in tm["pages"]:
            p_path = os.path.join(OCR_DIR, f"page_{p}.txt")
            if os.path.exists(p_path):
                with open(p_path, "r", encoding="utf-8") as f:
                    tlines.extend(clean_lines(f.readlines()))
        tables[tid] = {
            "table_id": tid,
            "title": tm["title"],
            "page_start": tm["pages"][0],
            "pages": tm["pages"],
            "text": "\n".join(tlines)
        }

    return tables

def main():
    print("Parsing CSA O15-15...")
    defs = parse_definitions()
    print(f"Definitions extracted: {len(defs)}")

    clauses, clause_list = parse_all_clauses()
    print(f"Clauses extracted: {len(clauses)}")

    tables = parse_all_tables()
    print(f"Tables extracted: {len(tables)}")

    data = {
        "standard": "CSA O15-15",
        "title": "Wood utility poles and reinforcing stubs",
        "edition": "2015 (Approved February 2016, Update No. 1 June 2016)",
        "total_clauses": len(clauses),
        "total_tables": len(tables),
        "total_definitions": len(defs),
        "definitions": defs,
        "tables": tables,
        "clauses": clauses,
        "clause_list": clause_list
    }

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(clauses)} clauses, {len(tables)} tables, and {len(defs)} definitions to {OUT_JSON}")

if __name__ == "__main__":
    main()
