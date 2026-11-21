---

description: "Implementation tasks for Mini Todo List"
---

# Tasks: Mini Todo List

**Status** — Approved.

**Input** — [Approved specification](spec.md), [approved plan](plan.md), [research](research.md), [data model](data-model.md), [screen contract](contracts/todo-screen.md), [quickstart](quickstart.md), and [constitution](../../.specify/memory/constitution.md).

**Tests** — Domain, storage, and screen contract checks use the planned Jest setup. Manual iOS acceptance follows the quickstart.

## Format and Path Conventions

Paths start at the repository root unless linked to a design document. A `[P]` marker identifies work that can run alongside the listed peer task once shared prerequisites are complete. Story labels identify the acceptance slice.

## Phase 1: Setup

- [ ] T001 Scaffold the managed Expo blank TypeScript app at the repository root, preserving Spec Kit files. Pin the selected stable Expo SDK and compatible React Native versions in `package.json` and `package-lock.json`, with one entry point in `App.tsx`.
- [ ] T002 Install SDK-compatible AsyncStorage and safe-area context with Expo CLI. Configure strict TypeScript in `tsconfig.json`, the Jest Expo preset and `typecheck` and `test` scripts in `package.json`, and update `package-lock.json`. Confirm dependency compatibility.

## Phase 2: Foundational

- [ ] T003 Define task and snapshot types and load-state variants in `src/todo/types.ts`. Use the canonical definitions in [data-model.md](data-model.md) for `Task.ID`, `Task.title`, `Task.completed flag`, `Task list snapshot.Schema version`, `Task list snapshot.next task ID`, and `Task list snapshot.ordered tasks`.
- [ ] T004 [P] Write storage contract tests in `tests/taskStorage.test.ts` for missing keys, valid and empty snapshot round trips, malformed JSON, invalid fields or ordering, unsupported versions, duplicate IDs, and rejected reads and writes. Assert failed reads perform no write.
- [ ] T005 [P] Mount the safe-area provider and the single screen entry in `App.tsx`. Create the screen shell in `src/components/TodoScreen.tsx` for later story integration.
- [ ] T006 Implement the single-key AsyncStorage adapter in `src/storage/taskStorage.ts`. Validate input from storage against [data-model.md](data-model.md), including `Task.ID`, `Task.title`, `Task.completed flag`, `Task list snapshot.Schema version`, `Task list snapshot.next task ID`, and `Task list snapshot.ordered tasks`. Distinguish missing data from failed or invalid reads and propagate write errors.

## Phase 3: User Story 1 — Add and view tasks (P1)

**Goal** — Add a valid task and view every task on the same screen.

**Independent test** — Start with an empty list. Add two tasks, including one with surrounding whitespace. Confirm newest-first order and incomplete state. Submit empty and whitespace-only titles and verify feedback without list changes.

- [ ] T007 [P] [US1] Add unit tests in `tests/taskList.test.ts` for trimmed and invalid input, duplicate-title identity, initial completion, and newest-first insertion.
- [ ] T008 [P] [US1] Write add and list contract tests in `tests/useTodoList.test.tsx` using injected storage and the screen contract. Cover empty state, validation feedback, same-screen insertion, and clearing the draft after successful save.
- [ ] T009 [US1] Implement title validation and new-task insertion in `src/todo/taskList.ts`. Apply [data-model.md](data-model.md) for `Task.ID`, `Task.title`, `Task.completed flag`, `Task list snapshot.next task ID`, and `Task list snapshot.ordered tasks`.
- [ ] T010 [US1] Implement initial load and the shared save path in `src/todo/useTodoList.ts`. Block changes until load succeeds and while saving. Guard overlapping calls before render, use the latest committed snapshot, and publish after a successful write. Preserve the prior list on write rejection.
- [ ] T011 [US1] Render task titles and completion states in `src/components/TaskRow.tsx`. Use stable task identity when rendering the rows from `src/components/TodoScreen.tsx` in the next task.
- [ ] T012 [US1] Wire draft input, Add, inline validation, empty state, loading indication, and scrollable rows in `src/components/TodoScreen.tsx`. Preserve draft on a failed save, expose the save error, and keep Add reachable with the keyboard open.

## Phase 4: User Story 2 — Keep tasks across launches (P1)

**Goal** — Restore the stored list, recover from load failures, and protect the last saved state.

**Independent test** — Start with a saved list containing both completion states. Relaunch offline, then use injected storage in automated tests to exercise failed load and successful Retry.

