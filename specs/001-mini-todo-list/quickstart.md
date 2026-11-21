# Quickstart: Validate Mini Todo List

Run these checks once implementation has provided the Expo project and npm lockfile.
Use the Node version supported by the selected Expo SDK. A local iOS simulator
requires macOS and Xcode. On Windows, use a physical iPhone or an available remote
iOS simulator. Include both a small and a large iPhone layout.

## Setup and run

```sh
npm ci
npm run typecheck
npm test -- --runInBand
npx expo install --check
npx expo start
```

The plan expects `typecheck` to run strict TypeScript checking and `test` to run
Jest. For a smoke test, open the app on a compatible physical iPhone or use
`npx expo start --ios` on macOS. For offline cold launch, install an iOS build
with JavaScript bundled. On macOS use `npx expo run:ios --configuration Release`
with the target simulator available. Disable network access before the relaunch
trials. [Expo release-build testing](https://docs.expo.dev/guides/using-e2e/)

## Validation matrix

| Check | Expected outcome |
| --- | --- |
| Add and ordering | Add padded valid input, then add another task. Titles are trimmed, both start incomplete, and the latest is at the top. Empty and whitespace-only inputs produce feedback and leave the list intact. |
| Completion | Toggle a task both ways. Its position is stable and visual and VoiceOver states agree. |
| Deletion | Cancel first. Then confirm deletion of one of two matching titles. Only the selected task disappears. Delete the final task and see the empty state. |
| Persistence (SC-003) | Prepare mixed completion states and a deleted task. Close the installed app fully and reopen offline three consecutive times, without changing the list. Verify every title, state and position, and confirm the deleted item stays absent. |
| Errors | Inject rejected reads or invalid snapshots in automated tests. Changes stay blocked and Retry restores data after a successful read. Inject each failed mutation and verify the last saved view remains intact. |
| First-time usability (SC-001) | At least 4 of 5 first-time users add a task without help within 30 seconds from opening the list. |
| Layout (SC-002) | Reach all 20 sample tasks, reach Add, and dismiss the keyboard on both small and large iPhone layouts. Verify safe areas and 44 × 44 point controls. |
| Acceptance cases (SC-004) | Record passing results for invalid input, both toggles, cancel, duplicate-title deletion and deletion of the final task. |
| Accessibility (SC-005) | With VoiceOver, verify labels for core actions and announcements for both completion states. |

Record device or simulator model, iOS version, build, observations and outcome
for each check. The requirements checklist remains pending until the recorded
results verify all five success criteria.
