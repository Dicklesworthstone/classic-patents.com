# FrankenPatents Apple app

FrankenPatents is a native SwiftUI museum for iPhone, iPad, and Mac Catalyst.
The complete searchable catalog, claims, engineering explanations, archival
editions, Plain English parallel readings, and historical context are generated
from the canonical TypeScript records and bundled for offline reading. Each
authored Three.js model builder is also exported as a local USDZ asset and
rendered by SceneKit, so all spatial exhibits remain bundled and Metal-backed.
Only the original patent PDF may be downloaded, after the reader explicitly
chooses it.

## Regenerate and build

```bash
cd ios
bun export-patents.ts
bun export-native-models.ts
xcodegen generate
open FrankenPatents.xcodeproj
```

No OCR runs as part of this export. The app consumes only the already reviewed
repository records.
