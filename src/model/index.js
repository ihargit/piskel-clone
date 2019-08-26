import Constants from '../constants/index';
import Utils from '../utils';

export default class Model {
  constructor() {
    const { DEFAULT: { WIDTH, HEIGHT, FPS }, DEFAULT_PEN_COLOR } = Constants;
    this.currentTool = 'tool-pen';
    this.width = WIDTH;
    this.height = HEIGHT;
    this.zoom = 1;
    this.penColor = DEFAULT_PEN_COLOR;
    this.canvasDraw = false;
    this.currentFrame = 0;
    this.emptyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    this.frames = [this.emptyImage];
    this.fps = FPS;
    this.animationIntervalId = undefined;
    this.prevX = undefined;
    this.prevY = undefined;
    this.startStrokeX = undefined;
    this.startStrokeY = undefined;
    this.pixelsToFill = undefined;
    this.tileClicked = undefined;
    this.currentX = 0;
    this.currentY = 0;
    this.dragDeltaX = 0;
    this.dragDeltaY = 0;
    this.colorSelectActive = undefined;
    this.colorSelectHelper = '#a9a9c2';
    this.initialPixelsToFill = undefined;
    this.shiftPressed = false;
    this.selected = false;
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
  }

  getHeight() {
    return this.height;
  }

  setHeight(height) {
    this.height = height;
  }

  getZoom() {
    return this.zoom;
  }

  setZoom() {
    this.zoom = Utils.calculateZoom(this.width, this.height);
  }

  getColor() {
    return this.penColor;
  }

  setColor(color) {
    this.penColor = color;
  }

  getCanvasDrawStatus() {
    return this.canvasDraw;
  }

  setCanvasDrawStatus(boolean) {
    this.canvasDraw = boolean;
  }

  setCurrentFrame(frame) {
    this.currentFrame = frame;
  }

  getCurrentFrame() {
    return this.currentFrame;
  }
}
