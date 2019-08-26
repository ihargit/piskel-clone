import * as HTML from './index.html';
import './index.scss';
import Utils from '../../utils/index';
import CanvasTemplate from './canvas';

export default class Canvas {
  constructor() {
    this.html = HTML;
  }

  static render(model) {
    const width = model.getWidth() * model.getZoom();
    const height = model.getHeight() * model.getZoom();
    const canvasWrapper = Utils.htmlToDocFragment(HTML);
    const canvasClasses = ['canvas', 'drawing-canvas', 'pen-cursor'];
    const helperCanvasClasses = ['canvas', 'helper-canvas', 'pen-cursor'];
    const newCanvas = CanvasTemplate.createCanvas(width, height, canvasClasses);
    const newHelperCanvas = CanvasTemplate.createCanvas(width, height, helperCanvasClasses);
    canvasWrapper.querySelector('.drawing-canvas-container').prepend(newCanvas);
    canvasWrapper.querySelector('.drawing-canvas-container').prepend(newHelperCanvas);
    Utils.resizeCanvasBackground(canvasWrapper, width, height);
    return canvasWrapper;
  }
}
