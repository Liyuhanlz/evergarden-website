# Evergarden poster website

The site people reach by scanning the QR code on the Evergarden project poster
(CSUF ECS Showcase). It's plain HTML, CSS and JavaScript with no build step.

Live site: https://liyuhanlz.github.io/evergarden-website/

## Files

| Path | What it is |
|---|---|
| `index.html` | Every page of the site (home menu plus six pages) |
| `css/styles.css` | Colours, layout and animations |
| `js/data.js` | All the words: your name and LinkedIn, steps, controls, crop facts, gallery captions |
| `js/transitions.js` | The page transitions (sprout, cat, and a placeholder) |
| `js/app.js` | Menu, page switching, fun-fact cards, gallery |
| `assets/screens/` | Screenshots from the game |
| `assets/art/cat-hang.webp` | The hanging cat used when going back home |
| `assets/art/icons/` | 43 farm icons (crops, fruit, animals, barn, tools) used for the menu and page banners |

## Before printing the QR code

1. Check your bio, awards and LinkedIn link in `js/data.js` (`MAKER`).
2. Publish the site (see below) and make the QR code from the published link.

## Try it on your computer

From this folder, run:

```
python -m http.server 8767
```

Then open http://localhost:8767 in a browser.

## Publish free with GitHub Pages

1. Create a new public repository on GitHub, for example `evergarden`.
2. Upload everything in this folder to it.
3. In the repository, open Settings, then Pages, and choose "Deploy from a branch", branch `main`, folder `/ (root)`.
4. After a minute the site is live at `https://<your-username>.github.io/evergarden/`. Use that link for the QR code.

## Pages and transitions

Each page has its own address, so you can link to one directly (for example `#/facts`).

| Page | Address | Transition |
|---|---|---|
| Home | `#/` | Cat pulls the menu down |
| The game | `#/game` | Sprout pops up and lifts the page |
| How it plays | `#/play` | Placeholder fade (to design) |
| Fun facts | `#/facts` | Placeholder fade (to design) |
| Gallery | `#/gallery` | Placeholder fade (to design) |
| Behind the build | `#/build` | Placeholder fade (to design) |
| Meet the maker | `#/maker` | Placeholder fade (to design) |

Visitors who turn on "reduce motion" on their phone get a short fade instead.

## Credits

- Farm icons (`assets/art/icons/`, 43 PNGs cut from one generated sheet) and cat illustration: generated with ChatGPT (OpenAI).
- Font: [Fredoka](https://fonts.google.com/specimen/Fredoka), SIL Open Font License.
- Facts: Encyclopaedia Britannica and Britannica for Students. Harvest times: University of Minnesota Extension.
- Screenshots: from the Evergarden game.
