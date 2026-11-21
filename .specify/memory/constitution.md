# Mini Todo List Constitution

## Core Principles

### I. Expo-Managed iOS Stack

- The app MUST target iOS and use React Native with Expo in the managed workflow.
- TypeScript MUST enable strict type checking. The project MUST pass its type check.
- Use React Native core components for UI and Expo Router if navigation is needed.
- Store tasks on the device using AsyncStorage. Dependencies MUST support the
  project's Expo SDK and run on iOS. Each third-party dependency MUST have a
  documented need that the existing stack cannot reasonably meet.

### II. Simple Architecture

- Keep task validation, task operations, and persistence logic separate from rendering
  so core behavior can be tested independently of the UI.
- Keep state in React hooks. Introducing Redux or comparable state libraries requires
  a documented need and project owner approval during Plan.
- Keep the structure approachable for beginners. Extract reusable components where
  there is shared behavior or a clear responsibility.

### III. Readable, Reliable Code

- Use descriptive names, consistent formatting, and small, focused components
  and functions. Use explicit types where inference leaves a contract unclear.
- Any use of TypeScript `any` MUST have a documented justification.
- Handle invalid input, an empty task list, and AsyncStorage read or write errors.
  The UI MUST avoid reporting a save as successful if persistence fails.

### IV. iOS Usability and Accessibility

- Follow common iOS conventions. Keep the task list and its primary actions easy
  to find, with a minimal interface that respects safe areas.
- Interactive controls MUST have accessible labels and touch targets of at least
  44 × 44 points. Task completion state MUST be available to VoiceOver.
- Verify that the layout and primary actions work on small and large iPhone screen
  sizes. The on-screen keyboard MUST allow users to reach the add action and
  dismiss the keyboard.

### V. Verification of Core Behavior

- Tests MUST cover core logic for adding valid tasks, rejecting empty and invalid
  input, toggling completion in both directions, and deleting tasks.
- Verify on an iOS simulator or physical iPhone that users can view and operate the
  task list and that closing and relaunching the app preserves tasks and completion
  state. Verify that deleted tasks stay deleted after relaunch.
- Record the verification results before seeking Implement approval.

## Product Scope

The project exists to practice the full GitHub Spec Kit workflow for Spec-Driven
Development through a beginner-friendly iOS app. The first release is limited to
adding tasks, viewing the task list, marking tasks complete or incomplete, deleting
tasks, and persisting tasks locally. A backend, external database, authentication,
notifications, cloud synchronization, and other advanced features are out of scope.

## Development Workflow

Follow these GitHub Spec Kit stages in order. The project owner MUST review and
explicitly approve each stage before the next begins. Every stage is required.
If Clarify finds no open questions, record that outcome for approval.

1. **Constitution** establishes project-wide principles and scope boundaries.
2. **Specify** defines what the app must do and how users can verify it.
3. **Clarify** resolves open requirements questions and records the decisions.
4. **Plan** defines how the approved specification will be built and verified.
5. **Tasks** breaks the approved plan into actionable, verifiable work.
6. **Analyze** checks the specification, plan, and tasks for consistency and coverage.
   Resolve blocking findings before approving this stage.
7. **Implement** follows the approved specification, plan, and tasks. Review the
   delivered behavior and verification results before accepting the stage.

## Governance

- This constitution governs project decisions. Stage reviews and change reviews
  MUST verify compliance with scope, technology, usability, testing, and workflow
  rules. Update and reapprove affected workflow artifacts when requirements change.
- Amendments MUST record the proposed text, rationale, and impact on specifications,
  plans, tasks, or existing code. The project owner MUST approve amendments before
  they take effect. Record any required updates to affected artifacts.
- Use MAJOR for incompatible changes to governance or removal of principles, MINOR
  for new principles or materially expanded guidance, and PATCH for wording or
  other non-semantic corrections. Preserve the original ratification date and
  update the amendment date when the constitution changes.

**Version**: 1.0.0 | **Ratified**: 2026-11-21 | **Last Amended**: 2026-11-21
