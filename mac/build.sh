#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN="/tmp/TinyNudge-bin"
APP="$ROOT/dist/TinyNudge.app"
swiftc -Onone "$ROOT/mac/main.swift" -o "$BIN" -framework Cocoa -framework ApplicationServices
rm -rf "$ROOT/dist"
mkdir -p "$APP/Contents/MacOS"
cp "$BIN" "$APP/Contents/MacOS/TinyNudge"
chmod +x "$APP/Contents/MacOS/TinyNudge"
cp "$ROOT/mac/Info.plist" "$APP/Contents/Info.plist"
codesign --force --deep -s - "$APP"
STAGE="$ROOT/dist/dmg"
mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname TinyNudge -srcfolder "$STAGE" -ov -format UDZO "$ROOT/dist/TinyNudge.dmg"
echo "Built $ROOT/dist/TinyNudge.dmg"
