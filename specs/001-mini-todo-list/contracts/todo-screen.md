# Todo Screen Contract

| State or action | User-visible outcome |
| --- | --- |
| Loading | Loading indication. Task mutations are unavailable. |
| Load failed | Error and Retry on the same screen. No empty-state message or task mutations. |
| Retry | Return to loading. A successful load restores the saved list and enables changes. A failed retry returns to the error state. |
| Ready and empty | Invite the user to add the first task. |
| Add | Blank input explains that a title is required. A successful save clears the draft and shows the new incomplete task at the top. |
| Toggle | A successful save updates completion in place. Visual state and VoiceOver reflect the change. |
| Delete | The dialog targets the selected task. Cancel leaves it intact. Confirm removes it after successful save. |
| Save pending or failed | Prevent overlapping mutations during the save. On failure, show an error and retain the last saved view and any unsaved add draft. |

The screen stays scrollable and uses labeled interactive targets of at least
44 × 44 points. Primary actions respect safe areas. With the keyboard open,
users can reach Add and dismiss the keyboard on small and large iPhones.

See the [approved spec](../spec.md) and [data model](../data-model.md).
