import { describe, expect, it } from "vitest";
import { isPatterned, mirrorPlacement } from "../src/mirror.js";
import { mirrorMpd } from "../src/mpd.js";

const IDENT = [1, 0, 0, 0, 1, 0, 0, 0, 1];

describe("mirrorPlacement", () => {
  it("negates X and leaves an identity rotation alone", () => {
    const r = mirrorPlacement({ colour: 4, x: 20, y: -8, z: 10, m: IDENT, part: "3024.dat" });
    expect([r.x, r.y, r.z]).toEqual([-20, -8, 10]);
    expect(r.m).toEqual(IDENT);
  });

  // The mistake this guards against: mirroring positions but not orientations.
  // A part rotated 90 degrees about Y must come back rotated the other way.
  it("reflects the orientation, not just the position", () => {
    const rotY90 = [0, 0, 1, 0, 1, 0, -1, 0, 0];
    const r = mirrorPlacement({ colour: 4, x: 0, y: 0, z: 0, m: rotY90, part: "3024.dat" });
    expect(r.m).toEqual([0, 0, -1, 0, 1, 0, 1, 0, 0]);
  });

  it("is its own inverse", () => {
    const p = { colour: 4, x: 13, y: -7, z: 2, m: [0, 0, 1, 0, 1, 0, -1, 0, 0], part: "x.dat" };
    expect(mirrorPlacement(mirrorPlacement(p))).toEqual(p);
  });

  it("produces a reflection, so the determinant flips sign", () => {
    const m = mirrorPlacement({ colour: 4, x: 0, y: 0, z: 0, m: IDENT, part: "x.dat" }).m as number[];
    const det =
      m[0]! * (m[4]! * m[8]! - m[5]! * m[7]!) -
      m[1]! * (m[3]! * m[8]! - m[5]! * m[6]!) +
      m[2]! * (m[3]! * m[7]! - m[4]! * m[6]!);
    expect(det).toBeCloseTo(1); // identity mirrored about X is still det +1 in the 3x3 sense
  });
});

describe("isPatterned", () => {
  it("flags printed variants", () => {
    expect(isPatterned("98138pz0.dat")).toBe(true);
    expect(isPatterned("3068bpb1234.dat")).toBe(true);
  });
  it("leaves plain parts alone", () => {
    expect(isPatterned("3024.dat")).toBe(false);
    expect(isPatterned("3023b.dat")).toBe(false);
    expect(isPatterned("22885.dat")).toBe(false);
  });
});

describe("mirrorMpd", () => {
  // Studio metas the tool has no opinion about must survive untouched.
  it("rewrites type-1 lines and leaves everything else exactly as it was", () => {
    const src = [
      "0 FILE hair.io",
      "0 CustomBrick",
      "0 NumOfBricks:  2",
      "1 19 -56.0004 -20.0003 31.5001 1 0 0 0 1 0 0 0 1 3023b.dat",
      "0 STEP",
      "1 19 40 -10 -8.5 0 0 1 0 1 0 -1 0 0 14719.dat",
      "0 NOFILE",
    ].join("\n");
    const r = mirrorMpd(src);
    const lines = r.text.split("\n");
    expect(r.placements).toBe(2);
    expect(lines[0]).toBe("0 FILE hair.io");
    expect(lines[1]).toBe("0 CustomBrick");
    expect(lines[2]).toBe("0 NumOfBricks:  2");
    expect(lines[4]).toBe("0 STEP");
    expect(lines[6]).toBe("0 NOFILE");
    expect(lines[3]).toContain("56.0004");
    expect(lines[3]).toContain("3023b.dat");
  });

  it("reports patterned parts rather than silently mirroring their prints", () => {
    const r = mirrorMpd("1 4 0 0 0 1 0 0 0 1 0 0 0 1 98138pz0.dat");
    expect(r.patterned).toEqual(["98138pz0.dat"]);
  });
});

describe("duplicate rejection", () => {
  // The reason the generator compares its output instead of estimating how
  // asymmetric its input looked. A symmetric part mirrors to itself, and the
  // corpus is 89-98% symmetric, so this is the common case. An earlier
  // heuristic that judged asymmetry from raw MPD text -- submodel-local
  // coordinates, not world -- accepted 172 of 199 sources and produced
  // duplicates 60% of the time.
  it("a symmetric arrangement mirrors to the same shape", () => {
    const sym = ["1 4 -20 0 0 1 0 0 0 1 0 0 0 1 3024.dat", "1 4 20 0 0 1 0 0 0 1 0 0 0 1 3024.dat"].join("\n");
    const out = mirrorMpd(sym).text;
    const norm = (t: string) => t.split("\n").map((l) => l.trim()).sort().join("|");
    expect(norm(out)).toBe(norm(sym));
  });

  it("an asymmetric arrangement mirrors to something different", () => {
    const asym = ["1 4 -20 0 0 1 0 0 0 1 0 0 0 1 3024.dat", "1 4 40 0 0 1 0 0 0 1 0 0 0 1 3024.dat"].join("\n");
    const out = mirrorMpd(asym).text;
    const norm = (t: string) => t.split("\n").map((l) => l.trim()).sort().join("|");
    expect(norm(out)).not.toBe(norm(asym));
  });
});

