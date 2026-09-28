# Remix of Ocean Wise

Build a completely new production-quality web application from scratch called **ORCA — Ocean Risk & Coastal Awareness**, designed as a Smart India Hackathon-level marine intelligence and decision-support platform.

IMPORTANT: Do NOT remix, preserve, or reuse the existing ORCA/remix implementation. Rebuild the application architecture and UI cleanly from scratch while keeping the core concept of ORCA.

## 1. CORE PURPOSE

ORCA is an AI-assisted marine intelligence dashboard for fishermen, coastal operators, maritime users and authorities.

It should combine:

* live weather information
* live marine/ocean conditions
* location-aware marine intelligence
* potential fishing-zone discovery
* restricted/protected/hazard-area awareness
* route planning
* marine warnings/advisories
* evidence/source transparency
* multilingual conversation
* explainable decision support

ORCA is a DECISION-SUPPORT system, NOT certified navigation software and NOT an official government warning system.

Every relevant screen must clearly distinguish LIVE data from DEMO/FALLBACK data.

## 2. LIVE DATA / APIs

Implement real public APIs wherever possible without requiring paid API keys.

Use:

* Open-Meteo Forecast API for weather
* Open-Meteo Marine API for marine/ocean conditions

The application must dynamically request data based on the CURRENT SELECTED LOCATION and selected/requested date/time.

Do NOT hard-code Mumbai as the operating location.

If the user selects Veraval, all relevant weather/marine information, map focus, labels and calculations must use Veraval.
If the user selects Mumbai, use Mumbai.
If the user selects Porbandar, use Porbandar.
Support other Indian coastal locations as well.

Use a proper location configuration containing at minimum:

* Veraval, Gujarat
* Porbandar, Gujarat
* Mumbai, Maharashtra
* Diu
* Kochi, Kerala
* Chennai, Tamil Nadu
* Visakhapatnam, Andhra Pradesh
* Kolkata/Sundarbans coastal region

Allow adding more locations easily.

If an API request fails, show the most recent valid data if available; otherwise use clearly labelled DEMO DATA. Never silently present fake values as live data.

## 3. LOCATION BEHAVIOR — VERY IMPORTANT

The selected location must be a single source of truth.

When location changes:

* map center changes
* coordinates change
* weather changes
* marine conditions change
* fishing-zone suggestions change
* route calculations use the new location
* nearby hazards change
* location name displayed throughout the dashboard changes
* weather timestamps update
* question suggestions update where appropriate

NEVER keep Mumbai data after selecting Veraval.

The user's natural-language question must also be able to override the selected location when the question explicitly contains another supported location.

Example:
Selected location = Mumbai
Question = "What are ocean conditions near Veraval?"
The answer should use Veraval.

If the user asks "near here", use the selected location.

## 4. CHAT / AI INTERACTION

Create a genuinely functional ORCA conversation interface.

The user can ask questions such as:

* What are the ocean conditions near Veraval?
* Is it safe to fish near Veraval tomorrow morning?
* Show potential fishing zones near Mumbai.
* Are there marine warnings near Porbandar?
* Plan a route avoiding restricted waters.
* Compare Veraval and Porbandar conditions.
* What is the wind speed tomorrow at 6 AM?
* Which fishing zone has better conditions?

Do NOT return the same fixed answer for different questions.

Parse:

* intent
* location
* date
* time
* language
* requested information type

Use the parsed information to retrieve the appropriate data.

Maintain conversation context across multiple turns.

Example:
User: "What is the weather near Veraval?"
Assistant answers Veraval.
User: "What about tomorrow morning?"
Assistant understands "tomorrow morning" refers to Veraval rather than resetting to Mumbai.

## 5. LANGUAGE SYSTEM — ENGLISH + HINDI + GUJARATI ONLY

Provide exactly three languages:

* English
* हिन्दी
* ગુજરાતી

Remove/avoid Marathi, Tamil, Malayalam, Bengali and other language options.

Changing language must translate the ENTIRE USER INTERFACE, not merely the AI answer.

This includes:

* navigation labels
* headings
* buttons
* cards
* section titles
* map controls
* weather labels
* ocean labels
* warnings
* route labels
* fishing-zone labels
* evidence labels
* status messages
* placeholders
* suggested questions
* validation/error messages
* AI responses
* conversation history
* dynamically generated UI text where practical

MOST IMPORTANT:
When Gujarati/Hindi is selected, both the USER QUESTION and the ASSISTANT RESPONSE displayed in the conversation must appear in that selected language.

If a user types in English while Gujarati is selected, translate/display the submitted question in Gujarati while preserving the original internally if needed.

If a user types Gujarati/Hindi, detect it correctly and keep the conversation in the selected language unless the user explicitly changes language.

Do not translate:

* API names
* scientific abbreviations
* coordinates
* units
* proper technical names where translation would reduce clarity

