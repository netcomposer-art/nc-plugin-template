# NetComposer plugin template

A working insert plugin for the [NetComposer Studio](https://netcomposer.art/studio/)'s Mix: a **tremolo** (rate,
depth, shape). Copy it, make it your effect, check it, load it in the Studio.

A plugin is two files:

```
plugin/
  plugin.json      what it is: id, name, version, author, licence, its dials
  tremolo.dsp.js   what it does: one plain script that runs on the audio thread
```

The Studio draws the rest: the card, On/Off, the level meter, fold, saving, presets.
The full contract: [nc-fx docs/plugins.md](https://github.com/netcomposer-art/nc-fx/blob/main/docs/plugins.md).

## 1. Copy it

Press **Use this template** on GitHub (or copy this folder). Then:

```sh
npm install
npm run check        # the tremolo passes every check
```

## 2. Make it yours

1. In `plugin/plugin.json`: a new `id` (`yourname.effect`, lowercase; never change it once people use it), `name`,
   `author`, `description`, and your dials in `params`.
2. Rename `plugin/tremolo.dsp.js` and set `"dsp"` to the new name.
3. In the DSP file: the same `id` and `version` as plugin.json, `params` listing plugin.json's param ids in the same
   order, then your sound in `process()`.

Rules that matter most (the checker tests all of them):

- Make every buffer in `create()`. In `process()` and `set()`: no `[]`, `{}`, `new`, closures or array methods.
- Keep changing numbers in a `Float64Array` (as the tremolo does), not in plain variables.
- `frames` is 1 to 128. Write `outL`/`outR` only.
- No NaN, no runaway feedback, no clicks (smooth dial changes), no denormals (snap tiny values to 0).

## 3. Check it

```sh
npm run check            # PASS / FAIL per check, a fix for each FAIL; exit 1 if anything failed
npm run -s check -- --json   # the same as JSON (for agents; -s keeps npm quiet)
npx playwright install chromium   # once, to add the real-browser check
```

Loop until it says `RESULT PASS`. GitHub Actions runs the same check (with Chromium) on every push.

## 4. Try it in the Studio

```sh
npm run serve            # serves plugin/ at http://localhost:5990/ with CORS
```

Open https://netcomposer.art/studio/, press a channel's **Inserts**, pick **Add › Load plugin from URL…**, paste
`http://localhost:5990/plugin.json`, and press **Load and run**. (The Studio warns that this runs code from
localhost. Chrome may ask to let the site reach your local network: allow it.) Reload the page to load a change.

## 5. Share it

- Anyone can load it from any https address (GitHub Pages works) with **Load plugin from URL…**.
- To have it **listed** (offered in Add › Plugins for everyone, checked by sha256), open a pull request on
  [netcomposer-art/netcomposer.art](https://github.com/netcomposer-art/netcomposer.art) adding `plugins/<name>/` and
  an entry in `plugins/registry.json`, with your checker output. It is reviewed by hand.

## Updating the checker

`package.json` pins nc-fx (where the checker lives) to one commit as a git dependency: the same checker in CI and on
every machine, and `npm ci` works from npm's cache once installed. To move it, put a newer commit of nc-fx `main` in
`devDependencies` and run `npm install`.

## Files

| File | |
|---|---|
| `plugin/plugin.json`, `plugin/tremolo.dsp.js` | The plugin. |
| `package.json` | `npm run check` (nc-fx-check from [nc-fx](https://github.com/netcomposer-art/nc-fx), pinned to a commit) and `npm run serve`. |
| `tools/serve.mjs` | The local server for the Studio (CORS). |
| `.github/workflows/check.yml` | The checker on every push and pull request. |
| `AGENTS.md` | For AI agents. |

MIT licensed. Created by Peter Semmelhack.
