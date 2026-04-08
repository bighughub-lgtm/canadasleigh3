# AGENTS.md

## Project type
This is a React + Vite single-page landing page project for Canada Pulkan rugged sleds / terrain sleds sold in the Baltics.

## Core working mode
- Always inspect the current project state first.
- Prefer targeted edits over rebuilding from scratch.
- Preserve working sections unless a change is necessary.
- Keep the current component structure if it already works well.
- After implementation, run the build and fix errors before finishing.

## Codex task style
When working on this repo:
- Start by understanding the existing files and components.
- Make scoped edits.
- Avoid unnecessary rewrites.
- Keep code production-friendly and easy to maintain.
- Favor practical, durable solutions over flashy complexity.

## Tech stack
- React
- Vite
- plain CSS
- framer-motion is already available and may be used for restrained animation
- do not add unnecessary dependencies
- do not migrate the project to another stack
- do not add Tailwind
- do not add Bootstrap
- do not add large UI frameworks

## Main commands
- Dev: `npm run dev`
- Build: `npm run build`

## File priorities
Important files and folders:
- `src/App.jsx`
- `src/index.css`
- `src/components/`
- `public/`

## Language rules
- All visible website content must remain in Latvian only.
- Keep the language selector visible:
  - LAT
  - LIT
  - EST
  - ENG
  - RUS
- Only LAT is active for now.
- Other language options are placeholders only.
- Do not implement real multilingual switching yet.

## Brand / factual rules
Keep these facts correct everywhere:
- The sleds are made in Sweden.
- VS Home SIA is the official representative / distributor in the Baltics.
- “Canada Pulkan” is the brand / product name, not proof of Canadian manufacturing.
- Do not write or reintroduce claims such as:
  - “Ražots Kanādā”
  - “Canada Pulkan, Kanāda”
  - “Canada Pulkan ragavas tiek ražotas Kanādā”

## Logo rules
- Main logo file: `/logopng2.png`
- Use the logo in its original colors only.
- Do not apply:
  - tint
  - overlay
  - filter
  - recolor
  - invert
  - gold effect
  - accent-color treatment
- Remove any CSS filters from logo usage.

## Accent color rules
- Use the warm amber / yellow-orange accent direction, not the newer green version.
- Keep accent usage premium and restrained.
- Apply it consistently to:
  - buttons
  - pills
  - labels
  - borders
  - highlights
  - tabs
  - hover states
  - floating controls
- Do not make the accent neon or overly saturated.

## Design direction
The site should feel:
- premium
- Nordic outdoors
- rugged but refined
- dark and elegant
- trustworthy
- structured
- modern
- readable

Avoid:
- generic ecommerce look
- clutter
- over-animation
- random bright colors
- fake luxury styling
- cheesy visual effects

## Copy style
Copy should be:
- clear
- factual
- practical
- premium
- trustworthy
- not overhyped
- not generic AI fluff

Do not use empty marketing language when a concrete factual statement is possible.

## Asset rules
Use local assets from `/public`.

Known important assets:
- `/Vannas LAT.mp4`
- `/logopng2.png`
- `/apvidus kamanas.png`
- `/canadaplukan.jpg`
- `/mazasragavas.jpg`
- `/ragavasbig.png`
- `/DSC06417.jpg`
- `/DSC06432.jpg`
- `/KRJ01720.jpg`
- `/KRJ02257.jpg`
- `/KRJ02364.jpg`
- `/KRJ02427.jpg`

First product detail media:
- `/sm1.jpeg`
- `/sm2.jpeg`
- `/sm3.jpeg`
- `/sm4.jpeg`
- `/sm5.jpeg`
- `/sm6.jpg`
- `/sm7.jpg`
- `/sm8.jpg`
- `/small vid.mp4`

Handle asset paths carefully, especially filenames with spaces.

## Product card rule
The first product card is the priority for detailed expansion.

First product:
- `TERRAINSLEIGH CANADA COMPACT mednieku ragavas (1.4x0.65m, 5kg)`

Requirements for the first product:
- collapsed state must remain clean
- expanded state must be smooth, compact, and premium
- include structured details
- include a compact media viewer
- include local images and the local mp4
- do not turn it into a separate page
- do not make the expanded section cluttered

Other product cards:
- keep visually consistent
- do not break them
- do not overbuild unnecessary expansion logic for all cards unless requested

## Payment / Stripe rules
- Stripe is not connected yet.
- Do not imply that live checkout is already active.
- Keep purchase CTAs visually ready, but honest in wording.
- Leave clear code comments where Stripe URLs can later be inserted.

