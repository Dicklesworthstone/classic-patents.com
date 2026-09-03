# FrankenPatents Apple app

FrankenPatents is a native SwiftUI museum for iPhone, iPad, and Mac Catalyst.
The complete searchable catalog, claims, engineering explanations, archival
editions, Plain English parallel readings, and historical context are generated
from the canonical TypeScript records and bundled for offline reading where the
public source supports them. A source-bound record instead exposes its pinned
facsimile and checked claim reading only; it does not claim a reviewed
transcript or edition and does not ship a model, controls, metrics, or USDZ
asset. Each authored Three.js model builder is otherwise exported as a local
USDZ asset and rendered by SceneKit, so spatial exhibits remain bundled and
Metal-backed. Only the original patent PDF may be downloaded, after the reader
explicitly chooses it.

## Regenerate and build

```bash
cd ios
bun export-patents.ts
bun export-native-models.ts
xcodegen generate
open FrankenPatents.xcodeproj
```

When only the native visualization manifest needs to reflect a publication
boundary (rather than changed model geometry), use the scoped command instead:

```bash
bun export-native-models.ts --manifest-only
```

It writes only `Resources/native-visualizations.json`, preserves the current
shipped model entries, and hashes all `Resources/NativeModels/*.usdz` before
and after the run so an attempted USDZ mutation fails the export. It reports
newer model routes that remain pending a deliberate full USDZ export. Use the
full exporter only when intentionally regenerating authored USDZ geometry.

No OCR runs as part of this export. The app consumes only the already reviewed
repository records.
