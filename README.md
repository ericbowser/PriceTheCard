# PriceTheCard

A browser-based MTG collection manager. Search any card via Scryfall, track quantities and foil status by printing, and watch your collection's total value update in real time — no account or API key required.

---

## Stack

| Layer | Tech |
|---|---|
| UI | React 18 + Vite |
| Styling | Tailwind CSS (standalone CLI) |
| Data | [Scryfall API](https://scryfall.com/docs/api) |
| Storage | `localStorage` (per-user, no server needed) |

---

## Quick Start

```bash
npm install
npm run tail     # compile Tailwind (required before first run)
npm run dev      # http://localhost:42000
```

> **Tailwind note:** The Vite dev server does **not** recompile `output.css` automatically.  
> Run `npm run tail` again any time you add new utility classes.

---

## Profiles

On first launch a profile picker appears. Type your name and hit **Start**.  
Each profile stores a fully isolated library in `localStorage` — multiple people can use the same machine without data mixing.  
Switch profiles at any time via the `switch profile` link in the header.

---

## Managing Your Collection

### Search
Type any card name and hit **Search**. Results show every printing sorted newest-first. Click a row to preview the card image, oracle text, and prices; use the filter box to narrow a long list by name or set.

### Add to Library
Select a printing, set quantity, check **Foil** if applicable, then click **Add to Library**. Foil and non-foil copies of the same printing are tracked separately.

### Library View
The library is organised as a **set grid** — click any set tile to drill into card images. Adjust quantities inline; remove individual cards with the Remove link.

---

## CSV Import / Export

| Action | Details |
|---|---|
| **Import CSV** | Accepts EchoMTG exports or any CSV with a `Name` column. Columns matched case-insensitively (`Qty` / `quantity` / `count` all work). Re-importing the same file is safe — quantities sync rather than stack. |
| **Export CSV** | Downloads `mtg-[profile]-[date].csv` with name, set, collector number, price, quantity, total value, foil flag, and Scryfall ID. |
| **Clear Library** | Wipes only the active profile's data after confirmation. |

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (port 42000) |
| `npm run tail` | Rebuild Tailwind `output.css` |
| `npm run tail:watch` | Watch mode for active CSS development |
| `npm run build` | Production build |
| `npm run cypress:run` | Record a demo video (dev server must be running) |
| `npm run cypress:open` | Open Cypress interactive runner |

---

## License

See [LICENSE](LICENSE).
