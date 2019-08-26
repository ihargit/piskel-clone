import * as HTML from './index.html';
import './index.scss';
import Tools from '../../components/tools/index';
import PreviewList from '../../components/preview-list/index';
import Canvas from '../../components/canvas';
import Preview from '../../components/preview/index';
import Utils from '../../utils/index';
import SettingsPanel from '../../components/settings/index';
import ColorPicker from '../../components/color-picker/index';
import CursorCoordinates from '../../components/cursor-coordinates/index';


export default class MainScreen {
  constructor(model) {
    this.model = model;
    this.html = HTML;
    this.previewList = new PreviewList(this.model);
    this.tools = new Tools(this.model);
    this.canvas = new Canvas();
    this.preview = new Preview(this.model);
    this.settings = new SettingsPanel(this.model);
    this.colorPicker = new ColorPicker(this.model);
    this.cursorCoordinates = new CursorCoordinates(this.model);
  }

  init() {
    const scr = Utils.htmlToDocFragment(this.html);
    document.body.style.visibility = 'hidden';
    document.body.append(scr);
    this.model.setZoom();

    document.querySelector('.left-sticky-section .vertical-center').append(this.tools.render());
    document.querySelector('.left-sticky-section .vertical-center').append(this.colorPicker.render());
    document.querySelector('.main .left-column').append(this.previewList.render());
    document.querySelector('.main .main-column').append(Canvas.render(this.model));
    document.querySelector('.main .right-column').append(this.preview.render());
    document.querySelector('.main .right-column').append(this.cursorCoordinates.render());
    document.querySelector('.settings-icons').append(this.settings.renderIcons());
    this.preview.animatePreview();
    this.colorPicker.init();
    this.tools.init();
    this.previewList.init();
    this.cursorCoordinates.init();

    document.body.style.visibility = '';
  }

  addEventListeners() {
    document.querySelector('.add-frame-action')
      .addEventListener('pointerup', this.previewList.addTileToPreviewList.bind(this));
    document.querySelector('.preview-list')
      .addEventListener('pointerup', this.previewList.deleteTileFromPreviewList.bind(this));
    document.querySelector('.preview-list')
      .addEventListener('pointerup', this.previewList.duplicateTileFromPreviewList.bind(this));
    document.querySelector('.drawing-canvas')
      .addEventListener('pointerdown', this.tools.canvasDownEventHandler.bind(this));
    document.addEventListener('pointerup', this.tools.canvasUpEventHandler.bind(this));
    document.addEventListener('pointermove', this.tools.canvasMoveEventHandler.bind(this));
    // document.querySelector('.drawing-canvas')
    //   .addEventListener('pointerout', Utils.nullXY.bind(this, this.model));
    document.addEventListener('pointerup', this.previewList.selectTileOnClick.bind(this));
    document.querySelector('#preview-fps')
      .addEventListener('input', this.preview.updateFpsOnPreviewWindow.bind(this));
    document.querySelector('#preview-fps')
      .addEventListener('input', this.preview.animatePreview.bind(this));
    document.querySelector('.settings-icons')
      .addEventListener('pointerup', this.settings.renderSettingsPanel.bind(this));
  }

  static addEventListeners2() {
    document.querySelector('.preview-fullscreen-icon')
      .addEventListener('pointerup', Preview.openPreviewFullScreen);
  }
}
