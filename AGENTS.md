# AGENTS.md: nc-plugin-template

You are probably here to build an insert effect for the NetComposer Studio ("make me an insert that does XYZ").

## What this is

A template for one NetComposer insert plugin: `plugin/plugin.json` (the manifest) and `plugin/tremolo.dsp.js` (one
plain script that runs in the AudioWorklet). The contract, every rule and the host API:
https://github.com/netcomposer-art/nc-fx/blob/main/docs/plugins.md (read it first; it is written for you).

## Commands

```sh
npm install                       # nc-fx (pinned commit) for the checker, and Playwright
npx playwright install chromium   # once, for the real-browser check
npm run check                     # nc-fx-check plugin: PASS/FAIL per check, exit 1 on any FAIL
npm run -s check -- --json        # machine-readable (-s: npm prints nothing else): { ok, checks: [{ id, ok, level, message, fix }] }
npm run serve                     # plugin/ at http://localhost:5990/ with CORS, for the Studio
```

## The loop

1. Edit `plugin/plugin.json`: a new `id` (`yourname.effect`), `name`, `author`, `description`, `params`.
2. Edit (or rename) the DSP file: same `id`, `version` and param ids (in order) as plugin.json; your DSP in
   `process()`. Keep the tremolo's patterns: buffers made in `create()`, state in a `Float64Array`, values copied to
   locals at the top of `process()` and back at the end, smoothing, snapping tiny values to 0.
3. `npm run -s check -- --json`. For every check with `ok: false`, apply its `fix`. Repeat until `ok: true`.
4. Bump `version` (in both files) whenever the DSP changes.

## Rules

- One plain script: no `import`/`export`, no DOM, no network, no timers. Up to 256 KB.
- No allocation in `process()` or `set()`. Never throw. No NaN, runaway, clicks or denormals.
- Don't change `tools/`, the workflow or the nc-fx pin unless asked; to move the pin, use a commit on nc-fx `main`.
- Colours and UI: there are none to write. The Studio draws the card from plugin.json.
- Copy (labels, description): short plain sentences.
- Commits and PRs need no attribution lines.

## Where to ask

Issues on [netcomposer-art/nc-plugin-template](https://github.com/netcomposer-art/nc-plugin-template/issues) for the
template, [netcomposer-art/nc-fx](https://github.com/netcomposer-art/nc-fx/issues) for the contract or the checker.
To get a plugin listed in the Studio: a pull request on
[netcomposer-art/netcomposer.art](https://github.com/netcomposer-art/netcomposer.art). Peter Semmelhack decides.
