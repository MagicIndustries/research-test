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
  /** Superseded LDraw filenames rewritten to the current one, as `from -> to`. */
  aliasesResolved: string[];
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

/** Looks up a deprecated alias's replacement, or undefined if the part is current. */
export type AliasResolver = (partId: string) => string | undefined;

const TYPE1 = /^(\s*)1(\s+)(\S+)(\s+)(\S+\s+\S+\s+\S+)(\s+)((?:\S+\s+){8}\S+)(\s+)(\S+)\s*$/;

/**
 * `resolveAlias` is optional but wanted. The corpus references five deprecated
 * `~Moved to` aliases across 220 placements, and a newly generated part has no
 * business inheriting one: the alias resolves today and stops resolving when
 * the LDraw library drops it. Carrying it forward would also mean every
 * generated part fails `brickie-check`'s `deprecated` check for a defect it
 * did not introduce.
 */
export function mirrorMpd(text: string, resolveAlias?: AliasResolver, resolveHand?: HandResolver): RewriteResult {
  const patterned = new Set<string>();
  const aliases = new Map<string, string>();
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
    const current = resolveAlias?.(p.part);
    if (current !== undefined) aliases.set(p.part, current);
    let emit = current ?? p.part;

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
          swapped.set(emit, hand.counterpart);
          emit = hand.counterpart;
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
    aliasesResolved: [...aliases].map(([from, to]) => `${from} -> ${to}`),
    printsPreserved: [...prints],
    handSwapped: [...swapped].map(([from, to]) => `${from} -> ${to}`),
    handUnresolved: [...unresolved],
  };
}
