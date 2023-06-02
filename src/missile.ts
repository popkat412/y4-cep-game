import p5 from "p5";
import Vehicle from "./vehicle";
import TriangleVehicle from "./triangle-vehicle";

export default class Missile extends TriangleVehicle {
  maxspeed = 3;
  maxforce = 0.3;

  perceptionRadius = 50;

  constructor(p: p5, x: number, y: number) {
    super(p, x, y);
  }

  seek(target: p5.Vector, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxspeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = this.p.map(distance, 0, slowRadius, 0, this.maxspeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxforce);
    this.applyForce(force);
  }

  pursue(vehicle: Vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    // this.p.fill(0, 255, 0);
    // this.p.circle(target.x, target.y, 16);
    this.seek(target);
  }

  show() {
    this.p.fill("red");
    super.show();
  }

  actuallyGetTrianglePoints() {
    const theta = this.vel.heading() + this.p.PI / 2;
    return this.getTrianglePoints(theta);
  }
}
