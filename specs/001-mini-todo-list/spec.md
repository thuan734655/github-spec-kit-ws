# Feature Specification: Mini Todo List

**Feature Branch**: `main` (current branch)

**Created**: 2026-11-21

**Status**: Approved

**Input**: A single-screen iPhone todo list for adding, viewing, completing,
reopening, and deleting tasks, with data retained on the device.

## Clarifications

### Session 2026-11-21

- Q: How are tasks ordered after adding, toggling completion, or reopening the app? → A: Newest-created first. Toggling completion and reopening preserve task order.
- Q: Should the app ask for confirmation before deleting a task? → A: Yes. Delete only after confirmation. Cancel leaves the task unchanged.
- Q: How can users retry when the saved task list fails to load? → A: Show an error and a Retry action on the list screen. Allow task changes only after a successful load.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add and view tasks (Priority: P1)

As an iPhone user, I want to add tasks and see them on one screen so I can remember what to do.

**Why this priority**: Capturing and finding work is the core value of the app.

**Independent Test**: Open an empty list, add a valid title, and attempt to submit
an empty title and a whitespace-only title.

**Acceptance Scenarios**:

1. **Given** there are no tasks, **When** I open the list, **Then** I see an empty-state
   message that invites me to add my first task.
2. **Given** the task list is open, **When** I enter a valid title and submit it,
   **Then** the new task appears as incomplete at the top of the list on the same screen.
3. **Given** the title is empty or contains only whitespace, **When** I attempt to
   add it, **Then** the app explains that a title is required and the list remains unchanged.
4. **Given** tasks extend beyond the visible area, **When** I scroll the list,
   **Then** I can reach every task and see its title and completion state.
5. **Given** the keyboard is open, **When** I enter a title on a small or large iPhone,
   **Then** I can reach the add action and dismiss the keyboard. Primary controls remain
   within safe areas and have labeled touch targets at least 44 × 44 points.

### User Story 2 - Keep tasks across launches (Priority: P1)

As an iPhone user, I want my list to survive reopening the app so I can resume where I left off.

**Why this priority**: Users need to be able to rely on the list between sessions.

**Independent Test**: Open a prepared list with both completion states, close the app,
and reopen it with the device offline.

**Acceptance Scenarios**:

1. **Given** the saved list contains completed and incomplete tasks, **When** I close and
   reopen the app offline, **Then** the saved titles, completion states, and task order are restored.
2. **Given** the app cannot load saved tasks, **When** I open it, **Then** I see a clear
   error message and a Retry action. The saved data is preserved and task changes remain unavailable.
   **When** Retry succeeds, **Then** I see the saved list and can change tasks again.
3. **Given** an add, completion change, or deletion cannot be saved, **When** I
   attempt that action, **Then** I see an error and the list reflects its last saved state.

### User Story 3 - Change task completion (Priority: P2)

As an iPhone user, I want to mark a task done or reopen it so the list reflects my progress.

**Why this priority**: Completion helps users distinguish remaining work from finished work.

**Independent Test**: Use an existing incomplete task and toggle its state twice.

**Acceptance Scenarios**:

1. **Given** an incomplete task, **When** I mark it complete, **Then** it stays in the same position in the
   list and its completed state is visually distinct and announced by VoiceOver.
2. **Given** a completed task, **When** I mark it incomplete, **Then** it stays in the same position in the
   list and its incomplete state is visible and announced by VoiceOver.

### User Story 4 - Delete a task (Priority: P3)

As an iPhone user, I want to remove a task I no longer need so my list stays relevant.

**Why this priority**: Removal keeps the list manageable after tasks have been captured.

**Independent Test**: Use two existing tasks with the same title. Cancel a deletion, then confirm a deletion of the selected task.

**Acceptance Scenarios**:

1. **Given** two tasks share a title, **When** I confirm deletion of one of them, **Then** only the
   selected task disappears and it stays deleted after closing and reopening the app.
2. **Given** one task remains, **When** I confirm deletion, **Then** the list shows the empty-state message.
3. **Given** a deletion confirmation is open, **When** I cancel it, **Then** the task remains unchanged.

### Edge Cases

- Titles surrounded by whitespace are displayed without the surrounding whitespace.
  A title consisting entirely of spaces, tabs, or line breaks is rejected.
- Identical titles represent separate tasks. Completing or deleting one leaves the other unchanged.
- A list that exceeds the visible area remains browsable on the same screen.
- A saved empty list shows the empty-state message after reopening. A load error shows an error message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** — Users MUST be able to enter and submit a task title from the list screen.
- **FR-002** — The app MUST trim surrounding whitespace and reject empty or whitespace-only
  titles with a clear explanation, leaving the list unchanged (Story 1).
- **FR-003** — A successfully added task MUST appear as incomplete (Story 1).
- **FR-004** — All tasks MUST be reachable on one screen with their titles and completion states.
  Tasks MUST appear newest-created first. Changing completion MUST preserve their order.
  An empty list MUST show a message inviting the user to add a task (Stories 1 and 4).
- **FR-005** — Users MUST be able to switch a task between complete and incomplete.
  Both states MUST be visually distinguishable and communicated by VoiceOver (Story 3).
- **FR-006** — Users MUST be able to delete a selected task, including one with the same title
  as another task. The app MUST ask for confirmation before deleting it. Canceling MUST
  leave the task unchanged. A successful deletion MUST remove only the selected task (Story 4).
- **FR-007** — The app MUST preserve task titles, completion states, task order, and deletions on the
  current iPhone across app closure and reopening, including offline (Stories 2 and 4).
- **FR-008** — If loading or saving fails, the app MUST explain the failure. A load failure
  MUST preserve saved data and offer Retry on the list screen. Users MUST be able to
  change tasks only after a successful load. A failed change MUST leave the last saved list
  intact and MUST not be shown as successful (Story 2).
- **FR-009** — Primary actions MUST fit within safe areas on small and large iPhones. Controls
  MUST have accessible labels and touch targets of at least 44 × 44 points. Users MUST be able
  to reach Add and dismiss the keyboard when it is open (Story 1).

### Key Entities

- **Task** — An individually selectable item with a title and a complete or incomplete state.
- **Task list** — The collection of tasks saved on the current iPhone, which can be empty.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001** — At least 4 of 5 first-time users add a task without assistance within
  30 seconds of opening the list.
- **SC-002** — On both a small and a large iPhone screen, a tester can reach all 20 tasks
  in a sample list and can reach Add and dismiss the keyboard while entering a title.
- **SC-003** — Across three consecutive offline close-and-reopen trials, 100% of saved task
  titles, completion states, and task order match the prior list, and no deleted task reappears.
- **SC-004** — All acceptance checks pass for rejecting empty and whitespace-only titles,
  toggling in both directions, canceling a deletion, deleting one of two same-title tasks, and deleting the last task.
- **SC-005** — For each core action and both completion states, VoiceOver exposes the
  relevant control label and task state during iPhone accessibility validation.

## Assumptions

- This first release serves a single user on the current iPhone. Core actions work offline.
- New tasks start incomplete. Duplicate titles are allowed, and surrounding whitespace
  is removed before saving. Completion and deletion apply to the individually selected task.
- Acceptance verification requires an iOS simulator or physical iPhone.
- Authentication, cloud synchronization, push notifications, task categories, due dates,
  backend services, and other advanced features are outside the initial scope.
