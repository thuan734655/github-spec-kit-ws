# Data Model: Mini Todo List

| Entity | Fields | Invariants |
| --- | --- | --- |
| Task | ID, title, completed flag | ID is unique and stable within this local list. Title is trimmed and nonempty. Titles may repeat. Completion is a boolean and starts false. |
| Task list snapshot | Schema version, next task ID, ordered tasks | Version 1 for the first release. IDs and the next ID are positive safe integers. The next ID is greater than every stored ID. The task array is ordered by descending ID. |

One AsyncStorage key holds the snapshot. A missing key is a valid empty list
with next ID 1. Persisted empty lists can retain a higher next ID. Malformed
JSON, unexpected versions, invalid fields, duplicates or invalid order fail the
read without rewriting the data.

| Operation | Transition |
| --- | --- |
| Add | Trim and validate title. Allocate the next ID, prepend an incomplete task and advance the counter. |
| Toggle | Change only the selected task's completion state, in its original position. |
| Delete | After confirmation, remove only the selected ID and preserve surviving order. |
| Cancel | Keep the snapshot and counter unchanged. |
| Retry | Read the same key again after a load failure. |
| Write failure | Keep the prior committed snapshot visible. Show an error and allow another attempt. |

Runtime load states are loading, ready, and load failed. The ready state also
tracks whether a write is pending. UI draft, confirmation, and transient errors
are session state.
