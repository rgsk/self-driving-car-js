import { Car } from "./car";
import "./style.css";

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement | null;
if (canvas) {
  canvas.height = window.innerHeight;
  canvas.width = 200;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const car = new Car({ x: 100, y: 100, width: 30, height: 50 });
    car.draw(ctx);
  }
}
