export default class CanvasTemplate {
  static createCanvas(width, height, styles) {
    const newCanvas = document.createElement('canvas');
    newCanvas.classList.add(...styles);
    newCanvas.width = width;
    newCanvas.height = height;
    return newCanvas;
  }
}
