import { Controls } from "./controls";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  maxReverseSpeed: number;
  constructor({
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 10;
    this.maxReverseSpeed = -(this.maxSpeed / 2);
    this.friction = 0.05;

    this.controls = new Controls();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }

  update() {
    // giving effect to acceleration
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // upper cap on the speeds
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < this.maxReverseSpeed) {
      this.speed = this.maxReverseSpeed;
    }

    // friction acts to stop the car
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }

    // to prevent bouncing of speed around 0 because of friction
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // y needs to reduce if moving forward
    this.y -= this.speed;
  }
}
