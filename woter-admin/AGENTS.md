# Woter Admin - Rules

## Purpose
This file defines rules for admin app changes in Woter.

## Shared Contracts (Required)
- All API request/response typings used in `woter-admin` must come from shared interfaces in `woter-library`.
- Do not define duplicated API contract interfaces locally when a shared contract is required.
- Create or update the contract in `woter-library` first, then import it in admin code.

## Implementation Notes
- Prefer strongly typed service layers for API calls.
- Keep mapping/adaptation logic explicit when backend and UI models differ.
