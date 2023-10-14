import { Controls } from "./controls";
import { NeuralNetwork } from "./network";
import { Coord, Line } from "./road";
import { Sensor } from "./sensor";
import {
  checkIfPolygonIntersectsWithLine,
  checkPolygonsIntersection,
} from "./utils";

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
  angle: number;
  sensor: Sensor | undefined;
  polygon: Coord[] | undefined;
  damaged: boolean;
  isPlayer: boolean;
  brain: NeuralNetwork | undefined;
  isAIControlled?: boolean;
  constructor({
    x,
    y,
    width,
    height,
    isPlayer = false,
    isAIControlled,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    isPlayer?: boolean;
    isAIControlled?: boolean;
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = isPlayer ? 3 : 2;
    this.angle = 0;
    this.damaged = false;
    this.maxReverseSpeed = -(this.maxSpeed / 2);
    this.friction = 0.05;
    if (isPlayer) {
      this.sensor = new Sensor({ car: this });
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.isPlayer = isPlayer;
    this.isAIControlled = isAIControlled;
    this.controls = new Controls(isPlayer);
  }

  draw(ctx: CanvasRenderingContext2D, drawSensor = false) {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();
    // ctx.restore();

    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      if (this.isPlayer) {
        ctx.fillStyle = "blue";
      } else {
        ctx.fillStyle = "red";
      }
    }

    ctx.beginPath();
    if (this.polygon) {
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
      for (let i = 1; i < this.polygon.length; i++) {
        ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
      }
      ctx.fill();
    }
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }

  update({ roadBorders, traffic }: { roadBorders: Line[]; traffic: Car[] }) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage({ roadBorders, traffic });
    }

    if (this.sensor) {
      this.sensor.update({ roadBorders, traffic });
      if (this.brain) {
        const offsets = this.sensor.readings.map((s) =>
          s === null ? 0 : 1 - s.offset
        );
        const outputs = NeuralNetwork.feedForward(offsets, this.brain);
        if (this.isAIControlled) {
          this.controls.forward = !!outputs[0];
          this.controls.left = !!outputs[1];
          this.controls.right = !!outputs[2];
          this.controls.reverse = !!outputs[3];
        }
      }
    }
  }

  #assessDamage({
    roadBorders,
    traffic,
  }: {
    roadBorders: Line[];
    traffic: Car[];
  }) {
    if (this.polygon) {
      for (let i = 0; i < roadBorders.length; i++) {
        if (checkIfPolygonIntersectsWithLine(this.polygon, roadBorders[i])) {
          return true;
        }
      }
      for (let i = 0; i < traffic.length; i++) {
        const trafficCarPolygon = traffic[i].polygon;
        if (trafficCarPolygon) {
          if (checkPolygonsIntersection(this.polygon, trafficCarPolygon)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
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

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // when angle would be 0
    // vertical effect will be more
    // therefore for updating y we are using cos of angle
    this.y -= Math.cos(this.angle) * this.speed;
    this.x -= Math.sin(this.angle) * this.speed;
  }
}
