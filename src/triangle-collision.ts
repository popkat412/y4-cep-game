export interface Triangle {
  a: { x: number; y: number };
  b: { x: number; y: number };
  c: { x: number; y: number };
}

// https://stackoverflow.com/a/44269990/13181476
function cross(points: Triangle, triangle: Triangle): boolean {
  var pa = points.a;
  var pb = points.b;
  var pc = points.c;
  var p0 = triangle.a;
  var p1 = triangle.b;
  var p2 = triangle.c;
  var dXa = pa.x - p2.x;
  var dYa = pa.y - p2.y;
  var dXb = pb.x - p2.x;
  var dYb = pb.y - p2.y;
  var dXc = pc.x - p2.x;
  var dYc = pc.y - p2.y;
  var dX21 = p2.x - p1.x;
  var dY12 = p1.y - p2.y;
  var D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y);
  var sa = dY12 * dXa + dX21 * dYa;
  var sb = dY12 * dXb + dX21 * dYb;
  var sc = dY12 * dXc + dX21 * dYc;
  var ta = (p2.y - p0.y) * dXa + (p0.x - p2.x) * dYa;
  var tb = (p2.y - p0.y) * dXb + (p0.x - p2.x) * dYb;
  var tc = (p2.y - p0.y) * dXc + (p0.x - p2.x) * dYc;
  if (D < 0)
    return (
      (sa >= 0 && sb >= 0 && sc >= 0) ||
      (ta >= 0 && tb >= 0 && tc >= 0) ||
      (sa + ta <= D && sb + tb <= D && sc + tc <= D)
    );
  return (
    (sa <= 0 && sb <= 0 && sc <= 0) ||
    (ta <= 0 && tb <= 0 && tc <= 0) ||
    (sa + ta >= D && sb + tb >= D && sc + tc >= D)
  );
}

export default function trianglesIntersect(
  t0: Triangle,
  t1: Triangle
): boolean {
  return !(cross(t0, t1) || cross(t1, t0));
}
