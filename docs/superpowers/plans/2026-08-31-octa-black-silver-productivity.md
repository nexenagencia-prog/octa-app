# OCTA Black/Silver Productivity Implementation Plan

1. Add a regression contract for Agenda, Plans, Hero plan badge, Skills naming/animation, whiteboard productivity controls, fixed shared sidebar and WhatsApp invite picker.
2. Add a final override stylesheet imported after existing refinements to centralize black/liquid-silver visuals and dark-mode harmony.
3. Mark Agenda and Plans surfaces with stable classes and remove blue utility colors from those components.
4. Upgrade the calculator visual treatment through shared classes.
5. Upgrade whiteboard domain/rendering for text objects, bold/font-size controls and smart erasing; fix page sizing so the board is not clipped.
6. Refactor Instant Meeting to reuse DashboardSidebar/ToolOverlayProvider and add participant thumbnail/search/WhatsApp invite picker.
7. Rename Octa skills to Skills and animate charts/progress on mount using a page-level loading class.
8. Add the `Plano Pro` badge to the existing Home hero without changing the approved hero structure.
9. Reconcile stale contracts that explicitly contradict the newer approved requirements, then run contracts/typecheck/build and verify the production deployment.
