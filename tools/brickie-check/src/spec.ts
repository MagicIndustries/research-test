/**
 * The brickie build conventions, as measured from the 199 template corpus in
 * `emagineer-core`. Every number here was derived, not chosen -- see
 * `docs/research/2026-08-22-brickie-part-corpus-legality.md` for the method
 * and the sample sizes behind each one.
 *
 * This file is the spec. When the corpus changes, re-measure and update here;
 * do not tune these values to make a particular part pass.
 */

export const CATEGORIES = ["Legs", "Body", "Head", "Hair", "HeadAccessory"] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Where a category meets its neighbours, as a stud plane in world Y, and which
 * side presents the studs. Measured over 25 composed brickies.
 *
 * The structural joints are single-plane: all 382 Body-Legs joins land on Y=0
 * and all 382 Body-Head joins on Y=-64. Hair is not a structural joint at all
 * -- it meets the Head across four planes and 1,404 connections, a surface
 * shell rather than a part that plugs in -- so its planes are listed for
 * reference but a hair piece is not expected to hit any particular one.
 */
export interface Interface {
  /** The neighbour category. */
  with: Category;
  /** Stud plane(s) in world Y. */
  planes: number[];
  /** Which side presents studs; the other receives them. */
  studsFrom: Category;
  /** False where the corpus is too irregular to treat as a contract. */
  contractual: boolean;
}

export const INTERFACES: Interface[] = [
  { with: "Legs", planes: [0], studsFrom: "Legs", contractual: true },
  { with: "Head", planes: [-64], studsFrom: "Body", contractual: true },
  { with: "Head", planes: [-144], studsFrom: "Head", contractual: true },
  { with: "Head", planes: [-94, -114, -134, -144], studsFrom: "Head", contractual: false },
  { with: "HeadAccessory", planes: [-152, -160, -168], studsFrom: "HeadAccessory", contractual: false },
];

/** Which interfaces a category participates in, and how. */
export const CATEGORY_INTERFACES: Record<Category, Array<{ neighbour: Category; plane: number; presents: boolean; contractual: boolean }>> = {
  Legs: [{ neighbour: "Body", plane: 0, presents: true, contractual: true }],
  Body: [
    { neighbour: "Legs", plane: 0, presents: false, contractual: true },
    { neighbour: "Head", plane: -64, presents: true, contractual: true },
  ],
  Head: [
    { neighbour: "Body", plane: -64, presents: false, contractual: true },
    { neighbour: "HeadAccessory", plane: -144, presents: true, contractual: true },
  ],
  Hair: [],
  HeadAccessory: [{ neighbour: "Head", plane: -144, presents: false, contractual: true }],
};

/**
 * Piece counts, from the corpus. `min`/`max` are the observed range and
 * `median` the observed median; a part outside the range is unusual rather
 * than wrong, which is why the check that uses these reports advisory.
 *
 * Head is the tightest -- 53 templates all landing between 21 and 35 -- and
 * Hair the loosest by a wide margin.
 */
export const PIECE_COUNTS: Record<Category, { min: number; median: number; max: number }> = {
  Legs: { min: 6, median: 14, max: 42 },
  Body: { min: 26, median: 32, max: 71 },
  Head: { min: 21, median: 29, max: 35 },
  Hair: { min: 16, median: 47, max: 97 },
  HeadAccessory: { min: 8, median: 13, max: 50 },
};

/** Observed vertical extent of each category, in world Y (LDraw -Y is up). */
export const ENVELOPE_Y: Record<Category, { from: number; to: number }> = {
  Legs: { from: 0, to: 56 },
  Body: { from: -64, to: -8 },
  Head: { from: -145, to: -44 },
  Hair: { from: -220, to: -34 },
  HeadAccessory: { from: -216, to: -144 },
};

/**
 * Proportion of a category's placements whose studs point up, measured across
 * the corpus. The gradient is the style: structure at the bottom of the
 * figure, sculpted shell at the top.
 *
 * `tolerance` is deliberately wide. This is a distribution over a whole
 * category, not a property of one part, so a single part may sit well off the
 * category mean and still be right.
 */
export const STUDS_UP_RATIO: Record<Category, number> = {
  Legs: 0.81,
  Body: 0.73,
  Head: 0.58,
  Hair: 0.28,
  HeadAccessory: 0.69,
};
export const STUDS_UP_TOLERANCE = 0.3;

/**
 * The 21 parts covering 80% of all placements in the corpus -- 18% of the
 * vocabulary doing four fifths of the work. Side-stud bricks and plates for
 * the core, curved slopes and tiles for the surface: a sculpting vocabulary
 * rather than a building one.
 *
 * A part outside this list is not wrong; the corpus uses 117 distinct parts.
 * It is a signal worth reporting, because a generated part drawing heavily on
 * parts the corpus never uses will not look like a brickie however legal it is.
 */
export const CORE_VOCABULARY = new Set([
  "22885.dat", "3023b.dat", "3024.dat", "15068.dat", "3020.dat", "3710.dat",
  "11477.dat", "3069b.dat", "3941.dat", "2431.dat", "85984.dat", "54200.dat",
  "3070b.dat", "14719.dat", "98138.dat", "3004.dat", "3005.dat", "3062b.dat",
  "87580.dat", "3623.dat", "3022.dat",
]);

/** Mirror symmetry about X=0, measured per category as the share of off-centre parts with a partner. */
export const MIRROR_SYMMETRY: Record<Category, number> = {
  Legs: 0.98, Body: 0.96, Head: 0.96, Hair: 0.89, HeadAccessory: 0.98,
};
/** A part is "on the centre line" within this distance of X=0. */
export const CENTRE_LINE_EPS = 2;
/** Two placements mirror each other if their positions match within this, after negating X. */
export const MIRROR_EPS = 2;
