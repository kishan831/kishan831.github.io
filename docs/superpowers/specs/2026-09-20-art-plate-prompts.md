# Art Plate Prompts — Pause Menu Portfolio

**Date:** 2026-09-20
**Companion to:** `2026-09-20-portfolio-pause-menu-design.md` §6

Nine plates must read as one artist's work. Four blocks make that happen, and three of them never change.

- **Style lock** and **character lock** are pasted verbatim into every prompt. Never paraphrase them; paraphrasing is what makes a set drift.
- **Dark anchor** and **composition reserve** change wording slightly per scene, but the intent is fixed.
- Only the **scene** block is genuinely new each time.

Reference portrait: `5818.jpeg`, passed as an `image_references` media on every generation.
Model used for the cost preflight: `gpt_image_2_5`, 16:9, quality `high`, resolution `2k` — 3 credits per plate, 27 for the set.

---

## Block 1 — Style lock (verbatim, every prompt)

> STYLE LOCK: Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing.

## Block 2 — Character lock (verbatim, every prompt)

> CHARACTER LOCK: a single male subject, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Same face, same hair, same outfit in every image.

The plain black shirt is deliberate, and it is what Kishan's own first generated plate already uses. It is simple enough that the model reproduces it reliably, it reads cleanly against neon rim light, and it echoes the dark shirt in the reference photograph. Locking wardrobe in the prompt — rather than leaving it to the model — removes the single largest source of set drift.

## Block 3 — Dark anchor (every prompt, scene-adapted)

> DARK ANCHOR: a deep shadowed structural element occupies one side of the frame — [scene-specific] — holding the value range so the illustration never flattens.

This matters most on the bright plates. Without an explicit dark mass, the illustration style collapses toward flat stock rendering the moment a scene goes bright. Screens 2, 3 and 4 are the ones at risk.

## Block 4 — Composition reserve (every prompt, scene-adapted)

> COMPOSITION RESERVE: the left third of the frame and the bottom-left corner stay visually quiet and uncluttered — [open sky / water / wall / road surface] — reserved for interface overlay; the subject sits right of centre.

The menu occupies the left third and the minimap sits bottom-left. This is a generation constraint, not a crop applied afterwards — cropping to fit is what produces awkward, off-balance plates.

---

## The nine scenes

Times of day run as a full day cycle so the set reads as one journey rather than nine unrelated skies.

### 1 — START GAME · sunset · `#FF3E88` · THE STRIP

> SCENE: he leans against the front wing of a dark low-slung sports car on a palm-lined beachfront boulevard at golden-hour sunset, neon signage glowing along the strip behind him, hot pink and magenta sky grading to deep orange at the horizon, pink neon rim light along his shoulders and jaw, wet asphalt reflecting the neon.
>
> DARK ANCHOR: silhouetted palms and the dark car body on the right of frame.
> COMPOSITION RESERVE: open sky and empty wet road on the left third.

### 2 — ABOUT ME · morning · `#FF8A3D` · NEON DISTRICT

> SCENE: he sits on a low concrete seawall along an empty promenade in early morning light, ocean and pale haze behind him, warm orange sun low and to the right casting long shadows, a few gulls, pastel art-deco facades softly out of focus in the distance.
>
> DARK ANCHOR: a heavily shadowed palm trunk and railing crossing the right foreground.
> COMPOSITION RESERVE: flat open water and sky across the left third.

### 3 — SKILLS · overcast noon · `#7C6CFF` · THE WORKSHOP

> SCENE: he sits at a workstation beside a floor-to-ceiling rain-streaked window, three monitors glowing cool violet across his face, an overcast grey-violet city visible beyond the glass, keyboard and scattered notes on the desk, the room itself dim.
>
> DARK ANCHOR: the unlit interior wall and ceiling filling the right half of the frame in deep shadow.
> COMPOSITION RESERVE: the rain-streaked window glass across the left third, empty but for water.

### 4 — PROJECTS · bright day · `#19C8FF` · SLOT EMPIRE

> SCENE: he stands on an art-deco beachfront terrace under a hard bright midday sun, cyan sky and turquoise sea behind, a laptop and sunglasses on a white table beside him, tall palms, pastel hotel facades receding down the strip.
>
> DARK ANCHOR: a deep-shade awning and its cast shadow occupying the top-right and right edge of the frame.
> COMPOSITION RESERVE: flat sea and sky across the left third.

### 5 — EXPERIENCE · blue hour · `#5B7CFF` · BILIONS HQ

> SCENE: he stands at a rooftop parapet at blue hour, back three-quarters to camera, looking out over a freeway interchange streaming with light trails toward a distant downtown skyline, deep indigo sky with the last band of warmth at the horizon.
>
> DARK ANCHOR: the parapet and rooftop plant silhouetted almost black across the bottom and right of frame.
> COMPOSITION RESERVE: open indigo sky across the left third.

