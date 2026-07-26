# DevCircle Design System

Source of truth: [app/Auth/login/page.tsx](app/Auth/login/page.tsx) and [app/Auth/signup/page.tsx](app/Auth/signup/page.tsx).
These hand-styled screens are the canonical look — not the shadcn defaults in `components/ui/*`, whose
CSS variables (`--card`, `--input`, `--primary`, …) are still set to shadcn's light/gray theme because
`.dark` is never applied anywhere in [app/layout.tsx](app/layout.tsx). Until that's wired up, use the raw
hex values below rather than the semantic `bg-card` / `bg-primary` tokens — they won't render correctly.

## Color tokens

| Role                  | Value                | Tailwind usage                          |
|-----------------------|----------------------|------------------------------------------|
| Page background       | `#0F1117`            | `bg-[#0F1117]`                            |
| Surface / card        | `#1A1D27`            | `bg-[#1A1D27]`                            |
| Border / divider      | `#2A2D3A`            | `border-[#2A2D3A]`                        |
| Primary text          | `#FFFFFF`            | `text-white`                              |
| Muted / secondary text| `#8B8FA8`            | `text-[#8B8FA8]`                          |
| Accent (primary CTA)  | `#1D9E75`            | `bg-[#1D9E75]` / `text-[#1D9E75]`         |
| Accent hover          | `#17876A`            | `hover:bg-[#17876A]`                      |
| Error background      | `red-500 @ 10%`      | `bg-red-500/10`                           |
| Error border           | `red-500 @ 30%`      | `border-red-500/30`                       |
| Error text            | `red-400`            | `text-red-400`                            |

No blue, purple, or other accent color appears anywhere in the app — **`#1D9E75` (green) is the only
accent color**. Anything styled with `blue-*` is a deviation from this system.

## Typography

- Font: default `font-sans` (Inter / Geist, set globally in `layout.tsx`).
- Page heading: `text-2xl font-bold text-white` (e.g. "Welcome back").
- Subheading / description: `text-[#8B8FA8]` under the heading, `mb-6` before the form.
- Field label: `text-sm text-[#8B8FA8] mb-1 block`.
- Body text: `text-sm` or `text-base`, `text-white`.

## Spacing & radius

- Card padding: `p-8` for auth screens, `p-6` for feed cards/composer.
- Card corner radius: `rounded-xl`.
- Input/button corner radius: `rounded-lg`.
- Chip/pill radius: `rounded-full`.
- Vertical rhythm between form fields: `space-y-4`.

## Components

### Surface card
```

  className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-8 w-full max-w-md"

```

### Text input
```

  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-4 py-2.5
             text-white placeholder-[#8B8FA8] focus:outline-none focus:border-[#1D9E75] text-sm"

```
Always paired with a label above it:
```

<label className="text-sm text-[#8B8FA8] mb-1 block">Email</label>
```

### Primary button
```

  className="w-full bg-[#1D9E75] hover:bg-[#17876A] text-white font-medium py-2.5
             rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

```
Use `h-auto gap-2` alongside this when rendering an icon (e.g. `<LogIn />`) via the shadcn `Button`.

### Ghost / secondary action
No dedicated ghost style exists yet in auth screens; the composer (`components/createPost.tsx`)
uses `text-[#8B8FA8] hover:text-white hover:bg-[#2A2D3A]` for a low-emphasis "Cancel" action —
treat that as the ghost-button convention going forward.

### Error banner
```

  className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm"

```

### Inline link
```

  className="text-[#1D9E75] hover:underline"

```

### Avatar (initial-letter circle)
```

  className="w-10 h-10 bg-[#2A2D3A] rounded-full flex items-center justify-center text-white font-bold"

```

### Tag / pill chip
```

  className="bg-[#2A2D3A] text-[#8B8FA8] rounded-full px-3 py-1 text-xs"

```

## Known inconsistencies to reconcile

- `components/createPost.tsx`'s submit button currently uses `bg-blue-600 hover:bg-blue-500` — this
  should be `bg-[#1D9E75] hover:bg-[#17876A]` to match the accent color used everywhere else.
- `components/ui/{button,input,card,label}.tsx` (shadcn) rely on theme CSS variables that resolve to a
  light gray palette, not this dark system. Either wire up `.dark` on `<html>` and update the variables
  in `app/globals.css` to match the hex values above, or keep bypassing them with raw hex classes as
  done in the auth pages, `postCard.tsx`, and `createPost.tsx`.
