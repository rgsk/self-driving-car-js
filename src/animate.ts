import { Car } from "./car";
import { localStorageKeys } from "./localStorageKeys";
import { NeuralNetwork } from "./network";
import { Road } from "./road";
import { Visualizer } from "./visualizer";

export const animate = ({
  cars,
  carCtx,
  networkCtx,
  canvas,
  road,
  traffic,
}: {
  cars: Car[];
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

  let bestCar = cars[0];
  const savedBrain = localStorage.getItem(localStorageKeys.bestBrain);
  if (savedBrain) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].brain = JSON.parse(savedBrain);
      if (i !== 0) {
        const brain = cars[i].brain;
        if (brain) {
          NeuralNetwork.mutate(brain, 0.2);
        }
      }
    }
  }

  function save() {
    localStorage.setItem(
      localStorageKeys.bestBrain,
      JSON.stringify(bestCar.brain)
    );
  }
  const saveButton = document.getElementById("save");
  if (saveButton) {
    saveButton.addEventListener("click", save);
  }

  function discard() {
    localStorage.removeItem(localStorageKeys.bestBrain);
  }
  const discardButton = document.getElementById("discard");
  if (discardButton) {
    discardButton.addEventListener("click", discard);
  }

  const repeat = () => {
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].update({ roadBorders: road.borders, traffic: [] });
    }
    for (let car of cars) {
      car.update({ roadBorders: road.borders, traffic: traffic });
    }

    bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)))!;

    // clear any previous fillings
    clearCanvas();

    // this ensures that camera moves along with the car
    carCtx.save();
    carCtx.translate(0, -bestCar.y + canvas.height * 0.7);

    // then draw the car again
    road.draw(carCtx);

    // car must be drawn later to show it above the lanes
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    for (let car of cars) {
      car.draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.restore();
    if (bestCar.brain) {
      Visualizer.drawNetwork(networkCtx, bestCar.brain);
    }

    requestAnimationFrame(repeat);
  };
  repeat();
};