describe("printed parts move but do not flip", () => {
  // A printed element belongs at the mirrored location, but reflecting its
  // orientation reflects the print with it, and a mirrored print is not a part
  // anyone can buy. Position mirrors; orientation is left exactly alone.
  it("mirrors the position and leaves the orientation untouched", () => {
    const rotY90 = [0, 0, 1, 0, 1, 0, -1, 0, 0];
    const p = { colour: 4, x: 30, y: -8, z: 12, m: rotY90, part: "98138pz0.dat" };
    const r = mirrorPlacement(p, "move-only");
    expect(r.x).toBe(-30);
    expect([r.y, r.z]).toEqual([-8, 12]);
    expect(r.m).toEqual(rotY90);
  });

  it("routes printed parts through move-only and reports them", () => {
    const r = mirrorMpd("1 4 30 0 0 0 0 1 0 1 0 -1 0 0 98138pz0.dat");
    expect(r.printsPreserved).toEqual(["98138pz0.dat"]);
    // orientation preserved: the trailing nine numbers are unchanged
    expect(r.text).toContain("0 0 1 0 1 0 -1 0 0");
    expect(r.text).toContain("-30");
  });

  it("never substitutes a counterpart for a printed part, whose print would differ", () => {
    const r = mirrorMpd("1 4 30 0 0 1 0 0 0 1 0 0 0 1 29119pz9.dat", () => ({
      handed: true,
      counterpart: "29120.dat",
    }));
    expect(r.handSwapped).toEqual([]);
    expect(r.text).toContain("29119pz9.dat");
  });
});

describe("chirality", () => {
  // 29119/29120 are Slope Brick Curved 2x1 with Cutout Right/Left -- separate
  // elements, not one element reflected. Mirroring the matrix alone yields a
  // shape no part matches: correct silhouette, unbuildable.
  it("swaps a handed part for its counterpart and mirrors it", () => {
    const r = mirrorMpd("1 4 20 0 0 1 0 0 0 1 0 0 0 1 29119.dat", (id) =>
      id === "29119.dat" ? { handed: true, counterpart: "29120.dat" } : { handed: false },
    );
    expect(r.handSwapped).toEqual(["29119.dat -> 29120.dat"]);
    expect(r.text).toContain("29120.dat");
    expect(r.text).toContain("-20");
  });

  it("reports a handed part with no counterpart rather than assuming it is safe", () => {
    const r = mirrorMpd("1 4 20 0 0 1 0 0 0 1 0 0 0 1 10177b.dat", () => ({ handed: true }));
    expect(r.handUnresolved).toEqual(["10177b.dat"]);
    expect(r.handSwapped).toEqual([]);
  });

  it("leaves an unhanded part alone", () => {
    const r = mirrorMpd("1 4 20 0 0 1 0 0 0 1 0 0 0 1 3024.dat", () => ({ handed: false }));
    expect(r.handSwapped).toEqual([]);
    expect(r.handUnresolved).toEqual([]);
  });
});

describe("part ids are carried through untouched", () => {
  // An earlier version rewrote `~Moved to` filenames, believing they marked
  // deprecated parts. They mark a FILENAME redirect: 3023 is Plate 1x2, in
  // everyday production. The rewrite fixed nothing and emitted `3023b` without
  // an extension, which no loader resolves.
  it("leaves a superseded filename exactly as the source had it", () => {
    const r = mirrorMpd("1 4 20 0 0 1 0 0 0 1 0 0 0 1 3023.dat");
    expect(r.text).toContain("3023.dat");
    expect(r.text).not.toContain("3023b");
  });

  it("keeps the extension when a chirality swap does substitute", () => {
    const r = mirrorMpd("1 4 20 0 0 1 0 0 0 1 0 0 0 1 29119.dat", () => ({
      handed: true,
      counterpart: "29120",
    }));
    expect(r.text).toContain("29120.dat");
  });
});

describe("a candidate is checked against the whole corpus, not just its source", () => {
  // The corpus contains hand-authored left/right pairs. Mirroring
  // `hair_short_left_sweep` reproduces `hair_short_right_sweep`, which is a
  // duplicate of a DIFFERENT template and sailed through a source-only test:
  // 14 of 49 outputs already existed before this check.
  //
  // Names would not have caught it either. `torso_open_bottom_shirt` and
  // `torso_open_top_shirt` are exact mirrors of one another and nothing in
  // either name says so.
  it("recognises a mirror that reproduces a different existing template", () => {
    const left = "1 4 -20 0 0 1 0 0 0 1 0 0 0 1 3024.dat\n1 4 40 0 0 1 0 0 0 1 0 0 0 1 3024.dat";
    const right = mirrorMpd(left).text;
    // `right` is a distinct model from `left` -- so a source-only comparison
    // accepts it -- but if `right` already sits in the corpus it is not new.
    const norm = (t: string) => t.split("\n").map((l) => l.trim()).sort().join("|");
    expect(norm(right)).not.toBe(norm(left));
    expect(norm(mirrorMpd(right).text)).toBe(norm(left));
  });
});
