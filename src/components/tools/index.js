import * as HTML from './index.html';
import './index.scss';
import Utils from '../../utils';

export default class Tools {
  constructor(model) {
    this.model = model;
    this.html = HTML;
    this.utils = Utils;
  }

  render() {
    const tools = document.createElement('template');
    tools.innerHTML = this.html;
    return tools.content;
  }

  changeTool(e) {
    if (e.target.classList.contains('tool-icon')) {
      this.model.currentTool = e.target.dataset.toolId;
      this.utils.deleteClassFromItems('tool-icon', 'selected');
      e.target.classList.add('selected');
      const canvas = document.querySelector('.drawing-canvas');
      const canvasHelper = document.querySelector('.helper-canvas');
      switch (this.model.currentTool) {
        case 'tool-pen':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('pen-cursor');
          break;
        case 'tool-bucket':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('bucket-cursor');
          break;
        case 'tool-colorswap':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('bucket-cursor');
          break;
        case 'tool-eraser':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('eraser-cursor');
          break;
        case 'tool-vertical-mirror-pen':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('pen-cursor');
          break;
        case 'tool-stroke':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          Utils.removeClassesWithRegex(canvasHelper, /-cursor/);
          canvas.classList.add('pen-cursor');
          canvasHelper.classList.add('pen-cursor');
          break;
        case 'tool-colorpicker':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('colorpicker-cursor');
          break;
        case 'tool-broom':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('broom-cursor');
          break;
        case 'tool-move':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('move-cursor');
          break;
        case 'tool-rectangle':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('cross-cursor');
          break;
        case 'tool-circle':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('cross-cursor');
          break;
        case 'tool-dithering':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('dithering-cursor');
          break;
        case 'tool-shape-select':
          Utils.removeClassesWithRegex(canvas, /-cursor/);
          canvas.classList.add('move-cursor');
          Utils.removeClassesWithRegex(canvasHelper, /-cursor/);
          canvasHelper.classList.add('move-cursor');
          break;
        default:
          break;
      }
    }
  }

  documentUpEventHandler() {
    if (this.model.getCanvasDrawStatus()) {
      const canvasHelper = document.querySelector('.helper-canvas');
      const ctxHelper = document.querySelector('.helper-canvas').getContext('2d');
      const canvas = document.querySelector('.drawing-canvas');
      const ctx = canvas.getContext('2d');
      if ((this.model.currentTool === 'tool-stroke' || this.model.currentTool === 'tool-rectangle' || this.model.currentTool === 'tool-circle')) {
        this.model.setCanvasDrawStatus(false);
        this.model.startStrokeX = undefined;
        this.model.startStrokeY = undefined;
        canvasHelper.style.zIndex = '8';
        ctxHelper.clearRect(0, 0, this.model.width * this.model.zoom,
          this.model.height * this.model.zoom);
        if (this.model.pixelsToFill) {
          Utils.fillPixels(this.model.pixelsToFill, ctx,
            this.model.getZoom(), this.model.getColor());
        }
        Utils.updatePreview(this.model);
        this.model.pixelsToFill = undefined;
        this.model.prevX = undefined;
        this.model.prevY = undefined;
      }
      if (this.model.currentTool === 'tool-move') {
        this.model.setCanvasDrawStatus(false);
        ctxHelper.clearRect(0, 0, this.model.width * this.model.zoom,
          this.model.width * this.model.zoom);
        canvasHelper.classList.remove('invisible');
        this.dragDeltaX = 0;
        this.dragDeltaY = 0;
      }
      if (this.model.currentTool === 'tool-shape-select' && this.model.selected) {
        this.model.selected = false;
        this.model.setCanvasDrawStatus(false);
        if (this.model.shiftPressed) {
          Utils.eraseLine(this.model.initialPixelsToFill, ctx, this.model.zoom);
        }
        Utils.eraseLine(this.model.pixelsToFill, ctxHelper, this.model.zoom);
        Utils.fillPixels(this.model.pixelsToFill, ctx,
          this.model.zoom, this.model.penColor);
        Utils.updatePreview(this.model);
        canvasHelper.style.zIndex = '8';
        this.model.dragDeltaX = 0;
        this.model.dragDeltaY = 0;
        this.model.pixelsToFill = undefined;
        this.model.prevX = undefined;
        this.model.prevY = undefined;
        this.model.initialPixelsToFill = undefined;
        this.model.colorSelectActive = undefined;
      }
    }
  }

