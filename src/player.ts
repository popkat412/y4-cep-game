import Flare from "./flare";
import TriangleVehicle from "./triangle-vehicle";

export default class Player extends TriangleVehicle {
  r = 20;

  maxspeed: number = 8;
  maxforce: number = 1;
  dampingConstant = 0.1;

  maxhealth = 10;
  helth = this.maxhealth;

  flares: Flare[] = []; // those that were fired and still in view
  maxNumFlares = 20;
  numFlaresLoaded = this.maxNumFlares;

  up() {
    this.applyForce(this.p.createVector(0, -this.maxforce));
  }

  down() {
    this.applyForce(this.p.createVector(0, this.maxforce));
  }

  right() {
    this.applyForce(this.p.createVector(this.maxforce, 0));
  }

  left() {
    this.applyForce(this.p.createVector(-this.maxforce, 0));
  }

  damp() {
    this.applyForce(this.vel.copy().mult(-this.dampingConstant));
  }

  show() {
    // show flares
    for (const flare of this.flares) {
      flare.show();
    }

    this.p.fill("blue");
    super.show();
  }

  actuallyGetTrianglePoints() {
    return this.getTrianglePoints(0);
  }

  update() {
    // update flares
    for (const flare of this.flares) {
      flare.wander();
      flare.update();
    }

    // delete those that are out of the screen
    for (let i = this.flares.length - 1; i >= 0; i--) {
      const { x, y } = this.flares[i].pos;
      const { width, height } = this.p;
      if (x > width || x < 0 || y > height || y < 0) this.flares.splice(i, 1);
    }

    super.update();

    // clamp player at boundaries
    const { width, height } = this.p;
    if (this.pos.x < 0) this.pos.x = 0;
    if (this.pos.x > width) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = 0;
    if (this.pos.y > height) this.pos.y = height;
  }

  rechargeFlare() {
    if (this.numFlaresLoaded < this.maxNumFlares) {
      this.numFlaresLoaded++;
    }
  }

  shootFlare(): boolean {
    // returns whether a flare was successfully shot (i.e. had ammo)
    if (this.numFlaresLoaded == 0) return false;

    this.numFlaresLoaded--;
    this.flares.push(new Flare(this.p, this.pos.x, this.pos.y));

    return true;
  }
}
