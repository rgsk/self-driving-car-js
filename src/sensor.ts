import { Car } from "./car";
import { Line } from "./road";
import { Intersection, getIntersection, lerp } from "./utils";

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: Line[];
  readings: (Intersection | null)[];
  constructor({ car }: { car: Car }) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 100;
    this.raySpread = Math.PI / 4; // 45 degrees

    this.rays = [];
    this.readings = [];
  }

  update({ roadBorders, traffic }: { roadBorders: Line[]; traffic: Car[] }) {
    this.#castRays();
    this.readings = [];
    for (let ray of this.rays) {
      this.readings.push(this.#getReading({ ray, roadBorders, traffic }));
    }
  }
  #getReading({
    ray,
    roadBorders,
    traffic,
  }: {
    ray: Line;
    roadBorders: Line[];
    traffic: Car[];
  }) {
    // ray casting
    let touches: Intersection[] = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray.start,
        ray.end,
        roadBorders[i].start,
        roadBorders[i].end
      );
      if (touch) {
        touches.push(touch);
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      if (poly) {
        for (let j = 0; j < poly.length; j++) {
          const touch = getIntersection(
            ray.start,
            ray.end,
            poly[j],
            poly[(j + 1) % poly.length]
          );
          if (touch) {
            touches.push(touch);
          }
        }
      }
    }
    if (touches.length === 0) {
      return null;
    }
    const offsets = touches.map((e) => e.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((e) => e.offset === minOffset)!;
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          -this.raySpread / 2,
          this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;
      const start = {
        x: this.car.x,
        y: this.car.y,
      };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push({ start, end });
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i].end;
      const reading = this.readings[i];
      if (reading) {
        end = {
          x: reading.x,
          y: reading.y,
        };
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i].start.x, this.rays[i].start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(this.rays[i].end.x, this.rays[i].end.y);
      ctx.stroke();
    }
  }
}