The language selector must actually change the UI immediately.

## 6. MAP / GEOSPATIAL VIEW

Create a useful interactive marine map.

Show:

* current selected location
* coastline
* ports
* potential fishing zones
* restricted areas
* protected areas
* hazard areas
* shipping lanes
* maritime boundaries
* route candidates

The map must visually correspond to the selected location.

Do not show random circles or decorative map objects that have no functional meaning.

Use clean map styling with readable labels and a proper legend.

Clicking a map object should provide useful information.

## 7. POTENTIAL FISHING ZONES

Create a functional PFZ section.

Each zone should contain:

* zone name
* distance
* coordinates
* estimated suitability score
* sea-surface temperature
* chlorophyll where available
* depth where available
* confidence
* explanation
* relevant fish/species information when demo data is used

Clearly label simulated/demo PFZ information if it is not sourced from a live official feed.

PFZ recommendations should change with the selected location.

## 8. OCEAN CONDITIONS

Create a clean ocean conditions section showing available live marine data such as:

* wave height
* wave direction
* swell period
* sea-surface temperature
* ocean current
* wind
* gusts

Use appropriate units and timestamps.

Do not invent live data.

## 9. WEATHER

Create a proper weather intelligence panel:

* wind speed
* wind direction
* gusts
* visibility
* precipitation/rain chance where available
* temperature
* forecast timestamp

Allow useful forecast time selection.

Show LIVE/DEMO status clearly.

## 10. SAFETY / RISK

Create a risk assessment based on available conditions.

Consider:

* wind
* gusts
* wave height
* visibility
* precipitation
* restricted areas
* hazards
* route proximity to dangerous areas

Show:

* risk level
* reasons
* supporting data
* timestamp
* clear disclaimer

Do not claim that ORCA provides official safety certification.

## 11. ROUTE PLANNING

Create functional route-planning UI.

User should be able to:

* select origin
* select destination
* request a route
* avoid restricted areas
* avoid hazard areas
* see distance
* see estimated travel time
* see warnings
* compare candidate routes

Visualize routes on the map.

If real routing data is unavailable, provide a clearly labelled demo route engine rather than pretending it is official navigation.

## 12. MARINE WARNINGS

Create a Marine Alerts section.

Separate:

* LIVE API information
* official-source information when actually available
* DEMO information

Never claim to have official IMD/INCOIS/Coast Guard warnings unless the application actually retrieved them.

For unavailable official feeds, explicitly say that ORCA cannot verify official warnings and advise users to consult official authorities.

## 13. EVIDENCE / EXPLAINABILITY

Create an Evidence & Sources area.

For every important recommendation, show:

* source
* data type
* timestamp
* live/demo status
* why the information affects the recommendation

Examples:

* Open-Meteo Forecast API
* Open-Meteo Marine API
* official source placeholder only when actually connected
* demo geospatial dataset
* internal calculation/model

Do NOT create fake citations.

## 14. DASHBOARD STRUCTURE

Create a clean professional dashboard with logical sections:

Top navigation:

* ORCA logo/name
* system status
* language selector
* location selector
* user/operator area

Main dashboard:

1. ORCA Conversation
2. Marine/Geospatial Map
3. Weather Intelligence
4. Ocean Conditions
5. Potential Fishing Zones
6. Route Planning
7. Risk/Safety
8. Marine Alerts
9. Agent/System Status
10. Evidence & Sources

Make the hierarchy obvious.

Avoid excessive cards. Sections must have meaningful content and functionality.

## 15. NO EMPTY / USELESS SECTIONS

Do NOT create sections that merely contain:

* placeholder text
* decorative headings
* fake agent names
* empty boxes
* repeated information
* meaningless percentages
* fake activity logs

Every visible section must provide useful information or an obvious interactive purpose.

If data is unavailable, show a compact and honest empty state explaining why.

Do not create giant gaps between sections.

Do not leave unexplained blank areas.

The dashboard should flow naturally from one section to another.

## 16. RESPONSIVE DESIGN

The application must work properly on:

* desktop
* laptop
* tablet
* mobile

On smaller screens, stack sections intelligently instead of creating horizontal overflow.

No clipped text.
No overlapping cards.
No broken map.
No unusable chat box.
No giant blank spaces.

## 17. VISUAL DESIGN

Use a sophisticated maritime intelligence visual language:

* dark navy/deep ocean background
* restrained cyan/teal accents
* subtle borders
* strong typography hierarchy
* high readability
* professional information-dense layout
* consistent spacing
* accessible contrast

Do NOT make it look like a generic AI-generated landing page.

It should look like a serious operational intelligence product.

## 18. STRICTLY AVOID THESE 30 VIBE-CODED DESIGN PROBLEMS

Treat this list as a HARD constraint.

DO NOT use:

1. harsh gradients
2. excessive Lucide/icon decoration
3. large pure-white generic backgrounds
4. rainbow coloring
5. excessive drop shadows
6. repetitive three-feature-card rows
7. unnecessary emojis
8. excessive liquid-glass effects
9. unnecessary em-dashes
10. generic Inter/Geist/Space Grotesk "AI startup" styling as the entire design identity
11. decorative colored left stripes
12. fake testimonials
13. generic bento grids
14. fake terminal-window UI
15. cliché copy such as "it's not X, it's Y"
16. fake checkmark bullet marketing sections
17. generic three-tier pricing
18. fake/non-functional product demonstrations
19. excessive soft rounded corner cards
20. purple-and-black generic AI aesthetic
21. fake skeleton loaders where loading states are unnecessary
22. decorative radial orbs
23. decorative dot-grid backgrounds
24. sparkle icons
25. animated decorative arrows
26. missing Terms/usage information
27. missing privacy/data-use information
28. excessive hover animations
29. neon colors
30. generic pastel colors

These rules apply throughout the entire application.

Use animation only when it communicates real state, such as loading, live updates, transitions or map interaction.

## 19. PRIVACY / TERMS

Add appropriate:

* Privacy
* Terms / Usage
* Data disclaimer
* Marine safety disclaimer

Do not make them fake legal claims.

Clearly explain that ORCA is decision support and users must follow official maritime guidance.

## 20. DATA STATUS

Every live-data component should visibly communicate:
LIVE / DEMO / UNAVAILABLE.

Include:

* last updated time
* source
* fallback state if needed

Never silently convert demo information into live information.

## 21. PERFORMANCE

Keep the interface responsive.

Avoid:

* unnecessary API calls
* repeated API requests
* huge animations
* excessive rendering
* duplicated state

Cache appropriate forecast requests for a reasonable short period.

Handle API errors gracefully.

## 22. ACCESSIBILITY

Provide:

* readable text
* sufficient contrast
* keyboard-friendly controls
* clear focus states
* accessible labels
* meaningful button names
* non-color-only risk indicators

## 23. ERROR HANDLING

Handle:

* API failure
* invalid location
* unavailable forecast
* invalid date/time
* empty search
* network failure
* unsupported question
* missing route

Never crash the dashboard.

Show useful error messages in the selected language.

## 24. DEMO DATA

Create a realistic local fallback dataset for:

* fishing zones
* restricted areas
* hazards
* ports
* routes
* alerts

Make the fallback data geographically coherent.

Do NOT pretend demo data is live.

## 25. CODE QUALITY

Use a clean component architecture.

Separate:

* API services
* location state
* language/translation system
* chat/query interpretation
* map data
* PFZ data
* risk calculations
* route logic
* reusable UI components

Avoid duplicating large blocks of code.

Use clear names and maintainable TypeScript/React code.

## 26. IMPORTANT FUNCTIONAL TESTS

Before considering the build complete, test these scenarios:

A. Select English + Veraval.
B. Select Hindi + Veraval.
C. Select Gujarati + Veraval.
D. Ask the same question in all three languages.
E. Verify both USER QUESTION and AI ANSWER appear in the selected language.
F. Change location from Veraval to Mumbai and verify ALL relevant data changes.
G. Change Mumbai → Porbandar and verify no Mumbai data remains.
H. Ask "What are conditions near Veraval?" while Mumbai is selected and verify the question's location overrides the selected location.
I. Ask a follow-up such as "What about tomorrow morning?" and verify conversation context.
J. Disconnect/fail an API and verify DEMO fallback is clearly labelled.
K. Verify map, weather, ocean conditions and PFZ all correspond to the same selected location.
L. Verify no section contains unexplained large gaps.
M. Verify no section exists purely for decoration.
N. Verify mobile layout.
O. Verify all buttons actually perform an action or are removed.
P. Verify language selector changes the entire UI, not just the answer.
Q. Verify location selector actually controls the dashboard.
R. Verify route planning does not claim official navigation.
S. Verify warnings are never presented as official unless actually sourced.
T. Verify LIVE/DEMO labels and timestamps are accurate.

## 27. FINAL QUALITY BAR

Do NOT stop after creating a basic prototype.

The final result should feel like a polished SIH prototype that can be demonstrated live in front of judges.

Prioritize:

1. real functionality
2. correct location handling
3. correct multilingual behavior
4. useful marine intelligence
5. reliable API/fallback behavior
6. clear explainability
7. professional visual hierarchy
8. responsive layout
9. clean spacing
10. trustworthy data-status communication

Do not ask me follow-up questions. Make reasonable implementation decisions yourself.

Build the complete application now, run the available tests, fix errors, verify the major user flows, and leave the project in a working state.

Do not leave planned features as TODOs or placeholders if they can reasonably be implemented in this build.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5ccd48ce-87d2-43ff-b67b-5e1218206fa9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