- [ ] T013 [US2] Extend `tests/useTodoList.test.tsx` with a mixed-state restore, empty restore, initial load gating, repeated Retry including failure then success, save rejection, and rapid overlapping actions. Verify the [screen contract](contracts/todo-screen.md) for load error feedback and mutation availability.
- [ ] T014 [US2] In `src/todo/useTodoList.ts`, expose distinct loading, ready, and failed states plus Retry. Retry reads the same snapshot and never writes on failure. Restore saved order and unlock mutations only after successful load.
- [ ] T015 [US2] Connect error and Retry states in `src/components/TodoScreen.tsx`. Show a clear load error instead of empty-state messaging and keep task actions unavailable until the read succeeds.

## Phase 5: User Story 3 — Change task completion (P2)

**Goal** — Toggle either completion state at the same list position.

**Independent test** — Load an incomplete task next to another task with the same title. Toggle the selected task twice. Verify only the selected state changes, order stays stable, and the visual and VoiceOver states agree.

- [ ] T016 [P] [US3] Add unit tests for both toggle directions, duplicate titles, and unchanged order in `tests/taskList.test.ts`.
- [ ] T017 [P] [US3] Extend contract tests in `tests/useTodoList.test.tsx` for both completion states, failed toggle saves and disabled actions while loading or saving.
- [ ] T018 [US3] Implement toggle by ID in `src/todo/taskList.ts` and connect it to the shared save path in `src/todo/useTodoList.ts`. Apply [data-model.md](data-model.md) for `Task.completed flag` and `Task list snapshot.ordered tasks`.
- [ ] T019 [US3] Connect the toggle in `src/components/TaskRow.tsx` and `src/components/TodoScreen.tsx`. Display distinct completion states and expose the control label and checked state to VoiceOver.

## Phase 6: User Story 4 — Delete a task (P3)

**Goal** — Remove only the selected task after confirmation.

**Independent test** — Load two tasks with the same title. Cancel a deletion, then confirm deletion of one and relaunch. Verify the other survives and that confirming deletion of the final task shows the empty state.

- [ ] T020 [P] [US4] Add domain tests in `tests/taskList.test.ts` for deleting the selected ID among duplicates, deleting the final task, and keeping surviving order.
- [ ] T021 [P] [US4] Extend contract tests in `tests/useTodoList.test.tsx` for cancel with no write, confirm targeting the selected ID, write rejection, and the return to empty state after deleting the last task.
- [ ] T022 [US4] Implement removal by ID in `src/todo/taskList.ts` and persist it through `src/todo/useTodoList.ts`. Preserve `Task list snapshot.ordered tasks` and `Task list snapshot.next task ID` per [data-model.md](data-model.md).
- [ ] T023 [US4] Add labeled Delete in `src/components/TaskRow.tsx` and native confirmation in `src/components/TodoScreen.tsx`. Cancel makes no change. Confirm saves the selected deletion through the hook.

## Phase 7: Polish and Cross-Cutting Verification

- [ ] T024 Check interactive labels and 44 × 44 point targets in `src/components/TodoScreen.tsx` and `src/components/TaskRow.tsx`. Verify safe areas, scrolling and keyboard dismissal against `specs/001-mini-todo-list/contracts/todo-screen.md`.
- [ ] T025 Run strict type checking and the full test suite via `package.json`. Run Expo package compatibility checks and resolve failures in the applicable app or test files.
- [ ] T026 Run the iOS scenarios in `specs/001-mini-todo-list/quickstart.md` on small and large layouts. Include five first-time users, the 20-task list, three offline cold relaunches using a build with bundled JavaScript, deletion checks, and VoiceOver. Record the device, OS, build, and results for SC-001 through SC-005 before requesting Implement approval.
- [ ] T027 Review the recorded iOS evidence and update the deferred item in `specs/001-mini-todo-list/checklists/requirements.md` only if all five success criteria are verified. Report any outstanding criteria.

## Dependencies and Execution Order

| Work | Dependency or parallel opportunity |
| --- | --- |
| Setup and foundation | T001 → T002 → T003. After T003, T004 and T005 can run together. T006 follows T004. |
| US1 | Foundation → T007 and T008 in parallel → T009 → T010 → T011 → T012. |
| US2 | T012 → T013 → T014 → T015. Its tests and integration share the US1 screen and hook. |
| US3 | T015 → T016 and T017 in parallel → T018 → T019. |
| US4 | T019 → T020 and T021 in parallel → T022 → T023. |
| Final verification | T023 → T024 → T025 → T026 → T027. |

Parallel test tasks within a story touch different files. US2 is sequential
because it extends the existing hook and screen. Later stories also reuse those
files, so merge each story before the next story's integration.

## Implementation Strategy

Use US1 as the first demo increment and verify it with its own acceptance test.
Complete US2 next to deliver both P1 stories and the offline persistence baseline.
Then add US3 and US4 and run the full iOS verification matrix. All four stories
are part of the agreed release scope.

Tasks approval precedes Analyze. Analyze approval precedes implementation.