### 6 — ACHIEVEMENTS · night, neon · `#FF2E63` · TROPHY ROOM

> SCENE: he stands beneath a glowing theatre marquee on a rain-slick downtown street at night, crimson and magenta neon signage stacked above and behind him, puddles mirroring the signs, wet pavement, a dark car parked at the kerb.
>
> DARK ANCHOR: unlit building facades in near-black filling the left background and right edge.
> COMPOSITION RESERVE: empty wet pavement across the bottom-left, sign glow only.

### 7 — GARAGE · dusk · `#FFB43D` · THE GARAGE

> SCENE: he stands in the open bay of a workshop at dusk, a car raised on a lift behind him, tools racked along the wall, warm sodium and amber worklight spilling out across the forecourt, deep blue dusk sky visible through the open bay door.
>
> DARK ANCHOR: the unlit depth of the workshop interior, near-black, filling the right of frame.
> COMPOSITION RESERVE: the plain forecourt floor and dusk sky through the bay opening on the left third.

### 8 — CONTACT · late night · `#3DD6FF` · SAFEHOUSE

> SCENE: he sits on the bonnet of a dark car in an empty floodlit lot late at night, phone in one hand, cool ice-blue moonlight and a single distant sodium lamp, low mist across the tarmac, city glow faint on the horizon.
>
> DARK ANCHOR: the black mass of the car and the unlit lot edge across the right and bottom of frame.
> COMPOSITION RESERVE: empty misted tarmac and night sky across the left third.

### 9 — EXIT GAME · dawn · `#FF9E6B` · SUNSET CAUSEWAY

> SCENE: he walks away from camera down a long empty causeway at dawn, a dark car parked behind him at the kerb, coral and peach sky over calm water on both sides, low sun directly ahead flaring, palms lining the far end.
>
> DARK ANCHOR: the causeway railing and the parked car silhouetted dark across the right foreground.
> COMPOSITION RESERVE: calm water and pale dawn sky across the left third.

---

## Fix-it table

Symptoms that show up mid-set, and what to change. Change one thing at a time — changing several at once makes it impossible to tell what worked.

| Symptom | Cause | Fix |
|---|---|---|
| Face drifts between plates | Reference weight too low, or the character block was paraphrased | Re-paste the character block verbatim; keep the same reference media on every call |
| Outfit changes | Wardrobe left implicit for that scene | The wardrobe sentence is part of the character lock, not the scene — it must be present every time |
| Style flattens into stock photography | Bright scene with no dark mass | Strengthen the dark anchor; name a specific object, not just "shadow" |
| Plates do not look like one set | Times of day drifting from the plan | Regenerate against the day-cycle table rather than judging each plate alone |
| Subject centred, menu would sit on him | Composition reserve ignored | Restate the reserve and add "subject in the right third of frame" |
| Colour does not match the screen accent | Accent named only as a hex code | Describe the colour in words as well — "hot pink and magenta", not `#FF3E88` |
| Text or signage renders as gibberish | Model inventing lettering | Add "no legible text, no readable signage, no lettering" to the scene |
| Face looks like a different person entirely | Reference too small or too busy | Supply a tighter head-and-shoulders reference; the full-body wedding photo is workable but not ideal |

---

## Review method

Generate the set as a batch and review all nine **side by side at thumbnail size**. Set consistency is a property of the set, not of any single image, and a plate that looks great alone will often be the one breaking the group. Judge face, wardrobe, colour temperature progression and left-third clearance in that order.

---

# Paste-ready prompts

Each prompt below is complete and self-contained — all four blocks already assembled. Copy one, paste it, generate, move to the next.

## How to run these in ChatGPT

1. **One conversation for all nine.** Do not start a fresh chat per image. Consistency comes largely from the model holding the earlier plates in context.
2. **Upload the reference photo first**, before prompt 1, with the message: *"This is the person. Keep this exact face, hair and build in every image I ask for in this conversation."*
3. **Generate in order, 1 through 9.** The day cycle runs sunset → morning → noon → day → blue hour → night → dusk → late night → dawn, and generating out of order makes drift harder to spot.
4. **Ask for 16:9 landscape.** If the output comes back square or portrait, say "regenerate as 16:9 landscape" rather than re-pasting the whole prompt.
5. **After plate 3, check back against plate 1.** If the face has moved, re-upload the reference before continuing rather than pushing on.
6. **Save as** `plate-1-start.png` … `plate-9-exit.png` and drop them in `public/plates/`.

Every prompt already ends with a no-text instruction. Leave it in — invented signage renders as gibberish and dates the image instantly.

---

