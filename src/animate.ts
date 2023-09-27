import { Car } from "./car";
import { Road } from "./road";

export const animate = ({
  car,
  ctx,
  canvas,
  road,
}: {
  car: Car;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  road: Road;
}) => {
  // Function to clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  const repeat = () => {
    car.update();

    // clear any previous fillings
    clearCanvas();

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    // then draw the car again
    road.draw(ctx);

    // car must be drawn later to show it above the lanes
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(repeat);
  };
  repeat();
};
