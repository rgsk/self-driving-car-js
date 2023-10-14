import { Car } from "./car";
import { Road } from "./road";

export const animate = ({
  car,
  ctx,
  canvas,
  road,
  traffic,
}: {
  car: Car;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  road: Road;
  traffic: Car[];
}) => {
  // Function to clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  const repeat = () => {
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].update({ roadBorders: road.borders, traffic: [] });
    }
    car.update({ roadBorders: road.borders, traffic: traffic });
    // clear any previous fillings
    clearCanvas();

    // this ensures that camera moves along with the car
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    // then draw the car again
    road.draw(ctx);

    // car must be drawn later to show it above the lanes
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].draw(ctx);
    }
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(repeat);
  };
  repeat();
};