### Prompt 1 — START GAME · sunset · THE STRIP

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he leans against the front wing of a dark low-slung sports car on a palm-lined beachfront boulevard at golden-hour sunset. Neon signage glows along the strip behind him. Hot pink and magenta sky grading to deep orange at the horizon. Pink neon rim light along his shoulders and jaw. Wet asphalt reflecting the neon.

Silhouetted palms and the dark car body form a deep shadow mass on the right of frame, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — open sky and empty wet road only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```

### Prompt 2 — ABOUT ME · morning · NEON DISTRICT

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he sits on a low concrete seawall along an empty promenade in early morning light. Ocean and pale haze behind him. Warm orange sun low and to the right, casting long shadows. A few gulls. Pastel art-deco facades softly out of focus in the distance.

A heavily shadowed palm trunk and railing cross the right foreground as a deep shadow mass, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — flat open water and sky only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```

### Prompt 3 — SKILLS · overcast noon · THE WORKSHOP

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he sits at a workstation beside a floor-to-ceiling rain-streaked window. Three monitors glow cool violet across his face. An overcast grey-violet city is visible beyond the glass. Keyboard and scattered notes on the desk. The room itself is dim.

The unlit interior wall and ceiling fill the right half of the frame in deep shadow, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — rain-streaked window glass, empty but for running water. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering or UI text on the monitors.
```

### Prompt 4 — PROJECTS · bright day · SLOT EMPIRE

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he stands on an art-deco beachfront terrace under a hard bright midday sun. Cyan sky and turquoise sea behind him. A laptop and sunglasses on a white table beside him. Tall palms. Pastel hotel facades receding down the strip.

A deep-shade awning and its cast shadow occupy the top-right and right edge of the frame as a dark mass, holding the value range so the illustration never flattens in the bright light.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — flat sea and sky only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```

### Prompt 5 — EXPERIENCE · blue hour · BILIONS HQ

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he stands at a rooftop parapet at blue hour, three-quarters turned away from camera, looking out over a freeway interchange streaming with vehicle light trails toward a distant downtown skyline. Deep indigo sky with the last band of warmth at the horizon.

The parapet and a rooftop plant are silhouetted almost black across the bottom and right of frame as a deep shadow mass, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — open indigo sky only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```

### Prompt 6 — ACHIEVEMENTS · night, neon · TROPHY ROOM

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he stands beneath a glowing theatre marquee on a rain-slick downtown street at night. Crimson and magenta neon signage stacked above and behind him. Puddles mirroring the signs. Wet pavement. A dark car parked at the kerb.

Unlit building facades in near-black fill the left background and right edge as a deep shadow mass, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — empty wet pavement with sign glow only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering on the marquee or any sign.
```

### Prompt 7 — GARAGE · dusk · THE GARAGE

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he stands in the open bay of a workshop at dusk. A car is raised on a lift behind him. Tools racked along the wall. Warm sodium and amber worklight spills out across the forecourt. Deep blue dusk sky visible through the open bay door.

The unlit depth of the workshop interior, near-black, fills the right of frame as a deep shadow mass, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — plain forecourt floor and dusk sky through the bay opening. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```

### Prompt 8 — CONTACT · late night · SAFEHOUSE

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Confident, neutral expression. Keep this exact face, hair and outfit.

Scene: he sits on the bonnet of a dark car in an empty floodlit lot late at night, phone in one hand. Cool ice-blue moonlight and a single distant sodium lamp. Low mist across the tarmac. City glow faint on the horizon.

The black mass of the car and the unlit lot edge run across the right and bottom of frame as a deep shadow, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — empty misted tarmac and night sky only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```

### Prompt 9 — EXIT GAME · dawn · SUNSET CAUSEWAY

```
Stylised cinematic key art in the illustrated-realism style of modern open-world crime game cover art — hand-painted digital illustration built over photographic structure, clean confident edges, rich saturated colour, strong rim lighting, fine film grain, slight chromatic aberration at the frame edges, shallow depth of field, 35mm anamorphic framing. 16:9 landscape.

Subject: a single male, Indian, late twenties, short black hair swept back, light beard and moustache, medium athletic build, wearing a plain black button-down shirt with the sleeves slightly rolled, and black trousers. Seen from behind, walking away. Keep this exact hair, build and outfit.

Scene: he walks away from camera down a long empty causeway at dawn. A dark car is parked behind him at the kerb. Coral and peach sky over calm water on both sides. Low sun directly ahead, flaring. Palms lining the far end of the causeway.

The causeway railing and the parked car are silhouetted dark across the right foreground as a deep shadow mass, holding the value range so the illustration never flattens.

Keep the left third of the frame and the bottom-left corner visually quiet and uncluttered — calm water and pale dawn sky only. Place the subject in the right third of frame.

No legible text, no readable signage, no lettering anywhere in the image.
```
