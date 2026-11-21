# Research: Mini Todo List

## App entry and SDK compatibility

**Decision** — Use Expo's blank TypeScript template, strict type checking, and a
single App entry. Pin a supported stable Expo SDK and template-compatible
versions at scaffold time. Install native libraries through Expo CLI and check
the dependency set before running on iOS.

**Rationale** — One screen and a native confirmation dialog cover all journeys.
The Expo SDK supplies the React Native compatibility baseline.

**Alternatives considered** — Expo Router is useful when screens or deep links
need routes. Bare native setup adds native maintenance for this feature.

[Expo template options](https://docs.expo.dev/more/create-expo/)

## Local storage and ordering

**Decision** — Persist one JSON snapshot with a version, ordered task array
and a local ID counter. Serialize mutations in the hook and publish after a
successful write.

**Rationale** — A single list is read together and ordered by insertion. A
persisted counter distinguishes duplicates without relying on clock time.
Whole-list storage keeps the small project straightforward, with the trade-off
that each successful change rewrites the snapshot.

**Alternatives considered** — Per-task keys require coordinating updates with a
separate order index. SQLite adds a schema and queries that the approved scope
does not require. Optimistic updates would require rollback behavior.

[Expo AsyncStorage documentation](https://docs.expo.dev/versions/latest/sdk/async-storage/)

## iOS interaction

**Decision** — Use core React Native controls, native Alert for confirmation,
and Expo-compatible safe-area context at the app root.

**Rationale** — Core controls support the approved single-screen interaction.
The safe-area library provides device insets for small and large iPhones.

**Alternatives considered** — A custom modal or UI kit adds focus management and
dependency surface for one confirmation dialog.

[Expo safe-area context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/) ·
[React Native Alert](https://reactnative.dev/docs/alert)

## Testing and offline launch

**Decision** — Use the Expo Jest preset for automated logic and persistence
checks and use manual iOS acceptance for the actual device experience. Use an
installed build with a bundled JavaScript payload for cold offline relaunch.

**Rationale** — Unit tests make storage errors reproducible. iOS checks cover
accessibility and keyboard behavior. An installed bundle avoids needing Metro
after disabling networking.

**Alternatives considered** — Expo Go works for initial smoke checks. A mobile
end-to-end framework adds setup that the initial verification matrix can cover
with automated lower-level checks and manual iOS evidence.

[Expo unit testing](https://docs.expo.dev/develop/unit-testing/) ·
[Expo iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) ·
[Expo release-build testing](https://docs.expo.dev/guides/using-e2e/)
