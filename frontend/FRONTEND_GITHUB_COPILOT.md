# Task: Require a coordinator for psychologists in `UsuarioFormDialog.tsx`

Edit `UsuarioFormDialog.tsx` with minimal changes.

## Requirements
1. If the selected user's role has `rol.nombre === "PSICOLOGO"`, require selecting a coordinator.
2. Populate the coordinator selector with users whose `rol.nombre === "COORDINADOR"`, using existing API services, hooks, types, and UI patterns.
3. Bind the selected coordinator to the existing `coordinador` field/property expected by the backend. Inspect existing DTOs/types; do not invent field names.
4. Display validation feedback and prevent submission if a psychologist has no coordinator selected.
5. When the selected role changes from `PSICOLOGO` to another role, coordinator selection must no longer be required. Preserve existing behavior for other roles.
6. When editing an existing psychologist, preload and display their current coordinator.
7. Reuse existing components and conventions. Make no unrelated changes.

## Constraints
- Inspect `UsuarioFormDialog.tsx` and only the necessary existing API/type files.
- Do not create a new backend module or endpoint if an existing user-list endpoint can retrieve coordinators.
- Do not hardcode coordinator IDs or names.
- Ensure the requirement works for both create and edit modes.
- Report the files changed and any missing backend/API support.