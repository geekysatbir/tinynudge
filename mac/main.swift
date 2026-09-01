import Cocoa
import ApplicationServices

final class AppDelegate: NSObject, NSApplicationDelegate {
  private var statusItem: NSStatusItem!
  private var window: NSWindow!
  private var statusLabel: NSTextField!
  private var startButton: NSButton!
  private var timer: Timer?
  private var enabled = false
  private let interval: TimeInterval = 60
  private var lastPosted: CGPoint?

  func applicationDidFinishLaunching(_ notification: Notification) {
    setupStatusItem()
    setupWindow()
    showWindow()
    refresh()
  }

  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    showWindow()
    return true
  }

  private func setupStatusItem() {
    statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    statusItem.button?.title = "▵"
    statusItem.button?.font = NSFont.systemFont(ofSize: 13, weight: .semibold)
    statusItem.button?.toolTip = "TinyNudge — click for Start / Stop"

    let menu = NSMenu()
    let toggleItem = NSMenuItem(title: "Start", action: #selector(toggle), keyEquivalent: "")
    toggleItem.target = self
    menu.addItem(toggleItem)
    let showItem = NSMenuItem(title: "Show TinyNudge", action: #selector(showWindow), keyEquivalent: "")
    showItem.target = self
    menu.addItem(showItem)
    menu.addItem(NSMenuItem.separator())
    menu.addItem(NSMenuItem(title: "Quit TinyNudge", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
    statusItem.menu = menu
  }

  private func setupWindow() {
    let w: CGFloat = 420
    let h: CGFloat = 280
    window = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: w, height: h),
      styleMask: [.titled, .closable, .miniaturizable],
      backing: .buffered,
      defer: false
    )
    window.title = "TinyNudge"
    window.isReleasedWhenClosed = false
    window.center()

    let content = NSView(frame: NSRect(x: 0, y: 0, width: w, height: h))
    window.contentView = content

    let title = NSTextField(labelWithString: "TinyNudge lives here — and in the menu bar.")
    title.font = NSFont.systemFont(ofSize: 15, weight: .semibold)
    title.frame = NSRect(x: 24, y: 220, width: w - 48, height: 24)

    let body = NSTextField(wrappingLabelWithString: "This is a menu-bar mouse jiggler. Click Start, then look at the top-right of the screen for ▵. Every 60 seconds it nudges the pointer 3 pixels and back. Grant Accessibility when macOS asks.")
    body.frame = NSRect(x: 24, y: 130, width: w - 48, height: 80)

    statusLabel = NSTextField(labelWithString: "Stopped")
    statusLabel.font = NSFont.monospacedDigitSystemFont(ofSize: 13, weight: .medium)
    statusLabel.frame = NSRect(x: 24, y: 92, width: w - 48, height: 20)

    startButton = NSButton(title: "Start", target: self, action: #selector(toggle))
    startButton.bezelStyle = .rounded
    startButton.frame = NSRect(x: 24, y: 40, width: 120, height: 32)
    startButton.keyEquivalent = "\r"

    content.addSubview(title)
    content.addSubview(body)
    content.addSubview(statusLabel)
    content.addSubview(startButton)
  }

  @objc private func showWindow() {
    NSApp.activate(ignoringOtherApps: true)
    window.makeKeyAndOrderFront(nil)
  }

  @objc private func toggle() {
    if enabled { stop() } else { start() }
  }

  private func start() {
    if !AXIsProcessTrustedWithOptions([kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary) {
      let alert = NSAlert()
      alert.messageText = "Allow Accessibility"
      alert.informativeText = "System Settings → Privacy & Security → Accessibility → enable TinyNudge, then click Start again."
      alert.runModal()
      return
    }
    enabled = true
    lastPosted = currentCursor()
    nudge()
    timer?.invalidate()
    timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
      self?.nudge()
    }
    RunLoop.main.add(timer!, forMode: .common)
    refresh()
  }

  private func stop() {
    enabled = false
    timer?.invalidate()
    timer = nil
    refresh()
  }

  private func refresh() {
    statusItem.button?.title = enabled ? "▵•" : "▵"
    statusItem.menu?.item(at: 0)?.title = enabled ? "Stop" : "Start"
    startButton.title = enabled ? "Stop" : "Start"
    statusLabel.stringValue = enabled
      ? "Running — tiny nudge every 60s. Icon: ▵ in the menu bar."
      : "Stopped. Click Start, then look at the menu bar for ▵."
  }

  private func currentCursor() -> CGPoint {
    let loc = NSEvent.mouseLocation
    let h = NSScreen.screens.map(\.frame.maxY).max() ?? loc.y
    return CGPoint(x: loc.x, y: h - loc.y)
  }

  private func nudge() {
    let now = currentCursor()
    if let last = lastPosted, hypot(now.x - last.x, now.y - last.y) > 8 {
      lastPosted = now
      return
    }
    let moved = CGPoint(x: now.x + 3, y: now.y)
    postMove(moved)
    postMove(now)
    lastPosted = now
  }

  private func postMove(_ point: CGPoint) {
    if let event = CGEvent(
      mouseEventSource: nil,
      mouseType: .mouseMoved,
      mouseCursorPosition: point,
      mouseButton: .left
    ) {
      event.post(tap: .cghidEventTap)
    }
  }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
