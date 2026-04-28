# Application Goals

This document tracks the core requirements and features for the current build.

### Core Features
- [ ] [GOAL-ID: 1] User can paste a Job Description to generate 3 tailored questions.
- [ ] [GOAL-ID: 2] Interface mimics a video call (webcam feed active).
- [ ] [GOAL-ID: 3] Uses Web Speech API to transcribe user answers in real-time.
- [ ] [GOAL-ID: 4] Provides instant "STAR Method" feedback upon ending the answer.

### Design Requirements
- [ ] [GOAL-ID: 5] Fluid layout — fills ≥ 80% of viewport at 1280px desktop width.
- [ ] [GOAL-ID: 6] Responsive at 375px (mobile), 768px (tablet), 1280px (desktop).
- [ ] [GOAL-ID: 7] Visual design matches Phase 1.5 reference image (Dark glassmorphism).
- [ ] [GOAL-ID: 8] Premium obsidian/electric blue color palette.

### Technical Requirements
- [ ] [GOAL-ID: 9] No uncaught console errors on page load.
- [ ] [GOAL-ID: 10] Microphone access is requested and handled gracefully.
- [ ] [GOAL-ID: 11] State persists on page refresh (if applicable).
- [ ] [GOAL-ID: 12] No fixed-width containers (max-width < 60vw) on root layout.

### Monetization (if applicable)
- [ ] [GOAL-ID: 13] Free-tier limit implemented in code (max 1 session before upgrade wall).
- [ ] [GOAL-ID: 14] Upgrade CTA visible in UI after the first session.
