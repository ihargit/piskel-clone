import * as HTML from './index.html';
import './index.scss';
import * as TILE from './tile.html';
import Utils from '../../utils/index';

export default class PreviewList {
  constructor(model) {
    this.html = HTML;
    this.tile = TILE;
    this.model = model;
    this.dragTile = undefined;
    this.dragDropHandler = this.dragDropTile.bind(this);
    this.prevTileY = undefined;
    this.prevClientY = undefined;
    this.tileProxy = false;
    this.tileOrderShift = 0;
    this.shiftX = 10;
    this.dragTileNumber = undefined;
    this.previousTileNumber = undefined;
  }

  renderTile() {
    return Utils.htmlToDocFragment(this.tile);
  }

  render() {
    const list = Utils.htmlToDocFragment(this.html);
    list.querySelector('.preview-list').prepend(this.renderTile());
    return list;
  }

  dragDropTile(e) {
    const newTop = this.prevTileY + (e.clientY - this.prevClientY);
    this.dragTile.style = `width: 96px; height: 96px; position: absolute; top:${newTop}px; z-index: 2000;`;

    if (!this.tileProxy) {
      this.dragTile.insertAdjacentHTML('beforebegin',
        '<li class="preview-tile preview-tile-drop-proxy"></li>');
      this.tileProxy = true;
    }

    this.dragTile.style.visibility = 'hidden';

    if (document.elementFromPoint(this.dragTile.getBoundingClientRect().left + 10, e.clientY)) {
      const point = document.elementFromPoint(this.dragTile
        .getBoundingClientRect().left + 10, e.clientY);
      if (point.closest('.preview-tile')) {
        const underTile = point.closest('.preview-tile');
        if (!underTile.classList.contains('preview-tile-drop-proxy')) {
          const underTileNumber = Number(underTile.dataset.tileNumber);
          const list = document.querySelector('.preview-list');
          const proxy = list.querySelector('.preview-tile-drop-proxy');
          if (this.previousTileNumber > underTileNumber) {
            this.tileOrderShift -= 1;
            list.insertBefore(proxy, underTile);
          } else if (this.previousTileNumber < underTileNumber) {
            this.tileOrderShift += 1;
            list.insertBefore(proxy, underTile.nextElementSibling);
          } else if (this.previousTileNumber === underTileNumber) {
            if (this.tileOrderShift > 0) {
              this.tileOrderShift -= 1;
              list.insertBefore(proxy, underTile);
            } else {
              this.tileOrderShift += 1;
              list.insertBefore(proxy, underTile.nextElementSibling);
            }
          }
          this.previousTileNumber = underTileNumber;
        }
      }
    }

    this.dragTile.style = `width: 96px; height: 96px; position: absolute; top:${newTop}px; z-index: 2000;`;

    this.prevTileY = newTop;
    this.prevClientY = e.clientY;
  }

  prepareDragDrop(e) {
    if (e.target.closest('.tile-view')) {
      this.dragTile = e.target.closest('.preview-tile');
      this.model.tileClicked = this.dragTile;
      this.dragTileNumber = Number(this.dragTile.dataset.tileNumber);
      this.previousTileNumber = this.dragTileNumber;
      const shiftY = (e.clientY - this.dragTile.getBoundingClientRect().top) + document.querySelector('.preview-list').getBoundingClientRect().top;
      this.prevTileY = e.clientY - shiftY;
      this.prevClientY = e.clientY;
      this.model.dragTile = true;
      document.addEventListener('pointermove', this.dragDropHandler);
    }
  }

  finishDragDrop() {
    if (this.model.dragTile) {
      document.removeEventListener('pointermove', this.dragDropHandler);
      if (document.querySelector('.preview-tile-drop-proxy')) {
        const tileHost = document.querySelector('.preview-tile-drop-proxy');
        const list = document.querySelector('.preview-list');
        const newDragTileNumber = this.dragTileNumber + this.tileOrderShift;
        this.dragTile.style = 'position: relative; z-index: 1; top: 0px; left: 0px;';
        list.insertBefore(this.dragTile, tileHost);
        tileHost.remove();
        if (this.dragTileNumber !== newDragTileNumber) {
          Utils.reorderFrames(this.model, this.dragTileNumber, newDragTileNumber);
          Utils.renumberTiles(undefined, 'reorder');
        }
        // this.model.tileClicked = true;
      }
      this.dragTile = undefined;
      this.prevTileY = undefined;
      this.prevClientY = undefined;
      this.model.dragTile = false;
      this.tileProxy = false;
      this.tileOrderShift = 0;
      this.dragTileNumber = undefined;
      this.previousTileNumber = undefined;
    }
  }

