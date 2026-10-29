from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://padelwrist.com/"
VOID = {"br", "img", "input", "meta", "link", "source", "hr"}
SKIP = {"script", "style", "nav", "svg", "picture", "button", "form"}

class Converter(HTMLParser):
    def __init__(self, base):
        super().__init__(convert_charrefs=True)
        self.base, self.active, self.hidden, self.parts = base, False, 0, []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.active = True
            return
        if not self.active:
            return
        if self.hidden:
            if tag not in VOID:
                self.hidden += 1
            return
        if tag in SKIP or attrs.get("aria-hidden") == "true":
            self.hidden = 1
        elif re.fullmatch(r"h[1-6]", tag):
            self.parts.append("\n\n" + "#" * int(tag[1]) + " ")
        elif tag in {"p", "blockquote"}:
            self.parts.append("\n\n")
        elif tag == "li":
            self.parts.append("\n- ")
        elif tag in {"br", "hr"}:
            self.parts.append("\n")
        elif tag in {"strong", "b"}:
            self.parts.append("**")
        elif tag in {"em", "i"}:
            self.parts.append("*")
        elif tag == "a":
            href = attrs.get("href")
            href = urljoin(self.base, href) if href and href.startswith(("/", "#", "https://")) else None
            self.links.append(href)
            if href:
                self.parts.append("[")

    def handle_endtag(self, tag):
        if tag == "main":
            self.active = False
        elif self.active and self.hidden:
            self.hidden -= 1
        elif self.active:
            if re.fullmatch(r"h[1-6]", tag) or tag in {"p", "li", "blockquote"}:
                self.parts.append("\n\n")
            elif tag in {"strong", "b"}:
                self.parts.append("**")
            elif tag in {"em", "i"}:
                self.parts.append("*")
            elif tag == "a" and self.links:
                href = self.links.pop()
                if href:
                    self.parts.append("](" + href + ")")

    def handle_data(self, data):
        if self.active and not self.hidden:
            s = " ".join(data.split())
            if s:
                self.parts.append(" " + s + " ")

    def result(self):
        output = "".join(self.parts)
        output = re.sub(r"[ \t]+", " ", output)
        output = re.sub(r" *\n *", "\n", output)
        output = re.sub(r"\n{3,}", "\n\n", output)
        return output.strip()

def main():
    pages = [ROOT / "index.html"] + sorted(ROOT.glob("*/index.html"))
    for page in pages:
        slug = "" if page.parent == ROOT else page.parent.name
        canonical = urljoin(BASE, slug + "/" if slug else "")
        mdpath = "/index.md" if not slug else "/" + slug + ".md"
        html = page.read_text(encoding="utf-8")
        if 'rel="alternate" type="text/markdown"' not in html:
            html, count = re.subn(r'(<link\s+rel="canonical"[^>]*>)', lambda m: m.group(1) + '\n<link rel="alternate" type="text/markdown" href="' + mdpath + '">', html, count=1, flags=re.I)
            if count:
                page.write_text(html, encoding="utf-8")
        parser = Converter(canonical)
        parser.feed(html)
        body = parser.result()
        if not body:
            raise ValueError("Missing main content: " + str(page))
        target = ROOT / ("index.md" if not slug else slug + ".md")
        output = body + "\n\nCanonical HTML: " + canonical + "\n"
        if not output.startswith("# "):
            title = re.search(r"<title>(.*?)</title>", html, flags=re.I | re.S)
            output = "# " + (title.group(1).strip() if title else "PadelWrist") + "\n\n" + output
        if not target.exists() or target.read_text(encoding="utf-8") != output:
            target.write_text(output, encoding="utf-8")
    print("Generated Markdown for", len(pages), "pages")

if __name__ == "__main__":
    main()
