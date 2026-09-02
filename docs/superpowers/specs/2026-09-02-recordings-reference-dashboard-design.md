# OCTA Recordings Reference Dashboard Design

## Goal
Replace `/gravacoes` with the supplied dark OCTA reference while preserving the exact sidebar identity already used by the home hero.

## Layout
The page keeps the home sidebar unchanged and uses the same search/top navigation language. The recordings workspace contains a title and filter row, a 3x3 cinematic recordings grid, and a right rail with Skills, meeting report, and OCTA AI. The OCTA AI composer remains fixed along the bottom, matching the home identity.

## Recording customization
Each recording keeps an overflow action that opens an edit dialog. The user can rename the recording and upload a cover image. Titles and optimized cover data URLs are persisted in browser localStorage under `octa-recording-customizations-v1`, keyed by recording id. Uploaded covers are center-cropped and compressed to WebP before persistence.

## Behavior
Search, category filters, sort order, selected-report context, rename, cover upload, and save all work without navigation. The global floating OCTA AI launcher is suppressed on `/gravacoes` because the page already contains its own OCTA AI surfaces.

## Constraints
- Preserve the current home sidebar without redesigning it.
- Do not modify the home hero or other app pages.
- Use black/charcoal glass surfaces, thin Apple-like typography, warm performance accents, and no blue card backgrounds.
- Keep the implementation responsive and prevent cards from overlapping the bottom OCTA AI bar.
