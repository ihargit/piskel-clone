import * as HTML from './index.html';
import './index.scss';
import Utils from '../../utils';

export default class ColorPicker {
  constructor(model) {
    this.html = HTML;
    this.model = model;
  }

  render() {
    return Utils.htmlToDocFragment(this.html);
  }

  updateCurrentColor(e) {
    const color = e.target.value;
    this.model.setColor(color);
  }

  swapColors() {
    const primary = document.getElementById('color-primary');
    const secondary = document.getElementById('color-secondary');
    this.model.setColor(secondary.value);
    secondary.value = primary.value;
    primary.value = this.model.getColor();
  }

  init() {
    document.getElementById('color-primary').addEventListener('change', this.updateCurrentColor.bind(this));
    document.querySelector('.swap-color-button').addEventListener('pointerup', this.swapColors.bind(this));
  }
}
