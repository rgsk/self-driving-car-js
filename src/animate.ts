import { Car } from "./car";
import { Road } from "./road";
import { Visualizer } from "./visualizer";

export const animate = ({
  car,
  carCtx,
  networkCtx,
  canvas,
  road,
  traffic,
}: {
  car: Car;
  carCtx: CanvasRenderingContext2D;
  networkCtx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  road: Road;
  traffic: Car[];
}) => {
  // Function to clear the canvas
  function clearCanvas() {
    carCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
  const repeat = () => {
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].update({ roadBorders: road.borders, traffic: [] });
    }
    car.update({ roadBorders: road.borders, traffic: traffic });
    // clear any previous fillings
    clearCanvas();

    // this ensures that camera moves along with the car
    carCtx.save();
    carCtx.translate(0, -car.y + canvas.height * 0.7);

    // then draw the car again
    road.draw(carCtx);

    // car must be drawn later to show it above the lanes
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].draw(carCtx);
    }
    car.draw(carCtx);

    carCtx.restore();
    if (car.brain) {
      Visualizer.drawNetwork(networkCtx, car.brain);
    }
    requestAnimationFrame(repeat);
  };
  repeat();
};
