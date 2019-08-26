import * as HTML from './index.html';
import './index.scss';
import Utils from '../../utils/index';

export default class PreviewContainer {
  constructor(model) {
    this.html = HTML;
    this.model = model;
  }

  render() {
    return Utils.htmlToDocFragment(this.html);
  }

  animatePreview() {
    const thisModel = this.model;
    let currFrame = this.model.currentFrame;
    if (this.model.animationIntervalId) {
      clearInterval(this.model.animationIntervalId);
    }
    function getNewBackground() {
      currFrame += 1;
      if (currFrame >= thisModel.frames.length) {
        currFrame = 0;
      }
      let image = thisModel.frames[currFrame];
      if (typeof image !== 'string') {
        image = thisModel.emptyImage;
      }
      return image;
    }
    function changePreviewBackground() {
      Utils.changePreviewBackground(getNewBackground());
    }
    if (this.model.fps === 0) {
      Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
    } else {
      this.model.animationIntervalId = setInterval(changePreviewBackground, 1000 / this.model.fps);
    }
  }

  updateFpsOnPreviewWindow(e) {
    document.querySelector('#display-fps').textContent = `${e.target.value} FPS`;
    this.model.fps = Number(e.target.value);
  }

  static openPreviewFullScreen() {
    document.querySelector('.preview-canvas-container').requestFullscreen();
  }
}
