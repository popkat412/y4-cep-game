import Vehicle from "./vehicle";
import * as math from "mathjs";
import trianglesIntersect, { Triangle } from "./triangle-collision";

export default abstract class TriangleVehicle extends Vehicle {
  r = 6;

  show() {
    this.p.stroke(0);
    this.p.strokeWeight(2);
    this.p.push();
    // this.p.translate(this.pos.x, this.pos.y);
    // this.p.rotate(theta);
    this.p.beginShape();
    const { a, b, c } = this.actuallyGetTrianglePoints();
    // console.log(a);
    this.p.vertex(a.x, a.y);
    this.p.vertex(b.x, b.y);
    this.p.vertex(c.x, c.y);
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }

  abstract actuallyGetTrianglePoints(): Triangle;

  getTrianglePoints(theta: number): Triangle {
    // reeeee p5 doesn't expose it's internal matrix lib
    const translate = math.matrix([
      [1, 0, this.pos.x],
      [0, 1, this.pos.y],
      [0, 0, 1],
    ]);

    const cA = Math.cos(theta),
      sA = Math.sin(theta);
    const rotate = math.matrix([
      [cA, -sA, 0],
      [sA, cA, 0],
      [0, 0, 1],
    ]);

    const m = math.multiply(translate, rotate);

    // console.table(m._data);

    const a = math.multiply(m, [0, -this.r * 2, 1]),
      b = math.multiply(m, [-this.r, this.r * 2, 1]),
      c = math.multiply(m, [this.r, this.r * 2, 1]);

    // console.table(a._data);
    // console.table(b._data);
    // console.table(c._data);

    return {
      a: { x: a.get([0]), y: a.get([1]) },
      b: { x: b.get([0]), y: b.get([1]) },
      c: { x: c.get([0]), y: c.get([1]) },
    };
  }

  isIntersecting(other: TriangleVehicle): boolean {
    const triangle1 = this.actuallyGetTrianglePoints();
    const triangle2 = other.actuallyGetTrianglePoints();

    return trianglesIntersect(triangle1, triangle2);
  }
}
