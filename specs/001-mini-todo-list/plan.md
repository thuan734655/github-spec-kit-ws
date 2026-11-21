# Implementation Plan: Mini Todo List

**Branch**: `main` | **Feature directory**: `001-mini-todo-list` | **Date**: 2026-11-21 | **Spec**: [Approved specification](spec.md)

**Status**: Approved

**Input**: Approved specification, Clarify decisions, and [constitution](../../.specify/memory/constitution.md).

## Summary

Build a single-screen, offline iPhone app. Keep task rules in pure TypeScript,
coordinate state and saves in one React hook, and store an ordered snapshot in
AsyncStorage. Preserve the last saved view until a write succeeds.

## Technical Context

| Area | Decision |
| --- | --- |
| Language | TypeScript with `strict: true` |
| Dependencies | Expo managed, React Native core UI, React Hooks, AsyncStorage, and `react-native-safe-area-context` for device insets |
| Storage | One versioned local list snapshot. All task actions work offline. |
| Testing | Jest with the Expo preset for domain and persistence behavior, strict type check, and manual iOS acceptance |
| Target | Small and large iPhone layouts on iOS versions supported by the selected Expo SDK |
| Project type | Single-screen iOS mobile app with one local list |
| Performance and acceptance | At least 4 of 5 first-time users add a task without assistance within 30 seconds of opening the list. All 20 sample tasks are reachable on both screen sizes. See [validation guide](quickstart.md) for remaining targets. |
| Constraints | No navigation dependency is needed for a single screen. Backend, authentication, notifications, categories, due dates and cloud sync are outside scope. |

Select and pin a supported stable Expo SDK at scaffold time alongside its
compatible React Native and AsyncStorage versions. The specific versions are an
installation choice within this plan, subject to the compatibility checks in
[research.md](research.md).

## Constitution Check

| Gate | Before research | After design |
| --- | --- | --- |
| Expo-managed iOS, strict TypeScript, AsyncStorage | Pass | Compatible packages and a strict type-check gate are specified. |
| Simple separation of UI, rules and storage | Pass | One screen and one hook coordinate pure operations and a single adapter. |
| Reliability and validation | Pass | Load and write errors preserve data. Tests cover rejection and retry. |
| iOS accessibility and usability | Pass | Safe areas, keyboard access, VoiceOver and 44 × 44 point targets have acceptance checks. |
| Scope, testing and stage approvals | Pass | Scope matches the specification. Runtime acceptance remains pending. The project owner approved Plan. |

## Project Structure

### Documentation (this feature)

- [Research decisions](research.md)
- [Data model](data-model.md)
- [UI contract](contracts/todo-screen.md)
- [Quickstart and validation](quickstart.md)

### Source Code (repository root)

Proposed layout for implementation.

```text
App.tsx
src/
  components/
    TodoScreen.tsx
    TaskRow.tsx
  todo/
    types.ts
    taskList.ts
    useTodoList.ts
  storage/
    taskStorage.ts
tests/
  taskList.test.ts
  taskStorage.test.ts
  useTodoList.test.tsx
```

`App.tsx` hosts the safe-area provider and single screen. The screen owns the
draft and delete confirmation. The hook owns loading, Retry, and the committed
snapshot. Pure domain operations validate titles, prepend new tasks, toggle in
place by identity, and remove by identity while preserving relative order. The
adapter validates persisted data and reads or writes a single key.

On startup, keep changes disabled until the snapshot loads. Missing data begins
an empty list. Read errors and invalid snapshots go to the Retry state and never
trigger a write. For add, toggle or confirmed delete, compute from the latest
committed snapshot and allow only one write at a time, including rapid taps
before a render. Publish the new snapshot only after save succeeds. A rejected
write leaves the prior view in place, reports the error, and retains the draft
for a failed add. A canceled delete causes no write.

## Verification Strategy

- Unit-test trimmed and invalid titles, distinct IDs for duplicate titles,
  prepend order, both toggle directions, and removal of only the selected task.
- Test adapter round trips, missing data, malformed data, and rejected reads and
  writes. Test the hook with injected storage for load gating, failed Retry,
  successful Retry, rejected writes and overlapping interactions.
- Verify on iOS that cancel leaves a task intact, confirmed delete persists, and
  three offline cold relaunches preserve tasks, completion and order. Check both
  iPhone sizes, keyboard access, touch targets and VoiceOver. Record evidence
  for SC-001 through SC-005 before closing the pending checklist item.

## Complexity Tracking

No constitution exceptions identified.
