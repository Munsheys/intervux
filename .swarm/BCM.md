# Builder Constraint Manifest (BCM)
> Extracted from BUSINESS_PLAN.md by MA-001

## Hard Constraints (build CANNOT ship without these)
- [x] Primary pain point addressed: Uses Web Speech API for voice-activated roleplay to simulate real interview pressure.
- [x] UVP implemented: Real-time, visual STAR-method grading on spoken answers.
- [x] Free-tier limit in code: Max 1 session before upgrade CTA.
- [x] Upgrade CTA visible: Triggered after the first session completes.
- [x] Target audience friction eliminated: No text typing required for the interview phase.

## Feature Acceptance Criteria
- [x] Feature 1 (Voice Roleplay): Web Speech API transcribes user speech in real-time.
- [x] Feature 2 (STAR Feedback): Interface highlights/scores S-T-A-R components based on the transcript.
- [x] Feature 3 (Context Injection): User can paste a job description on the setup screen to generate questions.

## Non-Negotiable Anti-Patterns
- [ ] Must not be a standard text chat interface (must look like a video call dashboard).
- [ ] Must not have high latency (feedback should process as soon as speech pauses).
- [ ] Must not use generic questions (must be tailored to the provided JD).
