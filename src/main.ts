import { animate } from "./animate";
import { Car } from "./car";
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
    const car = new Car({ x: 100, y: 100, width: 30, height: 50 });
    car.draw(ctx);
    animate({ car, ctx, canvas });
  }
}
