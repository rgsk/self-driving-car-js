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

    // then draw the car again
    road.draw(ctx);

    // car must be drawn later to show it above the lanes
    car.draw(ctx);
    requestAnimationFrame(repeat);
  };
  repeat();
};