## Scroll-to-top rule
If a scroll-to-top button exists:
- keep it
- style it with the warm amber accent
- ensure it appears only after meaningful scroll
- ensure smooth scroll and accessibility

## Content integrity rules
Include and preserve these factual ideas where relevant:
- Swedish-made sleds
- HD material / HD polyethylene where appropriate
- suitable for hunting, fishing, agriculture, forestry, expeditions, and heavy hauling
- resilient in harsh terrain
- can withstand heavy use
- not recommended for dragging on gravel roads
- more hygienic transport of game
- official Baltic distributor

## Code quality rules
- Keep code clean and maintainable.
- Use semantic HTML where appropriate.
- Keep responsive behavior strong.
- Avoid unnecessary abstraction.
- Do not leave dead code or broken imports.
- Keep CSS organized and readable.
- Prefer small, surgical edits over broad churn.

## Done means
A task is done only if:
- the requested UI/content changes are implemented
- build passes with `npm run build`
- asset paths work
- no false origin claims remain
- no filtered/recolored logo remains
- the changed files are clearly reported

## Product card refinement rules
The product card section is a priority area and must be handled carefully.

### General rules
- Do not rebuild the full catalog section unless necessary.
- Prefer targeted refinement of the current product-card implementation.
- Keep the section premium, compact, and readable.
- Avoid oversized spacing and bloated expanded panels.
- Maintain strong responsive behavior on desktop, tablet, and mobile.

### CTA hierarchy
For product cards with expandable details:
- Primary accent button label must be `Pirkt`
- Secondary darker / outline button label must be `Pilna informācija`
- Do not use `Sazināties par modeli` as the visible button label in the product card UI
- Keep a final bottom CTA inside expanded details: `Pirkt`
- Leave clear Stripe placeholder comments in code where checkout links should later be inserted

### First product card
First product:
- `TERRAINSLEIGH CANADA COMPACT mednieku ragavas (1.4x0.65m, 5kg)`

Requirements:
- clean collapsed summary
- expandable premium detail area
- structured factual content
- compact media viewer
- support local images and local video
- strong mobile/tablet layout

### Second product card
Second product:
- `TERRAINSLEIGH CANADA CLASSIC mednieku ragavas (2.33x0,85m, 14kg)`

Requirements:
- same expandable premium logic as the first card
- structured detail content
- compact media viewer
- support these local assets:
  - `/b1.jpeg`
  - `/b2.jpeg`
  - `/b3.jpg`
  - `/b4.jpeg`
  - `/b5.jpeg`
  - `/b6.jpeg`
  - `/b7.jpg`

### Product media viewer rules
Inside expandable product cards:
- use one main preview area
- use compact thumbnails
- clicking a thumbnail updates the main preview
- keep the media block compact
- do not let the media block dominate the whole page
- mobile and tablet layouts must remain controlled and usable

### Responsive product rules
Product card UI must be intentionally adapted for:
- desktop
- tablet
- mobile

On smaller screens:
- buttons must stack cleanly
- expanded content must remain compact
- text blocks must stay readable
- media viewer must remain usable
- spacing must be tight but premium

### Factual rules for product cards
Keep these facts correct:
- Swedish-made
- VS Home SIA is the official representative / distributor in the Baltics
- do not reintroduce Canada manufacturing claims
- logo must keep original colors only

### Third product card
Third product:
- `TERRAINSLEIGH CANADA CLASSIC OPEN mednieku ragavas (2.33x0,85m, 14kg)`

Requirements:
- same expandable premium logic as the first and second cards
- structured detail content
- compact media viewer
- support these local assets:
  - `/a1.jpeg`
  - `/a2.jpeg`
  - `/a3.jpeg`
  - `/a4.jpeg`

Important factual note:
- mention that `Xtension` extension can be added separately
- with Xtension, the sled can be extended up to 3.5 m

### Product CTA rule
Across all three product cards:
- primary accent CTA = `Pirkt`
- secondary dark / outline CTA = `Pilna informācija`
- final bottom CTA inside expanded details = `Pirkt`
- keep Stripe insertion comments in code

## Video section rules
- Keep one main active video player.
- Playlist / video card area may become internally scrollable if the number of videos grows.
- Keep the video section compact and easy to scan.
- Avoid oversized playlist cards and excessive vertical height.
- Maintain premium dark styling and amber accent.
- Improve tablet and mobile layout carefully.

## Favicon rule
- Use `/logopng2.png` as the favicon.
- Keep original logo colors.
- Do not recolor or filter the favicon/logo.