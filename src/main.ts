import { animate } from "./animate";
import { Car } from "./car";
import { Road } from "./road";
import "./style.css";

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement | null;
if (canvas) {
  const resizeCanvas = () => {
    canvas.height = window.innerHeight;
    canvas.width = 200;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const ctx = canvas.getContext("2d");
  if (ctx) {
    const laneCount = 3;
    const road = new Road({
      x: canvas.width / 2,
      width: canvas.width * 0.9,
      laneCount,
    });
    const car = new Car({
      x: road.getLaneCenter(Math.floor(laneCount / 2)),
      y: 100,
      width: 30,
      height: 50,
    });
    animate({ car, ctx, canvas, road });
  }
}