  init() {
    const prList = document.querySelector('.preview-list');
    prList.addEventListener('pointerdown', this.prepareDragDrop.bind(this));
    document.addEventListener('pointerup', this.finishDragDrop.bind(this));
  }

  addTileToPreviewList() {
    const list = document.querySelector('.preview-list');
    let tile = Utils.htmlToDocFragment(TILE);
    list.insertBefore(tile, list.lastElementChild);
    Utils.deleteClassFromItems('preview-tile', 'selected');
    tile = list.lastElementChild.previousElementSibling;
    tile.classList.add('selected');
    this.model.frames.push(this.model.emptyImage);
    tile.setAttribute('data-tile-number', this.model.frames.length - 1);
    this.model.setCurrentFrame(this.model.frames.length - 1);
    Utils.redrawMainCanvas(this.model, this.model.getCurrentFrame());
    if (this.model.fps === 0) {
      Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
    }
  }

  deleteTileFromPreviewList(e) {
    if (!this.model.dragTile && e.target.closest('.delete-frame-action')
      && document.querySelector('.preview-list').childElementCount > 2) {
      const tile = e.target.closest('.preview-tile');
      const tileNumber = Number(tile.dataset.tileNumber);
      this.model.frames.splice(tileNumber, 1);
      if (tile.classList.contains('selected')) {
        const previousTile = tile.previousElementSibling;
        if (previousTile) {
          previousTile.classList.add('selected');
          this.model.setCurrentFrame(this.model.getCurrentFrame() - 1);
          Utils.redrawMainCanvas(this.model, tileNumber - 1);
          if (this.model.fps === 0) {
            Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
          }
        } else {
          Utils.deleteClassFromItems('preview-tile', 'selected');
          tile.nextElementSibling.classList.add('selected');
          Utils.redrawMainCanvas(this.model, tileNumber + 1);
          if (this.model.fps === 0) {
            Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
          }
        }
      } else if (tileNumber < this.model.getCurrentFrame()) {
        if (this.model.fps === 0) {
          Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
        }
        this.model.setCurrentFrame(this.model.getCurrentFrame() - 1);
      }
      Utils.renumberTiles(tileNumber, 'less');
      tile.remove();
    } else if (e.target.closest('.delete-frame-action')
      && document.querySelector('.preview-list').childElementCount <= 2) {
      e.target.closest('.delete-frame-action').blur();
    }
  }

  duplicateTileFromPreviewList(e) {
    if (!this.model.dragTile && e.target.closest('.duplicate-frame-action')) {
      const list = document.querySelector('.preview-list');
      const tile = e.target.closest('.preview-tile');
      const tileNumber = Number(tile.dataset.tileNumber);
      const clone = tile.cloneNode(true);

      this.model.frames.splice(tileNumber + 1, 0,
        this.model.frames[tileNumber]);
      Utils.renumberTiles(tileNumber, 'more');
      clone.setAttribute('data-tile-number', tileNumber + 1);
      Utils.deleteClassFromItems('preview-tile', 'selected');
      clone.classList.add('selected');
      this.model.setCurrentFrame(tileNumber + 1);
      list.insertBefore(clone, e.target.closest('.preview-tile').nextSibling);
      Utils.redrawMainCanvas(this.model, this.model.getCurrentFrame() - 1);
      Utils.copyCanvasToPreview(this.model);
      e.target.closest('.duplicate-frame-action').blur();
      if (this.model.fps === 0) {
        Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
      }
    }
  }

  selectTileOnClick(e) {
    if (this.model.tileClicked || e.target.closest('.tile-view')) {
      let tile;
      if (this.model.tileClicked) {
        tile = this.model.tileClicked;
      } else {
        tile = e.target.closest('.preview-tile');
      }

      if (!tile.classList.contains('selected')) {
        Utils.deleteClassFromItems('preview-tile', 'selected');
        tile.classList.add('selected');
        this.model.setCurrentFrame(Number(tile.dataset.tileNumber));
        Utils.redrawMainCanvas(this.model, this.model.getCurrentFrame());
        if (this.model.fps === 0) {
          Utils.changePreviewBackground(this.model.frames[this.model.currentFrame]);
        }
      }
      this.model.tileClicked = undefined;
    }
  }
}
