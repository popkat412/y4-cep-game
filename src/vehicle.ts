import p5 from "p5";

export default class Vehicle {
  p: p5;

  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;

  maxspeed = 4;
  maxforce = 0.2;

  currentPath: p5.Vector[] = [];

  constructor(p: p5, x: number, y: number) {
    this.p = p;

    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
  }

  applyForce(force: p5.Vector) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    this.p.circle(this.pos.x, this.pos.y, 10);
  }
}
