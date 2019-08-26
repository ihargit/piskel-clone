import './index.scss';
import Utils from '../../utils/index';
import Resize from './resize/index';

export default class SettingsPanel {
  constructor(model) {
    this.model = model;
    this.utils = Utils;
    this.fragment = document.createDocumentFragment();
    this.resize = new Resize(this.model);
  }

  renderIcons() {
    this.fragment.append(Resize.createIcon());
    return this.fragment;
  }

  renderSettingsPanel(e) {
    document.addEventListener('pointerup', Utils.hideSettingsPanel);
    const drawer = document.querySelector('.drawer');
    const iconType = e.target.dataset.settings;
    if (iconType === 'resize') {
      e.target.classList.add('has-expanded-drawer');
      while (drawer.firstChild) drawer.removeChild(drawer.firstChild);
      drawer.appendChild(Resize.renderSidePanel());
      document.querySelector(`#width${this.model.width}`)
        .setAttribute('checked', 'checked');
      document.querySelector('#canvas-resize')
        .addEventListener('submit', Resize.resizeCanvases.bind(null, this.model));
      document.querySelector('.right-sticky-section')
        .classList
        .add('expanded');
    }
  }
}
