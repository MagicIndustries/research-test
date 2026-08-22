import { isPatterned, mirrorPlacement, type Placement } from "./mirror.js";

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
}

const TYPE1 = /^(\s*)1(\s+)(\S+)(\s+)(\S+\s+\S+\s+\S+)(\s+)((?:\S+\s+){8}\S+)(\s+)(\S+)\s*$/;

export function mirrorMpd(text: string): RewriteResult {
  const patterned = new Set<string>();
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
    if (isPatterned(p.part)) patterned.add(p.part);
    const r = mirrorPlacement(p);
    placements++;
    const fmt = (v: number) => (Object.is(v, -0) ? "0" : String(+v.toFixed(4)));
    return `${lead}1${s1}${colour}${s2}${fmt(r.x)} ${fmt(r.y)} ${fmt(r.z)}${s3}${r.m.map(fmt).join(" ")}${s4}${part}`;
  });
  return { text: out.join("\n"), placements, patterned: [...patterned] };
}