  canvasDownEventHandler(event) {
    this.model.setCanvasDrawStatus(true);
    const canvas = document.querySelector('.drawing-canvas');
    const ctx = canvas.getContext('2d');
    const canvasHelper = document.querySelector('.helper-canvas');
    const ctxHelper = canvasHelper.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const rect = canvas.getBoundingClientRect();
    const cellWidth = this.model.getZoom();
    const cellX = Math.floor((event.clientX - rect.left) / cellWidth);
    const cellY = Math.floor((event.clientY - rect.top) / cellWidth);
    if (this.model.currentTool === 'tool-pen') {
      Utils.drawCell({ x1: cellX, y1: cellY }, ctx, cellWidth, this.model.getColor());
    }
    if (this.model.currentTool === 'tool-eraser') {
      Utils.eraseCell({ x1: cellX, y1: cellY }, ctx, cellWidth);
    }
    if (this.model.currentTool === 'tool-bucket') {
      const coords = Utils.findNearSameColorCoords(this.model, ctx, cellX, cellY);
      Utils.fillPixels(coords, ctx, this.model.zoom, this.model.penColor);
    }
    if (this.model.currentTool === 'tool-colorswap') {
      const coords = Utils.findSameColorCoords(this.model, ctx, cellX, cellY);
      Utils.fillPixels(coords, ctx, this.model.zoom, this.model.penColor);
    }
    if (this.model.currentTool === 'tool-vertical-mirror-pen') {
      const coords = Utils.mirrorCoords([{ x1: cellX, y1: cellY }], this.model.width);
      Utils.fillPixels(coords, ctx, cellWidth, this.model.getColor());
    }
    if (this.model.currentTool === 'tool-colorpicker') {
      const newColor = Utils.getColorFromPixel(this.model, ctx, cellX, cellY);
      this.model.penColor = newColor;
      document.getElementById('color-primary').value = newColor;
    }
    if (this.model.currentTool === 'tool-stroke' || this.model.currentTool === 'tool-rectangle') {
      this.model.startStrokeX = cellX;
      this.model.startStrokeY = cellY;
      canvasHelper.style.zIndex = '10';
      this.model.pixelsToFill = [{ x1: cellX, y1: cellY }];
      Utils.fillPixels(this.model.pixelsToFill, ctxHelper, cellWidth, this.model.getColor());
    }
    if (this.model.currentTool === 'tool-circle') {
      canvasHelper.style.zIndex = '10';
      this.model.startStrokeX = cellX;
      this.model.startStrokeY = cellY;
    }
    if (this.model.currentTool === 'tool-broom') {
      ctx.clearRect(0, 0, this.model.width * this.model.zoom, this.model.width * this.model.zoom);
    }
    if (this.model.currentTool === 'tool-move') {
      canvasHelper.classList.add('invisible');
      ctxHelper.drawImage(canvas, 0, 0);
      this.model.dragDeltaX = cellX;
      this.model.dragDeltaY = cellY;
    }
    if (this.model.currentTool === 'tool-shape-select') {
      const emptyPixel = Utils.checkPixelTransparency(this.model, ctx, cellX, cellY);
      if (!emptyPixel) {
        this.model.colorSelectActive = Utils.getColorFromPixel(this.model, ctx, cellX, cellY);
        this.model.selected = true;
        this.model.startStrokeX = cellX;
        this.model.startStrokeY = cellY;
        this.model.pixelsToFill = Utils.findNearSameColorCoords(this.model, ctx, cellX, cellY);
        this.model.initialPixelsToFill = Utils.copyArrayWithCoords(this.model.pixelsToFill);
        canvasHelper.style.zIndex = '10';
        Utils.fillPixels(this.model.pixelsToFill, ctxHelper,
          this.model.zoom, this.model.colorSelectHelper);
      }
    }
  }

  canvasUpEventHandler() {
    if (this.model.getCanvasDrawStatus()) {
      this.model.setCanvasDrawStatus(false);
      const canvas = document.querySelector('.drawing-canvas');
      this.model.frames[this.model.getCurrentFrame()] = canvas.toDataURL();
      const targetTileCanvas = document.querySelectorAll(`[data-tile-number='${
        this.model.getCurrentFrame()}']`)[0].querySelector('.tile-view');
      const ctx = targetTileCanvas.getContext('2d');
      ctx.clearRect(0, 0, 96, 96);
      ctx.drawImage(canvas, 0, 0, 96, 96);
      if (this.model.fps === 0) {
        Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
      }
      this.model.prevX = undefined;
      this.model.prevY = undefined;
    }
  }

