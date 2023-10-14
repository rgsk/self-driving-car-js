import { Coord, Line } from "./road";

export const lerp = (A: number, B: number, t: number) => {
  return A + (B - A) * t;
};

export interface Intersection {
  x: number;
  y: number;
  offset: number;
}

export function getIntersection(A: Coord, B: Coord, C: Coord, D: Coord) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      } as Intersection;
    }
  }

  return null;
}

export function checkIfPolygonIntersectsWithLine(polygon: Coord[], line: Line) {
  for (let i = 0; i < polygon.length; i++) {
    const touch = getIntersection(
      polygon[i],
      polygon[(i + 1) % polygon.length],
      // last point in polygon is connected to the first point in polygon
      line.start,
      line.end
    );
    if (touch) {
      return true;
    }
  }
  return false;
}
export function checkPolygonsIntersection(
  polygon1: Coord[],
  polygon2: Coord[]
) {
  for (let i = 0; i < polygon1.length; i++) {
    for (let j = 0; j < polygon2.length; j++) {
      const touch = getIntersection(
        polygon1[i],
        polygon1[(i + 1) % polygon1.length],
        // last point in polygon is connected to the first point in polygon
        polygon2[j],
        polygon2[(j + 1) % polygon2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

export function getRGBA(value: number) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return `rgba(${R},${G},${B},${alpha})`;
}
