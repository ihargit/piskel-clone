import Utils from '../../../utils/index';
import * as SidePanel from './index.html';
import './index.scss';
// import * as HTML from '../../canvas/index.html';
// import Canvas from '../../canvas/index';

export default class Resize {
  constructor(model) {
    this.utils = Utils;
    this.model = model;
  }

  static createIcon() {
    const icon = document.createElement('div');
    icon.classList.add('settings-icon', 'icon-settings-resize');
    icon.dataset.settings = 'resize';
    return icon;
  }

  static renderSidePanel() {
    const panel = Utils.htmlToDocFragment(SidePanel);
    return panel;
  }

  static resizeCanvases(model, e) {
    const form = document.getElementById('canvas-resize');
    const canvas = document.querySelector('.drawing-canvas');
    const helperCanvas = document.querySelector('.helper-canvas');
    const canvasWrapper = document.querySelector('.drawing-canvas-container');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = model.frames[model.currentFrame];
    e.preventDefault();
    model.setWidth(form.canvasSize.value);
    model.setHeight(form.canvasSize.value);
    model.setZoom();
    form.reset();
    Utils.hideSettingsPanel(e, true);
    canvas.width = model.getWidth() * model.getZoom();
    canvas.height = model.getHeight() * model.getZoom();
    helperCanvas.width = model.getWidth() * model.getZoom();
    helperCanvas.height = model.getHeight() * model.getZoom();
    Utils.resizeCanvasBackground(canvasWrapper, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    Utils.updateCursorCoordinates(model);
  }
}
