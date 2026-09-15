#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root/ios"

build_root="${FRANKEN_APPLE_BUILD_ROOT:-${DSR_QUALITY_RUN_DIR:-$repo_root/ios/build/dsr-apple-quality}}"
mkdir -p "$build_root/tmp"
sbh check --need 20G "$build_root"
command -v xcodegen >/dev/null
command -v bun >/dev/null
command -v jq >/dev/null

audio_safety=/Users/jemanuel/.local/bin/ensure-simulator-audio-safe
prepare_simulator_audio() {
  local attempt
  # A cold boot can add SpringBoard/audio processes just after bootstatus
  # returns. Preserve exact coverage and allow only bounded convergence.
  for attempt in 1 2 3 4 5 6 7 8 9 10; do
    if "$audio_safety" prepare; then
      return 0
    fi
    if [[ "$attempt" -lt 10 ]]; then
      sleep 2
    fi
  done
  return 1
}

xcodegen generate --spec project.yml
git diff --exit-code -- FrankenPatents.xcodeproj Sources/Info.plist
(cd "$repo_root" && bun ios/check-native-parity.ts)
git ls-files -z -- '*.swift' | xargs -0 xcrun swiftc -parse
plutil -lint Sources/Info.plist
plutil -lint Sources/PrivacyInfo.xcprivacy
plutil -lint FrankenPatents.entitlements
prepare_simulator_audio
TMPDIR="$build_root/tmp" xcodebuild -project FrankenPatents.xcodeproj -scheme FrankenPatents \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$build_root/derived-data" \
  CODE_SIGNING_ALLOWED=NO build
TMPDIR="$build_root/tmp" xcodebuild -project FrankenPatents.xcodeproj -scheme FrankenPatents \
  -destination 'platform=macOS,variant=Mac Catalyst' \
  -derivedDataPath "$build_root/derived-data" \
  CODE_SIGNING_ALLOWED=NO test -only-testing:FrankenPatentsTests

prepare_simulator_audio
simulator_json="$(xcrun simctl list devices available --json)"
iphone_id="${FRANKENPATENTS_IPHONE_SIMULATOR_ID:-$(
  jq -r '
    [.devices[][] | select(.name | contains("iPhone"))] as $devices
    | (($devices | map(select(.name | test("^FrankenPatents iPhone"; "i"))))
        + ($devices | map(select((.name | test("FrankenPatents"; "i")) and .state == "Booted")))
        + ($devices | map(select(.name | test("FrankenPatents"; "i"))))
        + ($devices | map(select(.state == "Booted")))
        + $devices)
    | .[0].udid // empty
  ' <<< "$simulator_json"
)}"
if [[ -z "$iphone_id" ]]; then
  echo "FrankenPatents DSR requires one available iPhone Simulator" >&2
  exit 1
fi

prepare_simulator_audio
xcrun simctl bootstatus "$iphone_id" -b
prepare_simulator_audio
TMPDIR="$build_root/tmp" xcodebuild -project FrankenPatents.xcodeproj -scheme FrankenPatents \
  -destination "platform=iOS Simulator,id=$iphone_id" \
  -derivedDataPath "$build_root/derived-data" \
  -resultBundlePath "$build_root/frankenpatents-iphone-ui.xcresult" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO test \
  -only-testing:FrankenPatentsUITests
