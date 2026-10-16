import pypdf
import re
import json

def clean_canadian_lines(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        if re.search(r'CAN/CSA-C22\.3\s+No\.\s+60826-10', l):
            continue
        if re.search(r'CSA/\d+\s+©\s+Canadian Standards Association', l) or re.search(r'December 2010\s+©\s+Canadian Standards Association', l):
            continue
        if 'Licensed for/Autorisé' in l or 'Single user license only' in l or 'Le stockage, la distribution' in l:
            continue
        cleaned.append(l)
    return cleaned

def clean_iec_lines(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        if re.search(r'60826\s+\s+IEC:2003', l) or re.search(r'CAN/CSA-C22\.3\s+No\.\s+60826-10', l):
            continue
        if 'Licensed for/Autorisé' in l or 'Single user license only' in l or 'Le stockage, la distribution' in l:
            continue
        cleaned.append(l)
    return cleaned

def parse_canadian_deviations(reader):
    lines = []
    for p in range(11, 18):
        lines.extend(clean_canadian_lines(reader.pages[p].extract_text()))

    dev_clauses = {}
    curr_id = None
    curr_lines = []
    dev_head_re = re.compile(r'^(\d+(?:\.\d+)*[A-Z]?)\s*(.*)$')

    for l in lines:
        m = dev_head_re.match(l)
        if m and not l.startswith('10 m above ground') and not l.startswith('60%'):
            cid = m.group(1).strip()
            ctitle = m.group(2).strip()
            if curr_id:
                dev_clauses[curr_id] = '\n'.join(curr_lines).strip()
            curr_id = cid
            curr_lines = []
            if ctitle:
                curr_lines.append(ctitle)
        else:
            if curr_id:
                curr_lines.append(l)

    if curr_id:
        dev_clauses[curr_id] = '\n'.join(curr_lines).strip()

    return dev_clauses

def parse_canadian_annexes(reader):
    # Annex CA (p. 18 to 49) and Annex CB (p. 50 to 57)
    annexes = {}
    
    # Process CA
    ca_lines = []
    for p in range(18, 50):
        ca_lines.extend(clean_canadian_lines(reader.pages[p].extract_text()))
    
    # Split into subclauses CA.1, CA.2, etc.
    ca_clauses = {}
    curr_id = 'Annex CA'
    curr_lines = []
    ca_head_re = re.compile(r'^(CA\.\d+)\s*(.*)$')

    for l in ca_lines:
        m = ca_head_re.match(l)
        if m:
            if curr_id:
                ca_clauses[curr_id] = '\n'.join(curr_lines).strip()
            curr_id = m.group(1).strip()
            curr_lines = [m.group(2).strip()] if m.group(2).strip() else []
        else:
            curr_lines.append(l)
    if curr_id:
        ca_clauses[curr_id] = '\n'.join(curr_lines).strip()

    annexes['CA'] = {
        'annex_id': 'Annex CA',
        'title': 'Canadian wind, ice, and temperature data and examples',
        'page_start': 19,
        'clauses': ca_clauses
    }

    # Process CB
    cb_lines = []
    for p in range(50, 58):
        cb_lines.extend(clean_canadian_lines(reader.pages[p].extract_text()))

    cb_clauses = {}
    curr_id = 'Annex CB'
    curr_lines = []
    cb_head_re = re.compile(r'^(CB\.\d+)\s*(.*)$')

    for l in cb_lines:
        m = cb_head_re.match(l)
        if m:
            if curr_id:
                cb_clauses[curr_id] = '\n'.join(curr_lines).strip()
            curr_id = m.group(1).strip()
            curr_lines = [m.group(2).strip()] if m.group(2).strip() else []
        else:
            curr_lines.append(l)
    if curr_id:
        cb_clauses[curr_id] = '\n'.join(curr_lines).strip()

    annexes['CB'] = {
        'annex_id': 'Annex CB',
        'title': 'Example calculations of wind and ice loads according to CAN/CSA-C22.3 No. 60826 — Simplified version for distribution poles',
        'page_start': 51,
        'clauses': cb_clauses
    }

    return annexes

def parse_csa_60826():
    reader = pypdf.PdfReader('sandbox/csa c22 no 1/CSA C22.3 NO 60826-10 (R2015) Overhead Transmission Lines 2015.pdf')
    canadian_deviations = parse_canadian_deviations(reader)
    canadian_annexes = parse_canadian_annexes(reader)
    print(f"Canadian Deviations parsed: {len(canadian_deviations)}")
    print(f"Canadian Annexes parsed: {len(canadian_annexes)}")

    # Extract English outline titles
    outline_titles = {}
    def recurse_outline(node):
        if isinstance(node, list):
            for c in node:
                recurse_outline(c)
        else:
            t = node.title.strip()
            m = re.match(r'^((?:Annex\s+[A-C]|[A-C]\.\d+(?:\.\d+)*|\d+(?:\.\d+)*))\s*(.*)', t)
            if m:
                cid = m.group(1).strip()
                ctitle = m.group(2).strip()
                if cid and ctitle:
                    outline_titles[cid] = ctitle
    recurse_outline(reader.outline)

    # Table of contents titles from pages 114, 116
    for p in range(114, 118, 2):
        for line in reader.pages[p].extract_text().split('\n'):
            line = line.strip()
            m = re.match(r'^([A-C]\.\d+(?:\.\d+)*|\d+(?:\.\d+)*)\s+(.*?)\s*\.{3,}\s*(\d+)$', line)
            if m:
                cid = m.group(1).strip()
                ctitle = re.sub(r'\s+', ' ', m.group(2).strip())
                if cid not in outline_titles or not outline_titles[cid]:
                    outline_titles[cid] = ctitle

    clauses = {}
    clause_list = []
    current_clause = None
    current_section = "1 Scope"

    clause_header_re = re.compile(r'^((?:Annex\s+[A-C]|[A-C]\.\d+(?:\.\d+)*|\d+(?:\.\d+)+))\s*(.*)$')
    top_sec_re = re.compile(r'^(\d+)\s+([A-Za-z].*)$')

    def finalize_clause(c):
        if not c:
            return
        text = ' '.join(c['raw_lines']).strip()
        text = re.sub(r'\s+', ' ', text)
        c['text'] = text
        del c['raw_lines']

        # Cross references & Tables
        c['tables_referenced'] = sorted(list(set(re.findall(r'Table\s+[A-Z0-9\.]+', text))))
        c['cross_references'] = sorted(list(set(re.findall(r'Clause\s+([A-C0-9\.]+)|subclause\s+([A-C0-9\.]+)', text))))
        c['cross_references'] = [ref[0] or ref[1] for ref in c['cross_references'] if ref[0] or ref[1]]

        # Canadian deviation link
        cid = c['clause_id']
        if cid in canadian_deviations:
            c['canadian_deviation'] = canadian_deviations[cid]
        else:
            c['canadian_deviation'] = None

        # Parent hierarchy
        parts = cid.replace('Annex ', '').split('.')
        if len(parts) > 1:
            c['parent_id'] = '.'.join(parts[:-1])
        else:
            c['parent_id'] = None

        clauses[cid] = c
        clause_list.append(c)

    # Process English Base pages (even pages 126 to 354)
    for p in range(126, 355, 2):
        page_num = p + 1
        lines = clean_iec_lines(reader.pages[p].extract_text())

        for line in lines:
            m_sec = top_sec_re.match(line)
            if m_sec and int(m_sec.group(1)) <= 7:
                current_section = f"{m_sec.group(1)} {m_sec.group(2)}"
            elif line.startswith('Annex '):
                current_section = line

            m_head = clause_header_re.match(line)
            if m_head:
                cid = m_head.group(1).strip()
                ctitle = m_head.group(2).strip()

                # Filter out numbers from formulas or decimals
                parts = cid.replace('Annex ', '').split('.')
                if len(parts) >= 2 and all(pt.isalnum() for pt in parts):
                    if not ctitle and cid in outline_titles:
                        ctitle = outline_titles[cid]

                    finalize_clause(current_clause)
                    current_clause = {
                        'clause_id': cid,
                        'title': ctitle,
                        'section': current_section,
                        'page_start': page_num,
                        'standard': 'CSA C22.3 No. 60826-10 / IEC 60826:2003',
                        'raw_lines': []
                    }
                else:
                    if current_clause:
                        current_clause['raw_lines'].append(line)
            else:
                if current_clause:
                    current_clause['raw_lines'].append(line)

    finalize_clause(current_clause)

    # Definitions from 3.1
    definitions = {}
    for cid, cdata in clauses.items():
        if cid.startswith('3.1.'):
            # The title or first lines contain the term
            term_match = re.match(r'^(.*?)(?:NOTE|$)', cdata['text'])
            term_text = term_match.group(1).strip() if term_match else cdata['text']
            definitions[cid] = {
                'clause_id': cid,
                'title': cdata.get('title', ''),
                'definition': term_text,
                'canadian_deviation': cdata.get('canadian_deviation')
            }

    data = {
        'standard': 'CSA C22.3 No. 60826-10 (R2015)',
        'iec_reference': 'IEC 60826:2003',
        'title': 'Design criteria of overhead transmission lines',
        'edition': '2010 (Reaffirmed 2015)',
        'total_clauses': len(clauses),
        'total_canadian_deviations': len(canadian_deviations),
        'total_definitions': len(definitions),
        'canadian_deviations': canadian_deviations,
        'canadian_annexes': canadian_annexes,
        'definitions': definitions,
        'clauses': clauses,
        'clause_list': clause_list
    }

    out_path = 'sandbox/csa_60826_clauses.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(clauses)} clauses and {len(canadian_deviations)} Canadian deviations to {out_path}")

if __name__ == '__main__':
    parse_csa_60826()
