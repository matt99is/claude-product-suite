# Design Critique Principles Library

Use this as the default source canon for artefact critique. It is intentionally small and durable. Do not research every critique by default; use these principles first, then route to `research` only when the user asks for fresh, competitor, market, or domain-specific evidence.

## Source hierarchy

- Standards and platform guidance carry measurable checks: W3C/WAI WCAG 2.2, Apple Human Interface Guidelines, Material Design and Android accessibility guidance.
- Research-backed UX guidance carries usability interpretation: Nielsen Norman Group heuristics and public Baymard research pages/articles.
- Analyst inference can connect a visible artefact issue to likely user consequences, but it must be labelled as inference when not directly measurable.

## Visual accessibility checks

### Colour contrast

Source: W3C/WAI WCAG 2.2 Success Criterion 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

- Normal text and images of text should meet at least 4.5:1 contrast against the background.
- Large text should meet at least 3:1 contrast.
- Large text is approximately 18pt regular or 14pt bold, equivalent to about 24px regular or 18.5px bold in CSS pixel terms.
- Logos and inactive/decorative text have specific exceptions.
- From a screenshot or image, treat sampled contrast as an estimate unless source colours are available.

### Non-text contrast

Source: W3C/WAI WCAG 2.2 Success Criterion 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

- Visual information needed to identify active UI components and meaningful graphical objects should generally have at least 3:1 contrast against adjacent colours.
- This applies to necessary boundaries, icons, and state indicators such as selected or focused states when visible in the artefact.
- Inactive controls are exempt from the requirement, but may still create comprehension risks if they look too similar to active controls.

### Target size and spacing

Source: W3C/WAI WCAG 2.2 Success Criterion 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

- Pointer targets should be at least 24 by 24 CSS pixels, unless a listed exception applies.
- If a target is smaller than 24 by 24 CSS pixels, it can still pass when sufficient spacing prevents overlap between 24 CSS pixel circles centred on adjacent undersized targets.
- Important controls should preferably exceed the WCAG minimum because the minimum can still be hard to use.

Source: Material Design accessibility guidance: https://m2.material.io/design/usability/accessibility.html

- For most platforms, consider touch targets at least 48 by 48 dp.
- Material notes that iOS commonly recommends 44 by 44 pt.
- Use 48 by 48 dp or 44 by 44 pt as platform best-practice references, not as WCAG conformance claims.

Source: Android accessibility guidance: https://support.google.com/accessibility/android/answer/7101858

- Clickable or touchable elements should generally be large enough for reliable interaction, with Android guidance pointing to at least 48dp width and height.

### Font size and readable text spacing

Source: W3C/WAI WCAG 2.2 Success Criterion 1.4.4 Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html

- Static artefacts cannot prove whether text can be resized to 200 percent without loss of content or functionality.
- They can still reveal likely risks: tiny body text, cramped controls, truncation, or layouts with no room for enlarged text.

Source: W3C/WAI WCAG 2.2 Success Criterion 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html

- Robust layouts should tolerate line height of at least 1.5 times font size, paragraph spacing of at least 2 times font size, letter spacing of at least 0.12 times font size, and word spacing of at least 0.16 times font size without loss of content or functionality.
- In artefact critique, use this as a readability and resilience lens rather than a conformance claim.

## UX critique principles

### Nielsen Norman Group heuristics

Source: Nielsen Norman Group, 10 Usability Heuristics for User Interface Design: https://www.nngroup.com/articles/ten-usability-heuristics/

Use these as general critique lenses:

- Visibility of system status: users need timely feedback about what is happening.
- Match between system and real world: language, concepts, and flows should fit users rather than internal jargon.
- User control and freedom: users need clear ways out of unwanted states.
- Consistency and standards: similar words, actions, and layouts should mean the same thing and follow platform conventions.
- Error prevention: designs should prevent likely mistakes before they happen.
- Recognition rather than recall: key choices, actions, and information should be visible where needed.
- Flexibility and efficiency of use: repeated or expert tasks should not be unnecessarily slow.
- Aesthetic and minimalist design: interfaces should not compete with the primary task through irrelevant content.
- Help users recognize, diagnose, and recover from errors: error states should be plain-language, precise, and constructive.
- Help and documentation: when needed, support should help users complete tasks.

### Baymard public ecommerce and form research

Source: Baymard checkout usability research overview: https://baymard.com/research/checkout-usability
Source: Baymard mobile form label article: https://baymard.com/blog/mobile-form-usability-label-position
Source: Baymard inline labels article: https://baymard.com/blog/mobile-forms-avoid-inline-labels

Use Baymard only when the artefact is ecommerce, checkout, forms, product discovery, product detail, cart, or account/self-service. Publicly citable themes include:

- Form and checkout design can materially affect abandonment and task completion.
- Mobile forms generally benefit from labels above fields because narrow screens otherwise leave too little room for user input and supporting label text.
- Placeholder-only or disappearing inline labels can harm error recovery and memory because users lose the field label after typing.
- Avoid copying premium guideline details that are not visible on public Baymard pages. If deeper Baymard evidence is needed, ask the user whether to run additional research or use their supplied sources.

## Artefact-only limits

Do not claim full accessibility compliance from a static artefact. Static artefacts can support critique of visible layout, hierarchy, contrast, apparent size, spacing, text density, and visible states. They cannot verify keyboard access, screen-reader names, semantic order, DOM structure, focus order, actual hit areas, responsive reflow, dynamic errors, analytics impact, or real user comprehension.
