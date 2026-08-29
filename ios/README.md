# FrankenPatents Apple app

FrankenPatents is a native SwiftUI museum for iPhone, iPad, and Mac Catalyst.
The complete searchable catalog, claims, engineering explanations, source
excerpts, and historical context are generated from the canonical TypeScript
records and bundled for offline reading. Full browser-based interactive
exhibits and facsimiles open only when the reader explicitly chooses them.

## Regenerate and build

```bash
cd ios
bun export-patents.ts
xcodegen generate
open FrankenPatents.xcodeproj
```

No OCR runs as part of this export. The app consumes only the already reviewed
repository records.

