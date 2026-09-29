DESIGN SPEC - FLUENT DESIGN TOKENS
Principles: Neutral UI, primary color used sparingly. Motion = feedback. Shadows = elevation. Borders = structure. Color = meaning.
RULE: DEFAULT role = bare class, no suffix (bg-primary, border-border, text-text). All other roles keep their suffix. Disabled roles (border-disabled/text-disabled/surface-disabled) are distinct tokens, not aliases — always use the dedicated class even where the value currently matches another role.

TYPE: apply text-{token} (size+leading) AND font-{token} (weight) together — same token name, both classes required, neither implies the other.
page-title 36/700/44 | section-title 24/600/32 | card-title 20/600/28 | heading 18/500/26 | body 16/400/24 | secondary 14/400/20 | caption 12/500/16

RADIUS (semantic keys — not raw Tailwind scale): rounded-control(controls) rounded-input(inputs) rounded-card(cards) rounded-modal(modals) rounded-pill(pills)
SHADOW (semantic keys): shadow-flat shadow-card shadow-dropdown shadow-modal
MOTION (ease-out): duration-hover 150 | duration-press 100 | duration-modal 200 | duration-sidebar/duration-toast 250
ICONS (Lucide, spacing scale — apply w- AND h- together, no combined size- utility): icon-small 16 | icon-normal 20 | icon-large 24 | icon-hero 32
MAX-WIDTH: max-w-dashboard(80rem) max-w-forms(36rem) max-w-settings(48rem) max-w-reading(65ch)

SURFACES (0-5): 0=app bg | 1=content well/inputs(extreme value) | 2=cards | 3=elevated cards | 4=dropdowns/hover | 5=reserved. Disabled bg = bg-surface-disabled (own token, currently=3).
Light: 0 #F3F6FB 1 #FFFFFF 2 #F8FAFC 3 #EEF2F8 4 #E6EBF3 5 #DCE4EF
Dark:  0 #0B0F14 1 #070A0E 2 #1A2332 3 #243042 4 #2E3B50 5 #394960

TEXT: text-text-strong / text-text(DEFAULT) / text-text-muted / text-text-subtle / text-text-disabled(own token, ≈subtle)
Light: strong #0F172A DEFAULT #334155 muted #64748B subtle #94A3B8
Dark:  strong #F8FAFC DEFAULT #E2E8F0 muted #94A3B8 subtle #64748B

BORDER: border-border-subtle / border-border(DEFAULT) / border-border-strong / border-border-disabled(own token, ≈subtle)
Light: rgba(15,23,42, .06/.10/.18)   Dark: rgba(255,255,255, .05/.08/.14)

SEMANTIC COLORS: primary=blue secondary=teal danger=red success=green — ALL FOUR carry the full standard Tailwind ramp (50–950) plus 5 named roles on top:
subtle(bg tint) light-50/dark-950 | muted(hover-on-bg) light-100/dark-900 | DEFAULT(solid/icon, bare class) light-600/dark-400 | hover(on DEFAULT) light-700/dark-300 | text(on subtle bg) light-700/dark-300

FOCUS RING: ring-2 ring-offset already resolve to primary + 2px via config defaults — don't write ring-primary/ring-offset-2 unless overriding. Override color for state only (e.g. ring-danger on error). ring-offset-color has a config default now (see tailwind.config.js) — only override per-component if sitting on a non-default surface.

Example classes: text-heading font-heading, rounded-input, shadow-card, bg-surface-disabled, bg-primary-subtle, bg-secondary-700, text-text-disabled, border-border-strong, ring-danger 

Note: this design spec is intended as a guideline. If a situation is encountered where the specs as stated would result in problems with UI design, ignore these spec and mention the issue encountered. 