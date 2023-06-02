import p5 from "p5";

export default class Star {
  p: p5;

  pos: p5.Vector;
  z: number;

  size = 10;
  speed = 10;

  constructor(p: p5) {
    this.p = p;
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.z = p.random(1, 10); // 1 is nearest, 10 is farthest from plane of screen
  }

  show() {
    this.p.fill(255, 100);
    this.p.noStroke();
    this.p.circle(this.pos.x, this.pos.y, this.size / this.z);
  }

  update() {
    this.pos.y += this.speed / this.z;

    // wrap around
    if (this.pos.y > this.p.height) {
      this.pos.y = 0;
      this.pos.x = this.p.random(this.p.width);
    }
  }
}
