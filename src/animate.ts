import { Car } from "./car";

export const animate = ({
  car,
  ctx,
  canvas,
}: {
  car: Car;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
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
    car.draw(ctx);
    requestAnimationFrame(repeat);
  };
  repeat();
};
