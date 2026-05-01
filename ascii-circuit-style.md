# Circuit ASCII Style

A reusable ASCII aesthetic that renders any subject as if it were a printed circuit board. Strong geometric character, technical and schematic, lightly industrial. Reads as *hand-laid* rather than random — symmetry and intentional placement do most of the work.

## Character vocabulary

The style depends on a small, consistent set of glyphs. Treat these as the palette — mixing in unrelated characters will break the PCB illusion.

| Role | Glyphs | Notes |
|---|---|---|
| Chip body / package | `┌` `┐` `└` `┘` `─` `│` | Box-drawing corners and edges form IC outlines. |
| Pin leads | `─┤` `├─` | Short horizontal stubs entering/leaving a package. |
| SMD pads | `▣` | Square pad. Use in arrays inside chips, or as via terminations. |
| Solder dots / joints | `●` | Filled circle. Marks termination points and trace junctions. |
| Vias / component holes | `○` | Open ring. Through-hole drill or test loop. |
| Test points | `·` | Single dot. Scatter sparsely as decoration. |
| Traces (signal) | `─` `│` | Single-weight orthogonal lines. |
| Bus rails | `═` | Double line. Reserve for power/ground edges, never signal. |
| Inline passives | `─○─` | Short ring inline with a trace = resistor/capacitor. |
| Pupil / focal mark | `◉` | Use sparingly — it's the strongest mark in the set. |

Rule of thumb: the more square and right-angled, the more "PCB" it feels. Curves and diagonals undermine the aesthetic.

## Compositional rules

1. **Anchor with packages.** Drop one or two IC-style boxes as visual centers. They're the loudest element and the eye finds them first.

   ```
    ┌────┐
   ─┤▣▣▣▣├─
   ─┤▣◉◉▣├─
   ─┤▣▣▣▣├─
    └─┬┬─┘
   ```

2. **Drop traces from package edges.** Short `│` runs leaving a chip, terminating in `●` solder joints, sell the idea that the package is wired into something.

3. **Run signal lines as dotted traces.** Along any path, alternate solder pads with line segments — e.g. every third cell is `●`, the rest are `─`. This reads as a copper trace with stations along it, not a plain underline.

4. **Branch with vias.** Periodically drop a `│` stub from a trace, terminating in a `▣` pad. These "hanging vias" imply a second routing layer below.

5. **Decorate the negative space sparsely and symmetrically.** Scatter passives — `·` test points, `○` rings, short `─○─` resistor runs, `═` bus rails along edges. Keep it deliberately mirrored across the composition's main axis (e.g. a mark at column 4 should have a counterpart near column 51 on a 56-wide canvas). Symmetry is what makes it read as *designed*.

6. **Reserve `◉` for one or two focal points.** It's the strongest glyph; using it widely flattens the hierarchy.

## Density guidance

- **Dense zones:** package interiors, primary traces, focal points.
- **Medium zones:** trace branches, mid-region passives.
- **Sparse zones:** corners and edges. A few stray `·` and `○` per region — too much and it stops feeling like a clean board.

A useful ratio: roughly **70% empty space, 20% structural marks (packages + traces), 10% ambient passives**.

## Glyph reference (copy-paste ready)

```
┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤
▣ ● ○ · ◉ ═
```

## When this style works

- Logos, headers, ASCII diagrams that want a "made of hardware" feel.
- Loading screens, terminal art, README banners.
- Backgrounds where you want texture without color.

## When it doesn't

- Anything organic (faces, foliage, gestures look stiff in this vocabulary unless you lean into the contrast).
- High-information content — the dense glyph set competes with anything you'd want to read.
- Small canvases (under ~20 columns) — the chip motif needs room to breathe.
