# Counter, Audio, and Spacing Improvements Implementation Plan

> **For agentic workers:** Implement the tasks in order and verify each task before moving on.

**Goal:** Remove round terminology from the tasbeeh experience, add clear completion feedback, add local Quran-audio playback controls, and improve spacing/readability.

**Architecture:** Keep counter persistence in `useTasbeeh`, expose a transient completion goal for the UI, and keep audio playback local to each Quranic `DuaCard` using a hidden HTML audio element. Apply spacing changes through existing Tailwind classes and shared CSS tokens.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4.

**Spec:** User request dated 2026-09-19.

## Global Constraints

- Preserve the existing Arabic RTL interface and offline-first behavior.
- Use a local audio path `./audio/sound.mp3`; do not embed remote third-party audio.
- Keep the audio control graceful when the local file has not been supplied.
- Verify with `npm run build` and `git diff --check`.

### Task 1: Counter completion language

**Files:** Modify `src/hooks/useTasbeeh.ts`, `src/components/Tasbeeh.tsx`, `src/components/TasbeehRing.tsx`, `src/data/dhikr.ts`.

- Remove the persisted/displayed rounds concept from the hook API.
- Add a transient completion goal and show `تمّ الذكر 100 مرة`-style feedback.
- Replace all visible `جولة` terminology and add goal 50.

### Task 2: Local Quran audio control

**Files:** Modify `src/components/DuaCard.tsx`, `src/components/Icons.tsx`; create `public/audio/README.md`.

- Render a hidden `<audio src="./audio/sound.mp3">` for Quranic cards.
- Add a play button that reports a helpful message when the local file is missing or playback is blocked.
- Add a reusable play icon.

### Task 3: Spacing and readability

**Files:** Modify `src/index.css`, `src/App.tsx`, `src/components/Tasbeeh.tsx`, `src/components/DuaSection.tsx`, `src/components/DuaCard.tsx`.

- Increase section/card/control gaps and padding.
- Increase dua line-height and preserve mobile responsiveness.

### Task 4: Verification

- Run `npm run build`.
- Run `git diff --check`.
- Search for visible `جولة` text and inspect the diff.
- Test the built preview and verify the completion/audio DOM behavior.
- Commit and push only after verification passes.
