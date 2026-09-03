#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/dist/TinyNudge.app"
ARM="/tmp/TinyNudge-arm64"
X86="/tmp/TinyNudge-x86_64"
UNI="/tmp/TinyNudge-universal"
export MACOSX_DEPLOYMENT_TARGET=13.0

swiftc -O -target arm64-apple-macos13 "$ROOT/mac/main.swift" -o "$ARM" \
  -framework Cocoa -framework ApplicationServices
swiftc -O -target x86_64-apple-macos13 "$ROOT/mac/main.swift" -o "$X86" \
  -framework Cocoa -framework ApplicationServices
lipo -create -output "$UNI" "$ARM" "$X86"
lipo -info "$UNI"

rm -rf "$ROOT/dist"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$UNI" "$APP/Contents/MacOS/TinyNudge"
chmod +x "$APP/Contents/MacOS/TinyNudge"
cp "$ROOT/mac/Info.plist" "$APP/Contents/Info.plist"
if [[ -f "$ROOT/mac/TinyNudge.icns" ]]; then
  cp "$ROOT/mac/TinyNudge.icns" "$APP/Contents/Resources/TinyNudge.icns"
fi
codesign --force --deep -s - "$APP"
STAGE="$ROOT/dist/dmg"
mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname TinyNudge -srcfolder "$STAGE" -ov -format UDZO "$ROOT/dist/TinyNudge.dmg"
echo "Built universal $ROOT/dist/TinyNudge.dmg"
