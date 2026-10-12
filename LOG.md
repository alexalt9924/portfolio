# Project log

1. **Initial site:** asked for a static portfolio with 5 project cards (the first is this site), placeholder bio text and a FrontPage 98 / XP space theme. Built an XP-window design with a CSS starfield, taskbar, marquee and counter.
2. **FrontPage 98 pivot:** asked to drop the XP imitation. Redesigned with shared borders, a WordArt-style banner, hover buttons and badges, still in modern CSS.
3. **Period-authentic rebuild:** asked for a site that works in modern browsers but looks built for 1998 ones. Rewrote it as HTML 4.0 with table layouts and `<font>` tags. Added `tools/make_graphics.py` to draw every graphic as a GIF.
4. **Working counter:** the counter is built from per-digit GIFs and set with `data-value` / `data-digits` in the HTML.
5. **Spacing:** removed the gaps left after the nav buttons and footer links were commented out.
6. **Wider layout:** main table is now 90% of the window (max 1280px), with a wider sidebar.
7. **Twinkling stars:** each background tile gets its own random flare schedule, driven by `starfield.js` and sprite GIFs. Kept on even with reduced motion enabled.
8. **Collapsible sections:** header stars minimize and maximize sections (About Me open by default), with a Windows 98-style tooltip.
9. **Section spacing:** made the gaps between sections even.
10. **Fake-data preview:** made `preview.html` with sample About Me data. Later deleted.
11. **Cleanup for shipping:** removed unused images, code, markup and notes. Added `favicon.ico` and `README.md`.
12. **Reflection panel:** styled the project 1 reflection as a separate panel, then reverted it on request.
13. **GitHub:** pushed to `github.com/gibbynorton/artifact1` (placeholder commit email) and enabled GitHub Pages at `https://gibbynorton.github.io/artifact1/`.
14. **Artifact 1 updates:** linked Source Code to the repo. Added `tools/make_thumbnail.py` to regenerate the preview image from a real Firefox screenshot.
15. **Cleanup:** removed an unused font constant and added a `.gitignore`.
