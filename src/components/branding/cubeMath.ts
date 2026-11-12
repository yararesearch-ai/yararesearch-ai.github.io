import * as THREE from 'three';

/**
 * Canonical half-extent of the unit YARA isometric cube (edge length = 2 * CUBE_HALF_SIZE).
 */
export const CUBE_HALF_SIZE = 1.0;

/**
 * Radius of each of the six vertex connection spheres.
 */
export const NODE_RADIUS = 0.205;

/**
 * Isometric alignment rotation: Ry(-PI/4) followed by Rx(atan(1/sqrt(2))).
 * Maps (+s,+s,+s) to (0, 0, +sqrt(3)*s) along +Z, and (-s,+s,-s)/(+s,-s,+s) along +Y/-Y.
 */
export const ISO_ROTATION_MATRIX: THREE.Matrix4 = (() => {
  const ry = new THREE.Matrix4().makeRotationY(-Math.PI / 4);
  const rx = new THREE.Matrix4().makeRotationX(Math.atan(1 / Math.SQRT2));
  return new THREE.Matrix4().multiplyMatrices(rx, ry);
})();

function toIsoPoint(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z).applyMatrix4(ISO_ROTATION_MATRIX);
}

const s = CUBE_HALF_SIZE;

/**
 * Six outer hexagon vertices in clockwise order starting from Top.
 */
export const OUTER_VERTICES: readonly THREE.Vector3[] = [
  toIsoPoint(-s, +s, -s), // 0: Top
  toIsoPoint(+s, +s, -s), // 1: Upper-Right
  toIsoPoint(+s, -s, -s), // 2: Lower-Right
  toIsoPoint(+s, -s, +s), // 3: Bottom
  toIsoPoint(-s, -s, +s), // 4: Lower-Left
  toIsoPoint(-s, +s, +s), // 5: Upper-Left
];

/**
 * Front-most cube vertex where the three Y arms converge.
 */
export const FRONT_CENTER_VERTEX = toIsoPoint(+s, +s, +s);

/**
 * Back-most cube vertex where the three subtle rear structural edges converge.
 */
export const BACK_CENTER_VERTEX = toIsoPoint(-s, -s, -s);

export interface CubeEdgeSpec {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  kind: 'perimeter' | 'back' | 'front-core';
  /** Delay normalized within Phase 2 (0..1) */
  phaseDelay: number;
}

/**
 * All 12 structural edges of the isometric cube, grouped by visual hierarchy.
 */
export const CUBE_EDGES: readonly CubeEdgeSpec[] = [
  // 6 outer hexagon perimeter rails (grow symmetrically from top -> sides -> bottom)
  { id: 'perim-top-left', start: OUTER_VERTICES[0], end: OUTER_VERTICES[5], kind: 'perimeter', phaseDelay: 0.0 },
  { id: 'perim-top-right', start: OUTER_VERTICES[0], end: OUTER_VERTICES[1], kind: 'perimeter', phaseDelay: 0.0 },
  { id: 'perim-mid-left', start: OUTER_VERTICES[5], end: OUTER_VERTICES[4], kind: 'perimeter', phaseDelay: 0.16 },
  { id: 'perim-mid-right', start: OUTER_VERTICES[1], end: OUTER_VERTICES[2], kind: 'perimeter', phaseDelay: 0.16 },
  { id: 'perim-bot-left', start: OUTER_VERTICES[4], end: OUTER_VERTICES[3], kind: 'perimeter', phaseDelay: 0.32 },
  { id: 'perim-bot-right', start: OUTER_VERTICES[2], end: OUTER_VERTICES[3], kind: 'perimeter', phaseDelay: 0.32 },

  // 3 rear depth structural edges converging into the back vertex
  { id: 'back-top', start: OUTER_VERTICES[0], end: BACK_CENTER_VERTEX, kind: 'back', phaseDelay: 0.25 },
  { id: 'back-left', start: OUTER_VERTICES[4], end: BACK_CENTER_VERTEX, kind: 'back', phaseDelay: 0.38 },
  { id: 'back-right', start: OUTER_VERTICES[2], end: BACK_CENTER_VERTEX, kind: 'back', phaseDelay: 0.38 },

  // 3 front internal core spine rails (also act as the structural backbone inside the Y)
  { id: 'front-upper-left', start: OUTER_VERTICES[5], end: FRONT_CENTER_VERTEX, kind: 'front-core', phaseDelay: 0.42 },
  { id: 'front-upper-right', start: OUTER_VERTICES[1], end: FRONT_CENTER_VERTEX, kind: 'front-core', phaseDelay: 0.42 },
  { id: 'front-stem', start: FRONT_CENTER_VERTEX, end: OUTER_VERTICES[3], kind: 'front-core', phaseDelay: 0.52 },
];

/**
 * Builds the canonical watertight 3D beveled prism BufferGeometry for one arm of the Y
 * (along the front-bottom stem edge, ready to be instanced at Z-rotations 0, +2PI/3, -2PI/3).
 *
 * The inner junction uses exact 120-degree miter planes (x=y, y=z, x=z in cube space)
 * so all three arms lock together cleanly at FRONT_CENTER_VERTEX with zero gaps or overlap.
 */
