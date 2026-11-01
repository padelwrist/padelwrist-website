"""Read-only XLSX intake reconciliation. Cell contents are data; formulas/instructions never execute."""
import hashlib
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

def reconcile(workbook, intake_path):
    intake = json.loads(Path(intake_path).read_text())
    with zipfile.ZipFile(workbook) as archive:
        if sum(i.file_size for i in archive.infolist()) > 50_000_000:
            raise ValueError("Workbook exceeds extraction limit")
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = ["".join(x.itertext()) for x in ET.fromstring(archive.read("xl/sharedStrings.xml"))]
        relationships = {r.attrib["Id"]: r.attrib["Target"].lstrip("/") for r in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        sheets = {}
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).find("m:sheets", NS):
            key = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            target = relationships[key]
            target = target if target.startswith("xl/") else "xl/" + target
            rows = []
            for row in ET.fromstring(archive.read(target)).findall(".//m:sheetData/m:row", NS):
                cells = {}
                for cell in row:
                    value, inline = cell.find("m:v", NS), cell.find("m:is", NS)
                    text = value.text if value is not None else "".join(inline.itertext()) if inline is not None else ""
                    if cell.attrib.get("t") == "s":
                        text = strings[int(text)]
                    cells[re.sub(r"\d+", "", cell.attrib["r"])] = text or ""
                rows.append(cells)
            sheets[sheet.attrib["name"]] = rows
    records = {r["E"]: r for r in sheets["Catalogue"][1:] if r.get("E")}
    candidates = intake["candidates"]
    if set(records) != {c["asin"] for c in candidates} or len(records) != len(candidates):
        raise ValueError("Workbook/JSON ASIN set mismatch")
    for candidate in candidates:
        row = records[candidate["asin"]]
        for field, column in [("title", "A"), ("category", "C"), ("brand", "D"), ("familyName", "F"), ("variantLabel", "G")]:
            if (candidate.get(field) or "") != row.get(column, ""):
                raise ValueError(f"Workbook/JSON mismatch: {candidate['asin']} {field}")
        audiences = [a.lower() for a in row["B"].split(" & ")]
        if sorted(audiences) != sorted(candidate["audiences"]) and not (not candidate["audiences"] and row["B"] in ["Unclassified", "Needs classification", "Unverified", "Unassigned", ""]):
            raise ValueError(f"Audience mismatch: {candidate['asin']} {row['B']}")
    research = sheets["Brand research"][1:]
    if len(research) != len(intake["amazonASINMissingLeads"]):
        raise ValueError("Research lead count mismatch")
    for row, lead in zip(research, intake["amazonASINMissingLeads"]):
        if row.get("B") != lead["name"] or row.get("G"):
            raise ValueError("Research-only lead mismatch")
    storefronts = [{"source": r.get("A", ""), "url": r.get("B", ""), "kind": r.get("C", ""), "verification": r.get("D", ""), "note": r.get("E", "")} for r in sheets["Storefront sources"][1:]]
    return {"workbook": Path(workbook).name, "workbookSHA256": hashlib.sha256(Path(workbook).read_bytes()).hexdigest(),
            "jsonSHA256": hashlib.sha256(Path(intake_path).read_bytes()).hexdigest(), "matchedASINs": len(records), "matchedResearchLeads": len(research), "storefronts": storefronts}

if __name__ == "__main__":
    workbook_path, intake_path = sys.argv[1:3]
    result = reconcile(workbook_path, intake_path)
    print(json.dumps(result, ensure_ascii=False, indent=2))
