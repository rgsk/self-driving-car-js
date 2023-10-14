import { animate } from "./animate";
import { Car } from "./car";
import { Road } from "./road";
import "./style.css";

const CAR_WIDTH = 30;
const CAR_HEIGHT = 50;

const carCanvas = document.getElementById(
  "carCanvas"
) as HTMLCanvasElement | null;
const networkCanvas = document.getElementById(
  "networkCanvas"
) as HTMLCanvasElement | null;
if (carCanvas && networkCanvas) {
  const resizeCanvas = () => {
    carCanvas.height = window.innerHeight;
    carCanvas.width = 200;
    networkCanvas.height = window.innerHeight;
    networkCanvas.width = 300;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const carCtx = carCanvas.getContext("2d");
  const networkCtx = networkCanvas.getContext("2d");

  if (carCtx && networkCtx) {
    const laneCount = 3;
    const road = new Road({
      x: carCanvas.width / 2,
      width: carCanvas.width * 0.9,
      laneCount,
    });

    function generateCars(N: number) {
      const cars = [];
      for (let i = 0; i < N; i++) {
        cars.push(
          new Car({
            x: road.getLaneCenter(Math.floor(laneCount / 2)),
            y: 100,
            width: CAR_WIDTH,
            height: CAR_HEIGHT,
            isAIControlled: true,
            isPlayer: true,
          })
        );
      }
      return cars;
    }

    // const car = new Car({
    //   x: road.getLaneCenter(Math.floor(laneCount / 2)),
    //   y: 100,
    //   width: CAR_WIDTH,
    //   height: CAR_HEIGHT,
    //   isPlayer: true,
    //   isAIControlled: false,
    // });
    const N = 100;
    const cars = generateCars(N);
    const traffic = [
      new Car({
        x: road.getLaneCenter(Math.floor(laneCount / 2)),
        y: -100,
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
      }),
    ];

    animate({
      cars,
      traffic,
      carCtx: carCtx,
      canvas: carCanvas,
      road,
      networkCtx: networkCtx,
    });
  }
}
