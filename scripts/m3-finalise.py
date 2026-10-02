from pathlib import Path

pages = Path('assets/pages.css')
text = pages.read_text()
text = text.replace(
'''  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: var(--pw-grid-gap);
}''',
'''  display: grid;
  grid-template-columns: 1fr;
  gap: var(--pw-grid-gap);
}''',
1,
)
text = text.replace(
'''.guides-hub .guide-copy > section h2 { margin-bottom: var(--space-4); }

.page-body .check-list.plain {''',
'''.guides-hub .guide-copy > section h2 { margin-bottom: var(--space-4); }
.guides-hub .check-list.plain {
  grid-template-columns: repeat(2, minmax(0,1fr));
  column-gap: var(--pw-grid-gap);
}

.page-body .check-list.plain {''',
1,
)
text = text.replace('padding: var(--space-5, 20px) 0;', 'padding: var(--space-6) 0;', 1)
text = text.replace(
'''  .guides-hub .guide-copy { grid-column: 1 / -1; max-width: none; grid-template-columns: 1fr; }''',
'''  .guides-hub .guide-copy { grid-column: 1 / -1; max-width: none; grid-template-columns: 1fr; }
  .guides-hub .check-list.plain { grid-template-columns: repeat(2, minmax(0,1fr)); }''',
1,
)
text = text.replace(
'''  .guides-hub .guide-copy { grid-template-columns: 1fr; gap: var(--space-4); }''',
'''  .guides-hub .guide-copy { grid-template-columns: 1fr; gap: var(--space-4); }
  .guides-hub .check-list.plain { grid-template-columns: 1fr; }''',
1,
)
pages.write_text(text)

home = Path('assets/home.css')
h = home.read_text()
h = h.replace('  max-width: 11ch;\n  font-size: var(--type-display-lg);', '  max-width: 14ch;\n  font-size: var(--type-display-lg);', 1)
home.write_text(h)
