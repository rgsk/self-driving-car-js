import { Level, NeuralNetwork } from "./network";
import { getRGBA, lerp } from "./utils";

export class Visualizer {
  static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
        );

      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["↑", "←", "→", "↓"] : []
      );
    }
  }
  static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number,
    outputLabels: string[]
  ) {
    const right = left + width;
    const bottom = top + height;

    const nodeRadius = 18;
    const { inputs, outputs, weights, biases } = level;

    // connections
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(this.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(this.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        const value = weights[i][j];
        ctx.strokeStyle = getRGBA(value);
        ctx.stroke();
      }
    }

    // input nodes
    for (let i = 0; i < inputs.length; i++) {
      const x = this.#getNodeX(inputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // output nodes
    for (let i = 0; i < outputs.length; i++) {
      const x = this.#getNodeX(outputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      const value = biases[i];
      ctx.strokeStyle = getRGBA(value);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "red";
        ctx.font = nodeRadius * 0.8 + "px Arial";
        ctx.fillText(outputLabels[i], x, top);
        ctx.lineWidth = 1;
        ctx.strokeText(outputLabels[i], x, top);
      }
    }
  }
  static #getNodeX(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ) {
    return lerp(
      left,
      right,
      nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
