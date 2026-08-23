import { isPatterned, mirrorPlacement, type MirrorMode, type Placement } from "./mirror.js";

/**
 * Rewrites an MPD in place, line by line, leaving everything that is not a
 * type-1 reference exactly as it was.
 *
 * Deliberately textual rather than parse-and-reserialise. These templates come
 * out of BrickLink Studio carrying metas this tool has no opinion about --
 * `0 CustomBrick`, `0 NumOfBricks:`, `0 STEP`, submodel structure -- and
 * round-tripping them through a model object would quietly drop whatever it
 * did not understand. A generator that damages its input in ways nobody asked
 * for is worse than one that does less.
 */
export interface RewriteResult {
  text: string;
  placements: number;
  patterned: string[];
  /** Printed parts moved to the mirrored position with their print left unflipped. */
  printsPreserved: string[];
  /** Handed parts swapped for their opposite-handed counterpart, as `from -> to`. */
  handSwapped: string[];
  /**
   * Handed parts with NO counterpart in the library. These were reflected like
   * anything else, which produces a shape no element matches -- the one class
   * of output this tool knows it may have got wrong.
   */
  handUnresolved: string[];
}

/** Looks up a part's opposite-handed counterpart, or undefined if it has none. */
export type HandResolver = (partId: string) => { handed: boolean; counterpart?: string };

/**
 * A part reference always carries its extension; an id looked up from a library
 * header may not. Substituting one raw emits something like `3023b`, which no
 * loader resolves -- the part silently vanishes from the render while the line
 * count stays the same. That happened, to six plates per Legs template.
 */
function withExtension(partId: string): string {
  return /\.(dat|ldr|mpd)$/i.test(partId) ? partId : `${partId}.dat`;
}

const TYPE1 = /^(\s*)1(\s+)(\S+)(\s+)(\S+\s+\S+\s+\S+)(\s+)((?:\S+\s+){8}\S+)(\s+)(\S+)\s*$/;

/**
 * Part ids are carried through untouched apart from a chirality swap.
 *
 * An earlier version rewrote `~Moved to` filenames to their replacement, on the
 * belief that those marked deprecated parts. They do not -- `~Moved to` is an
 * LDraw FILENAME redirect and 3023 is Plate 1x2, in everyday production. The
 * rewrite therefore fixed nothing, and it introduced a real defect: the
 * replacement id comes from a header that carries no extension, so it emitted
 * `3023b`, which no loader resolves, and six plates per Legs template vanished
 * from the render.
 *
 * Whether the SOURCE templates should use current filenames is a question for
 * the templates (emagineer-core #60). It is not this tool's business to answer
 * it silently while doing something else.
 */
export function mirrorMpd(text: string, resolveHand?: HandResolver): RewriteResult {
  const patterned = new Set<string>();
  const prints = new Set<string>();
  const swapped = new Map<string, string>();
  const unresolved = new Set<string>();
  let placements = 0;
  const out = text.split("\n").map((line) => {
    const m = TYPE1.exec(line);
    if (!m) return line;
    const [, lead, s1, colour, s2, pos, s3, rot, s4, part] = m as unknown as string[];
    const nums = [...(pos as string).trim().split(/\s+/), ...(rot as string).trim().split(/\s+/)].map(Number);
    if (nums.some((n) => !Number.isFinite(n))) return line;
    const p: Placement = {
      colour: Number(colour),
      x: nums[0]!, y: nums[1]!, z: nums[2]!,
      m: nums.slice(3, 12),
      part: part as string,
    };
    let emit = p.part;

    // Printed first: its print must not be reflected whatever else is true of
    // it, and a printed part is never swapped for a counterpart, because the
    // counterpart carries a different print.
    let mode: MirrorMode = "reflect";
    if (isPatterned(p.part)) {
      patterned.add(p.part);
      prints.add(p.part);
      mode = "move-only";
    } else {
      const hand = resolveHand?.(emit);
      if (hand?.handed === true) {
        if (hand.counterpart !== undefined) {
          const counterpart = withExtension(hand.counterpart);
          swapped.set(emit, counterpart);
          emit = counterpart;
          mode = "substitute";
        } else {
          unresolved.add(emit);
        }
      }
    }

    const r = mirrorPlacement(p, mode);
    placements++;
    const fmt = (v: number) => (Object.is(v, -0) ? "0" : String(+v.toFixed(4)));
    return `${lead}1${s1}${colour}${s2}${fmt(r.x)} ${fmt(r.y)} ${fmt(r.z)}${s3}${r.m.map(fmt).join(" ")}${s4}${emit}`;
  });
  return {
    text: out.join("\n"),
    placements,
    patterned: [...patterned],
    printsPreserved: [...prints],
    handSwapped: [...swapped].map(([from, to]) => `${from} -> ${to}`),
    handUnresolved: [...unresolved],
  };
}
