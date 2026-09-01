# OCTA Reference Polish Design

## Goal
Polish the existing OCTA product without changing its approved information architecture, using the four supplied references only as visual-language inspiration: dark glass, black surfaces, liquid silver highlights, controlled glow, strong numeric hierarchy, and premium depth.

## Scope
- Home: fix the `Hoje` collision in the next-meeting card and prevent the metrics strip from overlapping hero CTAs.
- Instant meeting: move chat to the bottom edge of the vertical video at full width; move Add participant into the meeting header; participant picker exposes exactly two modes, Miniaturas and WhatsApp.
- Calculator: premium black/glass calculator with liquid-silver display and keypad hierarchy while preserving keyboard and calculation behavior.
- Skills: unify Overview, Transcript, Training, and Evolution with black/status-widget styling, silver/white data bars, controlled glow, and no blue-dominant surfaces.
- Plans: retain current plan copy/data while presenting cards in the supplied premium black/silver pricing language.
- Notes: simplify note creation to only Title and Text; keep save behavior and meeting association; black/liquid-silver visual treatment.
- Dark mode: remove blue/cyan page backgrounds and blue-dominant cards from user-facing surfaces, replacing them with black/graphite/silver while preserving semantic success/error colors.
- QA: preserve clickable behavior and verify all changed routes compile in production.

## Constraints
- Do not create a mockup or parallel project.
- Do not replace approved layout structure unless required to fix overlap.
- Keep video 9:16 inside the desktop meeting experience.
- Use the supplied images as style references only, not as copied product content.
- Preserve existing routes, stores, calculator logic, and meeting controls.