export function createBeveledYArmGeometry(): THREE.BufferGeometry {
  const rOut = 0.056; // central spine crest relief outward from cube edge
  const fOut = 0.014; // face shoulder relief above adjacent cube face
  const w = 0.205;    // bevel wing width along each cube face
  const dIn = 0.088;  // inner keel depth inside the cube
  const yShoulder = -0.71; // stop short of sphere radius (vertex at y = -1.0)
  const yTip = -0.805;     // pointed chevron tip framing the corner node

  const p = (x: number, y: number, z: number) => toIsoPoint(x * s, y * s, z * s);

  const apex = p(1 + rOut, 1 + rOut, 1 + rOut);
  const valleyLeft = p(1 - w, 1 - w, 1 + fOut);
  const valleyRight = p(1 + fOut, 1 - w, 1 - w);
  const keel = p(1 - dIn, 1 - dIn, 1 - dIn);

  const tipRidge = p(1 + rOut * 0.85, yShoulder, 1 + rOut * 0.85);
  const tipLeft = p(1 - w, yShoulder, 1 + fOut);
  const tipRight = p(1 + fOut, yShoulder, 1 - w);
  const tipKeel = p(1 - dIn, yShoulder, 1 - dIn);
  const chevronApex = p(1.0, yTip, 1.0);

  const positions: number[] = [];
  const pushTri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };

  // Left-front bevel facet
  pushTri(apex, valleyLeft, tipLeft);
  pushTri(apex, tipLeft, tipRidge);

  // Right-front bevel facet
  pushTri(apex, tipRidge, tipRight);
  pushTri(apex, tipRight, valleyRight);

  // Left-back bevel facet
  pushTri(valleyLeft, keel, tipKeel);
  pushTri(valleyLeft, tipKeel, tipLeft);

  // Right-back bevel facet
  pushTri(keel, valleyRight, tipRight);
  pushTri(keel, tipRight, tipKeel);

  // Outer chevron faceted tip
  pushTri(tipRidge, tipLeft, chevronApex);
  pushTri(tipLeft, tipKeel, chevronApex);
  pushTri(tipKeel, tipRight, chevronApex);
  pushTri(tipRight, tipRidge, chevronApex);

  // Inner miter cap (watertight interior closure)
  pushTri(apex, valleyRight, keel);
  pushTri(apex, keel, valleyLeft);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutQuart(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 4);
}

export type LogoPaletteName = 'brand' | 'teal';
export type LogoThemeMode = 'dark' | 'light';

export interface LogoPalette {
  nodeColor: string;
  nodeEmissive: string;
  nodeCore: string;
  nodeHalo: string;
  perimeterColor: string;
  perimeterEmissive: string;
  perimeterCore: string;
  backEdgeColor: string;
  backEdgeEmissive: string;
  frontCoreColor: string;
  yColor: string;
  yEmissive: string;
  yAttenuation: string;
  yRidge: string;
  pulseColor: string;
  lightKey: string;
  lightRim: string;
  lightTopRim: string;
  lightCenter: string;
  ambientLight: string;
  ambientIntensity: number;
}

const BRAND_DARK_PALETTE: LogoPalette = {
  nodeColor: '#56D9E8',
  nodeEmissive: '#0284C7',
  nodeCore: '#E0F9FF',
  nodeHalo: '#56D9E8',
  perimeterColor: '#5B9CFF',
  perimeterEmissive: '#2563EB',
  perimeterCore: '#BAE6FD',
  backEdgeColor: '#6366F1',
  backEdgeEmissive: '#312E81',
  frontCoreColor: '#7DD3FC',
  yColor: '#5B9CFF',
  yEmissive: '#2B6BE6',
  yAttenuation: '#1E40AF',
  yRidge: '#BAE6FD',
  pulseColor: '#E0F9FF',
  lightKey: '#F0F7FF',
  lightRim: '#56D9E8',
  lightTopRim: '#8B83FF',
  lightCenter: '#5B9CFF',
  ambientLight: '#0F1C3A',
  ambientIntensity: 0.7,
};

const BRAND_LIGHT_PALETTE: LogoPalette = {
  nodeColor: '#0284C7',
  nodeEmissive: '#0369A1',
  nodeCore: '#BAE6FD',
  nodeHalo: '#0284C7',
  perimeterColor: '#1D4ED8',
  perimeterEmissive: '#1E3A8A',
  perimeterCore: '#60A5FA',
  backEdgeColor: '#334155',
  backEdgeEmissive: '#1E293B',
  frontCoreColor: '#38BDF8',
  yColor: '#1D4ED8',
  yEmissive: '#1E40AF',
  yAttenuation: '#172554',
  yRidge: '#60A5FA',
  pulseColor: '#38BDF8',
  lightKey: '#FFFFFF',
  lightRim: '#0284C7',
  lightTopRim: '#4F46E5',
  lightCenter: '#38BDF8',
  ambientLight: '#CBD5E1',
  ambientIntensity: 0.95,
};

const TEAL_PALETTE: LogoPalette = {
  nodeColor: '#00C99B',
  nodeEmissive: '#008F6E',
  nodeCore: '#B8FFF0',
  nodeHalo: '#00E5A3',
  perimeterColor: '#00D8A4',
  perimeterEmissive: '#008264',
  perimeterCore: '#9CFFEE',
  backEdgeColor: '#008F72',
  backEdgeEmissive: '#005E4C',
  frontCoreColor: '#66FFD9',
  yColor: '#00E5A3',
  yEmissive: '#00B98F',
  yAttenuation: '#007D66',
  yRidge: '#B8FFF0',
  pulseColor: '#D8FFF7',
  lightKey: '#E6FFF9',
  lightRim: '#00C996',
  lightTopRim: '#B8FFF0',
  lightCenter: '#00E5A3',
  ambientLight: '#0D3B31',
  ambientIntensity: 0.65,
};

export function getLogoPalette(
  name: LogoPaletteName,
  theme: LogoThemeMode
): LogoPalette {
  if (name === 'teal') return TEAL_PALETTE;
  return theme === 'light' ? BRAND_LIGHT_PALETTE : BRAND_DARK_PALETTE;
}

