import { describe, expect, it } from "vitest";
import { orthogonal } from "../src/checks/orthogonal.js";
import { symmetry } from "../src/checks/symmetry.js";
import { interfaceContract } from "../src/checks/interfaceContract.js";
import { supersededFilename } from "../src/checks/supersededFilename.js";
import { orientation } from "../src/checks/orientation.js";
import type { CheckContext } from "../src/types.js";

const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
/** Row-major 4x4 with a translation, matching ldraw-verify's Mat4 layout. */
const at = (x: number, y: number, z: number, rot = [1, 0, 0, 0, 1, 0, 0, 0, 1]) =>
  [rot[0]!, rot[1]!, rot[2]!, x, rot[3]!, rot[4]!, rot[5]!, y, rot[6]!, rot[7]!, rot[8]!, z, 0, 0, 0, 1];

const ctx = (over: Partial<CheckContext>): CheckContext => ({
  category: "Body",
  placements: [],
  studPlanes: new Set(),
  antiStudPlanes: new Set(),
  isAlias: () => false,
  ...over,
});

describe("orthogonal", () => {
  it("passes axis-aligned placements", () => {
    expect(orthogonal.run(ctx({ placements: [{ index: 0, partId: "3024.dat", world: at(0, 0, 0) }] }))).toHaveLength(0);
  });
  it("fails an oblique placement", () => {
    const tilt = [0.966, 0, 0.259, 0, 1, 0, -0.259, 0, 0.966];
    const f = orthogonal.run(ctx({ placements: [{ index: 0, partId: "3024.dat", world: at(0, 0, 0, tilt) }] }));
    expect(f[0]?.severity).toBe("fail");
  });
});

describe("interface contract", () => {
  // Directional. Body PRESENTS studs at Y=-64 and RECEIVES at Y=0, so a part
  // with studs where it should have anti-studs does not satisfy the contract.
  it("passes a Body with anti-studs at 0 and studs at -64", () => {
    expect(interfaceContract.run(ctx({ studPlanes: new Set([-64]), antiStudPlanes: new Set([0]) }))).toHaveLength(0);
  });
  it("fails a Body presenting studs where it should receive them", () => {
    const f = interfaceContract.run(ctx({ studPlanes: new Set([0, -64]), antiStudPlanes: new Set() }));
    expect(f.some((x) => x.severity === "fail" && x.message.includes("anti-studs"))).toBe(true);
  });
  it("makes no claim about Hair, which has no contractual plane", () => {
    expect(interfaceContract.run(ctx({ category: "Hair", studPlanes: new Set([-999]) }))).toHaveLength(0);
  });
  it("says so rather than passing when there is no connection data", () => {
    expect(interfaceContract.run(ctx({}))[0]?.severity).toBe("note");
  });
});

describe("symmetry", () => {
  const mirrored = [
    { index: 0, partId: "3024.dat", world: at(-20, 0, 0) },
    { index: 1, partId: "3024.dat", world: at(20, 0, 0) },
  ];
  it("passes a mirrored pair", () => {
    expect(symmetry.run(ctx({ placements: mirrored }))).toHaveLength(0);
  });
  it("warns on an unmirrored part", () => {
    const f = symmetry.run(ctx({ placements: [mirrored[0]!, { index: 1, partId: "3024.dat", world: at(40, 0, 0) }] }));
    expect(f[0]?.severity).toBe("warn");
  });
  it("ignores parts on the centre line", () => {
    expect(symmetry.run(ctx({ placements: [{ index: 0, partId: "3024.dat", world: at(0, 0, 0) }] }))).toHaveLength(0);
  });
});

describe("superseded filename", () => {
  // A note, not a failure. `~Moved to` redirects a FILENAME; 3023 is Plate 1x2
  // and is in everyday production. Treating it as a defect once made 78 corpus
  // templates fail for something that changes nothing about what gets built.
  it("notes a superseded filename without failing the part", () => {
    const f = supersededFilename.run(
      ctx({ placements: [{ index: 0, partId: "3023.dat", world: at(0, 0, 0) }], isAlias: (p) => p === "3023.dat" }),
    );
    expect(f[0]?.severity).toBe("note");
    expect(f[0]?.message).toContain("3023.dat");
  });
});

describe("orientation", () => {
  // Whole-category statistics, so a small part is not judged at all.
  it("makes no claim about a part with too few placements", () => {
    expect(orientation.run(ctx({ category: "Hair", placements: [{ index: 0, partId: "3024.dat", world: at(0, 0, 0) }] }))).toHaveLength(0);
  });
  it("warns when a Hair piece is built as uprightly as a pair of legs", () => {
    const upright = Array.from({ length: 10 }, (_, i) => ({ index: i, partId: "3024.dat", world: at(i * 20, 0, 0) }));
    const f = orientation.run(ctx({ category: "Hair", placements: upright }));
    expect(f[0]?.severity).toBe("warn");
    expect(f[0]?.message).toContain("more uprightly");
  });
});
