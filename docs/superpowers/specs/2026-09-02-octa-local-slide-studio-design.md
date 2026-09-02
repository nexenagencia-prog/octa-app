# OCTA Local Slide Studio Design

## Goal
Add a complete local presentation studio to OCTA without Supabase usage.

## Architecture
The new `/criar-slides` route stores decks and binary image assets in IndexedDB on the user's computer. Slides are editable 16:9 documents with independent text, image, and shape elements. PDF/JPEG/PNG imports are converted into editable slide pages that can be reordered and presented locally.

## UX
The fixed hero sidebar gains “Criar slides”. The studio contains a saved-presentation library with first-slide thumbnails and actions to edit, present, rename, duplicate, and delete. The editor provides starter layouts, a central 16:9 canvas, draggable/resizable elements, and a property inspector.

## Visual system
Use the existing OCTA hero language: warm graphite/brown neutrals, translucent glass, soft blur, thin Apple-like typography, no neon, no heavy blue/black surfaces.

## Persistence
No Supabase. Deck metadata and elements are stored in IndexedDB object store `decks`; uploaded images/PDF page renders are stored as blobs in `assets`. Autosave is debounced.

## Global branding
The global fixed sidebar remains the single desktop navigation source and locks the OCTA wordmark and profile name/headline to the same white hero treatment on all non-auth pages.
