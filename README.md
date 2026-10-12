# Alex's Home Page
A space-themed student portfolio site.

## Regenerating graphics
Banner text and every GIF are drawn by `tools/make_graphics.py`:

```
pip install pillow
python tools/make_graphics.py
```

It also rewrites `starfield.js` (the star positions the twinkle effect uses) and
`favicon.ico`. It leaves `images/photo.gif` alone if one already exists.

The "This Web Site" project preview (`images/thumb_site.gif`) is a real screenshot
of the page, taken with headless Firefox. Re-run it after design changes:

```
python tools/make_thumbnail.py
```
