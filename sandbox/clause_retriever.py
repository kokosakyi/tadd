"""
Clause Retriever Utility for CSA Standards:
  - CSA C22.3 No 1-15 (Overhead Systems)
  - CSA C22.3 No 60826-10 (Overhead Transmission Lines)
  - CSA O15-15 (Wood Utility Poles and Reinforcing Stubs)

Usage examples:
    python sandbox/clause_retriever.py 1 5.3.1.1
    python sandbox/clause_retriever.py 60826 6.3.4.1
    python sandbox/clause_retriever.py o15 4.4.7
    python sandbox/clause_retriever.py o15 "Table 3"
    python sandbox/clause_retriever.py search "knot diameter"
    python sandbox/clause_retriever.py search "radial thickness"
"""

import os
import json
import re
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_NO1 = os.path.join(BASE_DIR, "csa_c22_1_clauses.json")
FILE_60826 = os.path.join(BASE_DIR, "csa_60826_clauses.json")
FILE_O15 = os.path.join(BASE_DIR, "csa_o15_clauses.json")

class StandardStore:
    def __init__(self, json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    def get_clause(self, clause_id):
        return self.data.get("clauses", {}).get(str(clause_id))

    def get_table(self, table_id):
        tabs = self.data.get("tables", {})
        if str(table_id) in tabs:
            return tabs[str(table_id)]
        q = str(table_id).lower()
        for k, v in tabs.items():
            if q in k.lower():
                return v
        return None

    def get_definition(self, term_or_id):
        defs = self.data.get("definitions", {})
        if str(term_or_id) in defs:
            return defs[str(term_or_id)]
        term_lower = str(term_or_id).lower()
        for k, v in defs.items():
            if term_lower in k.lower():
                return {k: v}
        return None

    def search(self, query):
        q = query.lower()
        results = []
        for cid, cdata in self.data.get("clauses", {}).items():
            title = cdata.get("title", "")
            text = cdata.get("text", "")
            can_dev = cdata.get("canadian_deviation") or ""
            if q in title.lower() or q in text.lower() or q in can_dev.lower():
                results.append({
                    "clause_id": cid,
                    "title": title,
                    "section": cdata.get("section", ""),
                    "page_start": cdata.get("page_start"),
                    "has_canadian_deviation": bool(can_dev),
                    "snippet": text[:200] + "..." if len(text) > 200 else text
                })
        return results

def get_store(standard_name):
    s = str(standard_name).lower().strip()
    if "o15" in s or "015" in s or "pole" in s:
        return StandardStore(FILE_O15)
    elif "1" in s and "60826" not in s:
        return StandardStore(FILE_NO1)
    elif "60826" in s:
        return StandardStore(FILE_60826)
    else:
        raise ValueError(f"Unknown standard: {standard_name}. Choose '1', '60826', or 'O15'")

def cli():
    if len(sys.argv) < 3:
        print("Usage: python clause_retriever.py <1|60826|o15|search> <clause_id|table_id|query>")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    arg = sys.argv[2]

    if cmd == "search":
        print(f"=== Searching '{arg}' across CSA C22.3 No. 1, No. 60826, and O15 ===")
        if os.path.exists(FILE_NO1):
            s1 = StandardStore(FILE_NO1)
            r1 = s1.search(arg)
            print(f"\n[CSA C22.3 No 1-15: {len(r1)} matches]")
            for res in r1[:5]:
                print(f" - Clause {res['clause_id']}: {res['title']} (p.{res['page_start']})")

        if os.path.exists(FILE_60826):
            s60826 = StandardStore(FILE_60826)
            r60826 = s60826.search(arg)
            print(f"\n[CSA C22.3 No 60826-10: {len(r60826)} matches]")
            for res in r60826[:5]:
                dev_flag = " [Includes Canadian Deviation]" if res['has_canadian_deviation'] else ""
                print(f" - Clause {res['clause_id']}: {res['title']} (p.{res['page_start']}){dev_flag}")

        if os.path.exists(FILE_O15):
            so15 = StandardStore(FILE_O15)
            ro15 = so15.search(arg)
            print(f"\n[CSA O15-15: {len(ro15)} matches]")
            for res in ro15[:5]:
                print(f" - Clause {res['clause_id']}: {res['title']} (p.{res['page_start']})")

    else:
        store = get_store(cmd)
        
        # Check if arg is a table query
        if arg.lower().startswith("table"):
            tbl = store.get_table(arg)
            if tbl:
                print(f"\n=== Standard: {store.data.get('standard')} ===")
                print(f"Table: {tbl.get('table_id')} - {tbl.get('title')}")
                print(f"Page Start: {tbl.get('page_start')}")
                print("\n--- Table Text Preview ---")
                text = tbl.get("text", "")
                preview = text[:800] + "\n..." if len(text) > 800 else text
                print(preview)
                return
            else:
                print(f"Table '{arg}' not found in standard '{cmd}'")
                return

        clause = store.get_clause(arg)
        if clause:
            print(f"\n=== Standard: {clause.get('standard')} ===")
            print(f"Clause: {clause.get('clause_id')} - {clause.get('title')}")
            print(f"Section: {clause.get('section')}")
            print(f"Page Start: {clause.get('page_start')}")
            if clause.get("tables_referenced"):
                print(f"Tables Referenced: {', '.join(clause['tables_referenced'])}")
            if clause.get("cross_references"):
                print(f"Cross References: {', '.join(clause['cross_references'])}")
            print("\n--- Clause Text ---")
            print(clause.get("text"))
            if clause.get("canadian_deviation"):
                print("\n--- Canadian Deviation ---")
                print(clause.get("canadian_deviation"))
        else:
            # Check definition
            d = store.get_definition(arg)
            if d:
                print(f"\n=== Definition from {store.data.get('standard')} ===")
                if isinstance(d, dict):
                    for k, v in d.items():
                        print(f"{k}: {v}")
                else:
                    print(f"{arg}: {d}")
            else:
                print(f"Clause or term '{arg}' not found in standard '{cmd}'")

if __name__ == "__main__":
    cli()
