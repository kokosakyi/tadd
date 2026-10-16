import pypdf
import re
import json

def clean_lines(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        if 'C22.3 No. 1-15 Overhead systems' in l:
            continue
        if re.search(r'June 2015\s+©\s+2015 CSA Group\s+\d+', l):
            continue
        if 'Licensed for/Autorisé' in l or 'Single user license only' in l or 'Le stockage, la distribution' in l:
            continue
        cleaned.append(l)
    return cleaned

def parse_definitions(reader):
    lines = []
    for p in range(21, 28):
        lines.extend(clean_lines(reader.pages[p].extract_text()))

    defs = {}
    abbrevs = {}
    curr_term = None
    curr_def = []
    mode = 'defs'

    for line in lines:
        if line.startswith('3.2 Abbreviations'):
            if curr_term:
                defs[curr_term] = ' '.join(curr_def)
                curr_term = None
                curr_def = []
            mode = 'abbrevs'
            continue
        if line.startswith('3 Definitions') or line.startswith('3.1 Definitions') or line.startswith('The following definitions'):
            continue
        if line.startswith('The following abbreviations'):
            continue
        if line.startswith('4 General'):
            break

        if mode == 'defs':
            m = re.match(r'^([A-Za-z0-9\(\)\/\s\-\–\,\.\'\"]+?)\s*[—\–\-]\s*(.*)', line)
            is_subitem = line.startswith('a)') or line.startswith('b)') or line.startswith('c)') or line.startswith('d)') or line.startswith('Note:') or line.startswith('Caution:')
            if m and not is_subitem:
                if curr_term:
                    defs[curr_term] = ' '.join(curr_def)
                curr_term = m.group(1).strip()
                curr_def = [m.group(2).strip()]
            else:
                if curr_term:
                    curr_def.append(line)
        elif mode == 'abbrevs':
            m = re.match(r'^([A-Za-z0-9\/\-]+)\s*[—\–\-]\s*(.*)', line)
            if m:
                if curr_term:
                    abbrevs[curr_term] = ' '.join(curr_def)
                curr_term = m.group(1).strip()
                curr_def = [m.group(2).strip()]
            else:
                if curr_term:
                    curr_def.append(line)

    if curr_term:
        if mode == 'defs':
            defs[curr_term] = ' '.join(curr_def)
        else:
            abbrevs[curr_term] = ' '.join(curr_def)

    return defs, abbrevs

def parse_csa_c22_1():
    reader = pypdf.PdfReader('sandbox/csa c22 no 1/CSA C22.3 NO 1-15 Overhead Systems 2015.pdf')
    defs, abbrevs = parse_definitions(reader)
    print(f"Definitions extracted: {len(defs)}")
    print(f"Abbreviations extracted: {len(abbrevs)}")

    # Extract outline titles
    outline_titles = {}
    def recurse_outline(node):
        if isinstance(node, list):
            for c in node:
                recurse_outline(c)
        else:
            t = node.title.strip()
            m = re.match(r'^((?:Annex\s+[A-E]|[A-E]\.\d+(?:\.\d+)*|\d+(?:\.\d+)*))\s*(.*)', t)
            if m:
                cid = m.group(1).strip()
                ctitle = m.group(2).strip()
                if cid and ctitle:
                    outline_titles[cid] = ctitle
    recurse_outline(reader.outline)

    # Process all clauses in Main Normative Clauses (p.17-80) and Annexes (p.113-190)
    clauses = {}
    clause_list = []

    # Section tracker
    current_section = "1 Scope"

    # Regex for clause headers
    # e.g., 1 Scope, 1.1, 4.6.2 Communication..., 4.6.2.1 General, Annex A, A.1 Scope, A.1.2
    header_re = re.compile(r'^((?:Annex\s+[A-E]|[A-E](?:\.\d+)+|\d+(?:\.\d+)+))\s*(.*)$')
    top_section_re = re.compile(r'^(\d+)\s+([A-Za-z].*)$')

    current_clause = None

    def finalize_clause(c):
        if not c:
            return
        text = ' '.join(c['raw_lines']).strip()
        # Clean double spaces
        text = re.sub(r'\s+', ' ', text)
        c['text'] = text
        del c['raw_lines']

        # Extract referenced tables
        c['tables_referenced'] = sorted(list(set(re.findall(r'Table\s+[A-Z0-9\.]+', text))))
        # Extract cross referenced clauses
        cross_refs = set(re.findall(r'Clause\s+([A-E0-9\.]+)', text))
        c['cross_references'] = sorted(list(cross_refs))

        # Hierarchy
        cid = c['clause_id']
        parts = cid.split('.')
        if len(parts) > 1:
            c['parent_id'] = '.'.join(parts[:-1])
        else:
            c['parent_id'] = None

        clauses[cid] = c
        clause_list.append(c)

    # 1. Main body (Clauses 1 to 10)
    for p_idx in range(17, 81):
        page_num = p_idx + 1
        lines = clean_lines(reader.pages[p_idx].extract_text())

        for line in lines:
            # Check for top section heading like '5 Clearances, separations, and spacings'
            m_sec = top_section_re.match(line)
            if m_sec and int(m_sec.group(1)) <= 10:
                current_section = f"{m_sec.group(1)} {m_sec.group(2)}"

            m_head = header_re.match(line)
            if m_head:
                cid = m_head.group(1).strip()
                ctitle = m_head.group(2).strip()

                # If ctitle is empty, see if outline has it
                if not ctitle and cid in outline_titles:
                    ctitle = outline_titles[cid]

                finalize_clause(current_clause)
                current_clause = {
                    'clause_id': cid,
                    'title': ctitle,
                    'section': current_section,
                    'page_start': page_num,
                    'standard': 'CSA C22.3 No. 1-15',
                    'raw_lines': []
                }
            else:
                if current_clause:
                    current_clause['raw_lines'].append(line)

    finalize_clause(current_clause)
    current_clause = None

    # 2. Annexes (p.113 to 190)
    annex_header_re = re.compile(r'^((?:Annex\s+[A-E]|[A-E]\.\d+(?:\.\d+)*))\s*(.*)$')
    for p_idx in range(113, 191):
        page_num = p_idx + 1
        lines = clean_lines(reader.pages[p_idx].extract_text())

        for line in lines:
            if line.startswith('Annex '):
                current_section = line

            m_head = annex_header_re.match(line)
            if m_head:
                cid = m_head.group(1).strip()
                ctitle = m_head.group(2).strip()

                if not ctitle and cid in outline_titles:
                    ctitle = outline_titles[cid]

                finalize_clause(current_clause)
                current_clause = {
                    'clause_id': cid,
                    'title': ctitle,
                    'section': current_section,
                    'page_start': page_num,
                    'standard': 'CSA C22.3 No. 1-15',
                    'raw_lines': []
                }
            else:
                if current_clause:
                    current_clause['raw_lines'].append(line)

    finalize_clause(current_clause)

    # 3. Extract Tables
    tables = {}
    current_table = None
    for p_idx in range(80, 113):
        page_num = p_idx + 1
        lines = clean_lines(reader.pages[p_idx].extract_text())
        for line in lines:
            m_tab = re.match(r'^(Table\s+\d+[A-Z]?)\s*(.*)', line)
            if m_tab and 'Concluded' not in line:
                t_id = m_tab.group(1).strip()
                t_title = m_tab.group(2).strip()
                if t_id not in tables:
                    tables[t_id] = {
                        'table_id': t_id,
                        'title': t_title,
                        'page_start': page_num,
                        'lines': []
                    }
                current_table = tables[t_id]
            else:
                if current_table:
                    current_table['lines'].append(line)

    for tid, tdata in tables.items():
        tdata['text'] = '\n'.join(tdata['lines'])
        del tdata['lines']

    # Build final structured dict
    data = {
        'standard': 'CSA C22.3 No. 1-15',
        'title': 'Overhead Systems',
        'edition': '2015',
        'total_clauses': len(clauses),
        'total_tables': len(tables),
        'total_definitions': len(defs),
        'total_abbreviations': len(abbrevs),
        'definitions': defs,
        'abbreviations': abbrevs,
        'tables': tables,
        'clauses': clauses,
        'clause_list': clause_list
    }

    out_path = 'sandbox/csa_c22_1_clauses.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(clauses)} clauses and {len(tables)} tables to {out_path}")

if __name__ == '__main__':
    parse_csa_c22_1()
