import p5 from "p5";
import TriangleVehicle from "./triangle-vehicle";

export default class Flare extends TriangleVehicle {
  wanderTheta: number = Math.PI / 2;

  constructor(p: p5, x: number, y: number) {
    super(p, x, y);
    this.vel = p5.Vector.fromAngle(
      p.randomGaussian(Math.PI / 2, Math.PI / 8),
      this.maxspeed
    );
  }
  actuallyGetTrianglePoints() {
    const theta = this.vel.heading() + this.p.PI / 2;
    return this.getTrianglePoints(theta);
  }

  show() {
    this.p.fill("green");
    super.show();
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(100);
    wanderPoint.add(this.pos);
    // fill(255, 0, 0);
    // noStroke();
    // circle(wanderPoint.x, wanderPoint.y, 8);

    let wanderRadius = 50;
    // noFill();
    // stroke(255);
    // circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);
    // line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    let theta = this.wanderTheta + this.vel.heading();

    let x = wanderRadius * Math.cos(theta);
    let y = wanderRadius * Math.sin(theta);
    wanderPoint.add(x, y);
    // fill(0, 255, 0);
    // noStroke();
    // circle(wanderPoint.x, wanderPoint.y, 16);

    // stroke(255);
    // line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxforce);
    this.applyForce(steer);

    let displaceRange = 0.3;
    this.wanderTheta += this.p.random(-displaceRange, displaceRange);
  }
}
