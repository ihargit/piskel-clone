import './index.scss';

export default class CursorCoordinates {
  constructor(model) {
    this.model = model;
  }

  render() {
    const coords = document.createElement('div');
    coords.classList.add('cursor-coordinates');
    coords.innerText = `[${this.model.width}x${this.model.width}]  `;
    return coords;
  }

  init() {
    const canvasHelper = document.querySelector('.helper-canvas');
    const canvas = document.querySelector('.drawing-canvas');
    const cursorCoords = document.querySelector('.cursor-coordinates');
    canvas.addEventListener('pointerout', () => {
      cursorCoords.innerText = `[${this.model.width}x${this.model.width}]  `;
    });
    canvasHelper.addEventListener('pointerout', () => {
      cursorCoords.innerText = `[${this.model.width}x${this.model.width}]  `;
    });
    canvas.addEventListener('pointermove', () => {
      cursorCoords.innerText = `[${this.model.width}x${this.model.width}] ${this.model.currentX}:${this.model.currentY}`;
    });
    canvasHelper.addEventListener('pointermove', () => {
      cursorCoords.innerText = `[${this.model.width}x${this.model.width}] ${this.model.currentX}:${this.model.currentY}`;
    });
  }
}
