# Patent vertical-slice browser acceptance

`scripts/e2e-patent-vertical-slices.ts` exercises the visitor-facing patent
route against an already-running Classic Patents Next.js server. It never
starts, replaces, or stops that server. Before Chromium launches, the runner
requires same-origin HTTP 200 HTML containing both the product identity and
Next asset identity, then records the final URL, response headers, HTML byte
count, and SHA-256 build fingerprint.

## Commands

```bash
# One exact catalogue id, all three viewports
bun run e2e:patent --patent us-821393-wright-flyer \
  --base-url http://127.0.0.1:3088

# An explicit list (repeat --patent)
bun run e2e:patent \
  --patent us-821393-wright-flyer \
  --patent us-381968-tesla-motor \
  --base-url http://127.0.0.1:3088

# Patents selected from working-tree, staged, and untracked paths
bun run e2e:patent --changed --base-url http://127.0.0.1:3088

# Every live catalogue id
bun run e2e:patents --base-url http://127.0.0.1:3088

# Unit contracts for manifests, arguments, logging, ordering, and diagnostics
bun run test:e2e-contract

# Intentional nonzero self-test of screenshot/DOM/diagnostics/trace capture
bun run e2e:patent --self-test-failure \
  --base-url http://127.0.0.1:3088 \
  --output-dir /tmp/classic-patents-e2e-self-test
```

Use `--viewports desktop,tablet,phone` to select viewports. Their dimensions
are fixed at 1440×900, 768×1024, and 320×800. `phone` also enables touch and
reduced-motion emulation. A representative record usually takes several
seconds per viewport; the full catalogue is intentionally a tens-of-minutes
acceptance run because it reloads every applicable face and operates real
controls. Use `--fail-fast` only for focused diagnosis, not final catalogue
acceptance.

## What a scenario proves

The manifest is generated from `allPatents` and rejects duplicate ids, remote
or noncanonical PDF paths, and missing pinned PDFs. Each selected route checks
identity metadata, the PDF response, publication/withheld source state, source
figure assets and interactions, URL-restored faces, claim navigation, exact
visual dispatch, 2D and 3D surfaces, keyboard and pointer/touch control
propagation, telemetry and refusal text, governing equations, energy channels,
claim probes, mute default, schematic and split views, theme restoration,
reduced motion, focusability, 320 px overflow, and unexpected browser/runtime
diagnostics as applicable to that patent.

No arbitrary sleep is used. Readiness is tied to semantic locators, URL state,
DOM attributes, telemetry changes, and bounded Playwright predicates. The
runner does not replace archival-edition tests or numerical kernel tests.

## Evidence and retention

Every invocation gets a unique directory under
`artifacts/e2e-patent-vertical-slices/` unless `--output-dir` is supplied. The
runner appends one schema-validated JSON object per action to `events.jsonl`
and writes `summary.json` at completion. Scenario rows name the exact shared
control contract and expected telemetry surfaces; events record the observed
control, kernel method, telemetry/refusal envelope, and browser diagnostics
when applicable. The summary groups results by patent, viewport, face, and
action, preserving the associated evidence paths. Failures also retain stable-named:

- a full-page PNG;
- a redacted DOM snapshot;
- a redacted JSON console/page/network transcript;
- a Playwright trace archive.

Secrets in common authorization, bearer, token, cookie, and password forms are
redacted from JSONL, DOM, and diagnostic text. The runner never deletes or
overwrites prior evidence. Keep a run directory with the bead or release that
it supports. Any later cleanup is a separate, explicitly approved retention
decision; the harness performs no automatic cleanup.

The failure self-test is successful only when the command exits `1`, its
summary reports exactly one `__harness-self-test__` failure plus an informative
`failure-evidence-integrity` event, and all four failure artifacts are
nonempty. A zero exit from that command—or a failed integrity event—means the
failure path was not actually proven.