  canvasMoveEventHandler(event) {
    const canvas = document.querySelector('.drawing-canvas');
    const canvasHelper = document.querySelector('.helper-canvas');
    const ctxHelper = canvasHelper.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const cellWidth = this.model.getZoom();
    const cellX = Math.floor((event.clientX - rect.left) / cellWidth);
    const cellY = Math.floor((event.clientY - rect.top) / cellWidth);
    this.model.currentX = cellX;
    this.model.currentY = cellY;
    const ctx = canvas.getContext('2d');
    const change = Utils.checkIfCoordsChanged(this.model, cellX, cellY);
    if (this.model.getCanvasDrawStatus()) {
      if (this.model.prevX >= 0) {
        const coords = Utils.calcStraightLine({
          startX: this.model.prevX, startY: this.model.prevY, endX: cellX, endY: cellY,
        });
        if (this.model.currentTool === 'tool-pen') {
          Utils.fillPixels(coords, ctx, cellWidth, this.model.getColor());
        }
        if (this.model.currentTool === 'tool-eraser') {
          Utils.eraseLine(coords, ctx, cellWidth);
        }
        if (this.model.currentTool === 'tool-vertical-mirror-pen') {
          const coordinates = Utils.mirrorCoords(coords, this.model.width);
          Utils.fillPixels(coordinates, ctx, cellWidth, this.model.getColor());
        }
      }
      if (this.model.currentTool === 'tool-stroke' && change) {
        const coordsInner = Utils.calcStraightLine({
          startX: this.model.startStrokeX,
          startY: this.model.startStrokeY,
          endX: cellX,
          endY: cellY,
        });
        if (this.model.pixelsToFill) {
          Utils.eraseLine(this.model.pixelsToFill, ctxHelper, cellWidth);
        }
        this.model.pixelsToFill = coordsInner;
        Utils.fillPixels(this.model.pixelsToFill, ctxHelper, cellWidth, this.model.getColor());
      }
      if (this.model.currentTool === 'tool-rectangle' && change) {
        const coordsInner = Utils.calcRectanglePixelsCoords(this.model, cellX, cellY);
        if (this.model.pixelsToFill) {
          Utils.eraseLine(this.model.pixelsToFill, ctxHelper, cellWidth);
        }
        this.model.pixelsToFill = coordsInner;
        Utils.fillPixels(this.model.pixelsToFill, ctxHelper, cellWidth, this.model.getColor());
      }
      if (this.model.currentTool === 'tool-circle' && change) {
        const coordsInner = Utils.calcCirclePixelsCoords(this.model, cellX, cellY);
        if (this.model.pixelsToFill) {
          Utils.eraseLine(this.model.pixelsToFill, ctxHelper, cellWidth);
        }
        this.model.pixelsToFill = coordsInner;
        Utils.fillPixels(this.model.pixelsToFill, ctxHelper, cellWidth, this.model.getColor());
      }
      if (this.model.currentTool === 'tool-move' && change) {
        if (this.model.prevX && this.model.prevY) {
          const width = this.model.width * this.model.zoom;
          const x = (cellX - this.model.dragDeltaX) * this.model.zoom;
          const y = (cellY - this.model.dragDeltaY) * this.model.zoom;
          ctx.clearRect(0, 0, width, width);
          ctx.drawImage(canvasHelper, 0, 0, width, width, x, y, width, width);
        }
      }
      if (this.model.currentTool === 'tool-dithering' && change) {
        if ((cellX % 2 === 0 && cellY % 2 === 0) || (cellX % 2 !== 0 && cellY % 2 !== 0)) {
          Utils.eraseCell({ x1: cellX, y1: cellY }, ctx, cellWidth);
        } else {
          Utils.drawCell({ x1: cellX, y1: cellY }, ctx, cellWidth, this.model.penColor);
        }
      }
      if (this.model.currentTool === 'tool-shape-select' && change) {
        if (this.model.prevX && this.model.prevY && this.model.selected) {
          const width = this.model.width * this.model.zoom;
          this.model.dragDeltaX = cellX - this.model.prevX;
          this.model.dragDeltaY = cellY - this.model.prevY;
          Utils.updatePixelsToFillCoords(this.model, this.model.dragDeltaX, this.model.dragDeltaY);
          ctxHelper.clearRect(0, 0, width, width);
          Utils.fillPixels(this.model.pixelsToFill, ctxHelper,
            cellWidth, this.model.colorSelectHelper);
        }
      }
      this.model.prevX = cellX;
      this.model.prevY = cellY;
    }
  }

  init() {
    document.querySelector('.tools-wrapper').addEventListener('pointerup', this.changeTool.bind(this));
    document.addEventListener('pointerup', this.documentUpEventHandler.bind(this));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') {
        this.model.shiftPressed = true;
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.model.shiftPressed = false;
      }
    });
  }
}
