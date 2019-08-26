export default class Utils {
  static htmlToDocFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  }

  static calculateZoom(width, height) {
    let zoom = 1;
    const mainColumn = document.querySelector('.main-column');

    if (mainColumn) {
      const colHeight = mainColumn.clientHeight;
      const colWidth = mainColumn.clientWidth;
      zoom = Math.floor(Math.min(colHeight, colWidth) / Math.min(width, height));
    }
    return zoom;
  }

  static resizeCanvasBackground(canvasWrapper, width, height) {
    const canvasParentNode = canvasWrapper;
    canvasParentNode.querySelector('.canvas-background').style.width = `${width}px`;
    canvasParentNode.querySelector('.canvas-background').style.height = `${height}px`;
  }

  static reorderFrames(model, removePosition, insertPosition) {
    const frame = model.frames.splice(removePosition, 1)[0];
    model.frames.splice(insertPosition, 0, frame);
    model.setCurrentFrame(insertPosition);
  }

  static renumberTiles(argTileNumber, moreLess) {
    const tiles = document.querySelectorAll('.preview-tile');
    tiles.forEach((oneTile, index) => {
      const tile = oneTile;
      const thisTileNumber = Number(oneTile.dataset.tileNumber);
      if (moreLess === 'more') {
        if (thisTileNumber > argTileNumber) {
          tile.dataset.tileNumber = `${thisTileNumber + 1}`;
        }
      }
      if (moreLess === 'less') {
        if (thisTileNumber > argTileNumber) {
          tile.dataset.tileNumber = `${thisTileNumber - 1}`;
        }
      }
      if (moreLess === 'reorder') {
        tile.dataset.tileNumber = `${index}`;
      }
    });
  }

  static deleteClassFromItems(classFind, classDelete) {
    const items = document.querySelectorAll(`.${classFind}`);
    items.forEach((oneItem) => {
      const item = oneItem;
      item.classList.remove(classDelete);
    });
  }

  static redrawMainCanvas(model, framePosition) {
    const canvas = document.querySelector('.drawing-canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    if (model.frames[framePosition] !== 0) {
      const img = new Image();
      img.src = model.frames[model.currentFrame];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  static copyCanvasToPreview(model) {
    const canvas = document.querySelector('.drawing-canvas');
    const targetTileCanvas = document.querySelectorAll(`[data-tile-number='${model.getCurrentFrame()}']`)[0]
      .querySelector('.tile-view');
    const ctx = targetTileCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, 96, 96);
  }

  static changePreviewBackground(image) {
    const previewBackgroundContainer = document.querySelector('.background-image-frame-container');
    previewBackgroundContainer.style = `background-repeat: no-repeat; background-size: contain; background-image: url(${image})`;
  }

  static calcStraightLine(coords) {
    const coordsArray = [];
    let { startX: x1, startY: y1 } = coords;
    const { endX: x2, endY: y2 } = coords;
    const diffX = Math.abs(x2 - x1);
    const diffY = Math.abs(y2 - y1);
    const signX = (x1 < x2) ? 1 : -1;
    const signY = (y1 < y2) ? 1 : -1;
    let err = diffX - diffY;

    coordsArray.push({ x1, y1 });

    while (!((x1 === x2) && (y1 === y2))) {
      const err2 = err * 2;
      if (err2 > -diffY) {
        err -= diffY;
        x1 += signX;
      }
      if (err2 < diffX) {
        err += diffX;
        y1 += signY;
      }
      coordsArray.push({ x1, y1 });
    }
    return coordsArray;
  }

  static drawCell(crd, ctx, cellWidth, color) {
    ctx.fillStyle = color;
    ctx.fillRect(crd.x1 * cellWidth, crd.y1 * cellWidth, cellWidth, cellWidth);
  }

  static fillPixels(coords, ctx, cellWidth, color) {
    coords.forEach(crd => this.drawCell(crd, ctx, cellWidth, color));
  }

  static eraseCell(crd, ctx, cellWidth) {
    ctx.clearRect(crd.x1 * cellWidth, crd.y1 * cellWidth, cellWidth, cellWidth);
  }

  static eraseLine(coords, ctx, cellWidth) {
    coords.forEach(crd => this.eraseCell(crd, ctx, cellWidth));
  }

  static hideSettingsPanel(e, hide) {
    if ((!e.target.closest('.drawer') && !e.target.closest('.settings-icons')) || hide === true) {
      document.querySelector('.has-expanded-drawer')
        .classList
        .remove('has-expanded-drawer');
      document.querySelector('.right-sticky-section')
        .classList
        .remove('expanded');
      document.removeEventListener('pointerup', Utils.hideSettingsPanel);
    }
  }

  // Used in main screen event listener (temporarily disabled)!
  static nullXY(model) {
    const mod = model;
    mod.prevX = undefined;
    mod.prevY = undefined;
  }

  static removeClassesWithRegex(element, regex) {
    for (let i = element.classList.length - 1; i > 0; i -= 1) {
      if (regex.test(element.classList[i])) {
        element.classList.remove(element.classList[i]);
      }
    }
  }

  static matchStartColor(pixelPos, canvasData, startR, startG, startB, startA) {
    const r = canvasData.data[pixelPos];
    const g = canvasData.data[pixelPos + 1];
    const b = canvasData.data[pixelPos + 2];
    const a = canvasData.data[pixelPos + 3];
    return (r === startR && g === startG && b === startB && a === startA);
  }

  static colorPixel(pixelPos, canvasData, model, colorNumber) {
    const colorLayerData = canvasData;
    for (let i = 0; i < model.zoom; i += 1) {
      colorLayerData.data[pixelPos + i] = colorNumber;
      colorLayerData.data[pixelPos + 1 + i] = colorNumber;
      colorLayerData.data[pixelPos + 2 + i] = colorNumber;
      colorLayerData.data[pixelPos + 3 + i] = colorNumber;
      colorLayerData.data[pixelPos + 3 + i] = colorNumber;
    }
  }

  static findNearSameColorCoords(model, ctx, startX, startY) {
    const startColorData = ctx.getImageData(startX * model.zoom, startY * model.zoom, 1, 1).data;
    let colorNumber = 255;
    const [startR, startG, startB, startA] = [startColorData[0],
      startColorData[1], startColorData[2], startColorData[3]];
    if (startA === colorNumber) {
      colorNumber = 200;
    }
    const canvasData = ctx.getImageData(0, 0, model.width * model.zoom,
      model.width * model.zoom);
    const pixelStack = [[startX, startY]];
    const coordsToFill = [];

    while (pixelStack.length) {
      let pixelPos;
      let reachLeft;
      let reachRight;
      const newPos = pixelStack.pop();
      const [x] = [newPos[0]];
      let [y] = [newPos[1]];

      pixelPos = (y * model.width * model.zoom * model.zoom + x * model.zoom) * 4;
      while (y >= 0 && this.matchStartColor(pixelPos, canvasData,
        startR, startG, startB, startA)) {
        y -= 1;
        pixelPos -= model.width * model.zoom * model.zoom * 4;
      }
      y += 1;
      pixelPos += model.width * model.zoom * model.zoom * 4;
      reachLeft = false;
      reachRight = false;
      while (y + 1 < model.width + 1 && this.matchStartColor(pixelPos,
        canvasData, startR, startG, startB, startA)) {
        coordsToFill.push({ x1: x, y1: y });
        this.colorPixel(pixelPos, canvasData, model, colorNumber);

        if (x > 0) {
          if (this.matchStartColor((pixelPos - 4 * model.zoom),
            canvasData, startR, startG, startB, startA)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < model.width - 1) {
          if (this.matchStartColor((pixelPos + 4 * model.zoom),
            canvasData, startR, startG, startB, startA)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        pixelPos += model.width * model.zoom * model.zoom * 4;
        y += 1;
      }
    }
    return coordsToFill;
  }

  static findSameColorCoords(model, ctx, startX, startY) {
    const startColorData = ctx.getImageData(startX * model.zoom, startY * model.zoom, 1, 1).data;
    const canvasData = ctx.getImageData(0, 0, model.width * model.zoom,
      model.width * model.zoom);
    let colorNumber = 255;
    const [startR, startG, startB, startA] = [startColorData[0],
      startColorData[1], startColorData[2], startColorData[3]];
    let pixelPos;
    if (startA === colorNumber) {
      colorNumber = 200;
    }
    const coordsToFill = [];
    for (let x = 0; x < model.width; x += 1) {
      for (let y = 0; y < model.height; y += 1) {
        pixelPos = (y * model.width * model.zoom * model.zoom + x * model.zoom) * 4;
        if (this.matchStartColor(pixelPos,
          canvasData, startR, startG, startB, startA)) {
          coordsToFill.push({ x1: x, y1: y });
        }
      }
    }
    return coordsToFill;
  }

  static mirrorCoords(coords, canvasWidth) {
    const newCoords = [];
    coords.forEach((cd) => {
      const newX = canvasWidth - (cd.x1 + 1);
      if (newX !== cd.x1) {
        newCoords.push({ x1: newX, y1: cd.y1 });
      }
    });
    return newCoords.concat(coords);
  }

  static updateCursorCoordinates(model) {
    const coords = document.querySelector('.cursor-coordinates');
    coords.innerText = `[${model.width}x${model.width}]  `;
  }

  static RGBAtoHEX(r, g, b) {
    let innerR = r.toString(16);
    let innerG = g.toString(16);
    let innerB = b.toString(16);

    if (innerR.length === 1) {
      innerR = `0${innerR}`;
    }
    if (innerG.length === 1) {
      innerG = `0${innerG}`;
    }
    if (innerB.length === 1) {
      innerB = `0${innerB}`;
    }
    return `#${innerR}${innerG}${innerB}`;
  }

  static checkPixelTransparency(model, ctx, coordX, coordY) {
    const startColorData = ctx.getImageData(coordX * model.zoom, coordY * model.zoom, 1, 1).data;
    if (startColorData[3] === 0) {
      return true;
    }
    return false;
  }

  static getColorFromPixel(model, ctx, coordX, coordY) {
    const startColorData = ctx.getImageData(coordX * model.zoom, coordY * model.zoom, 1, 1).data;
    const [r, g, b] = [startColorData[0],
      startColorData[1], startColorData[2]];
    return this.RGBAtoHEX(r, g, b);
  }

  static checkIfCoordsChanged(model, x, y) {
    if (x !== model.prevX || y !== model.prevY) {
      return true;
    }
    return false;
  }

  static calcRectanglePixelsCoords(model, x, y) {
    const topLine = this.calcStraightLine({
      startX: model.startStrokeX,
      startY: model.startStrokeY,
      endX: x,
      endY: model.startStrokeY,
    });
    const bottomLine = this.calcStraightLine({
      startX: model.startStrokeX,
      startY: y,
      endX: x,
      endY: y,
    });
    const rightLine = this.calcStraightLine({
      startX: x,
      startY: model.startStrokeY,
      endX: x,
      endY: y,
    });
    const leftLine = this.calcStraightLine({
      startX: model.startStrokeX,
      startY: model.startStrokeY,
      endX: model.startStrokeX,
      endY: y,
    });
    return topLine.concat(bottomLine).concat(rightLine).concat(leftLine);
  }

  /** Bresenham's circle draw algorithm */
  // static calcCirclePixelsCoords(model, currX, currY) {
  //   const radius = Math.round(Math.abs(currX - model.startStrokeX) / 2);
  //   const centerX = Math.round((currX + model.startStrokeX) / 2);
  //   const centerY = Math.round((currY + model.startStrokeY) / 2);
  //   const coordsArray = [];
  //   let x = 0;
  //   let y = radius;
  //   let delta = 1 - 2 * radius;
  //   let error = 0;
  //   while (y >= 0) {
  //     let proceed = true;
  //     coordsArray.push({ x1: centerX + x, y1: centerY + y });
  //     coordsArray.push({ x1: centerX + x, y1: centerY - y });
  //     coordsArray.push({ x1: centerX - x, y1: centerY + y });
  //     coordsArray.push({ x1: centerX - x, y1: centerY - y });
  //     error = 2 * (delta + y) - 1;
  //     if (delta < 0 && error <= 0) {
  //       x += 1;
  //       delta += 2 * x + 1;
  //       proceed = false;
  //     }
  //     if (proceed) {
  //       error = 2 * (delta - x) - 1;
  //       if (delta > 0 && error > 0) {
  //         y -= 1;
  //         delta -= 2 * y + 1;
  //         proceed = false;
  //       }
  //     }
  //     if (proceed) {
  //       x += 1;
  //       delta += 2 * (x - y);
  //       y -= 1;
  //     }
  //   }
  //   return coordsArray;
  // }

  /** Original Piskel like circle draw algorithm */
  static calcCirclePixelsCoords(model, currX, currY) {
    const startX = Math.min(model.startStrokeX, currX);
    const startY = Math.min(model.startStrokeY, currY);
    const endX = Math.max(model.startStrokeX, currX);
    const endY = Math.max(model.startStrokeY, currY);
    const centerX = Math.round((startX + endX) / 2);
    const centerY = Math.round((startY + endY) / 2);
    const coordsArray = [];
    const evenX = (endX + startX) % 2;
    const evenY = (endY + startY) % 2;
    const rX = endX - centerX;
    const rY = endY - centerY;

    let x;
    let y;
    let angle;

    for (x = startX; x <= centerX; x += 1) {
      angle = Math.acos((x - centerX) / rX);
      y = Math.round(rY * Math.sin(angle) + centerY);
      coordsArray.push({ x1: x - evenX, y1: y });
      coordsArray.push({ x1: x - evenX, y1: 2 * centerY - y - evenY });
      coordsArray.push({ x1: 2 * centerX - x, y1: y });
      coordsArray.push({ x1: 2 * centerX - x, y1: 2 * centerY - y - evenY });
    }
    for (y = startY; y <= centerY; y += 1) {
      angle = Math.asin((y - centerY) / rY);
      x = Math.round(rX * Math.cos(angle) + centerX);
      coordsArray.push({ x1: x, y1: y - evenY });
      coordsArray.push({ x1: 2 * centerX - x - evenX, y1: y - evenY });
      coordsArray.push({ x1: x, y1: 2 * centerY - y });
      coordsArray.push({ x1: 2 * centerX - x - evenX, y1: 2 * centerY - y });
    }
    return coordsArray;
  }

  static updatePixelsToFillCoords(model, dragDeltaX, dragDeltaY) {
    model.pixelsToFill.forEach((crd) => {
      const cd = crd;
      cd.x1 += dragDeltaX;
      cd.y1 += dragDeltaY;
    });
  }

  static updatePreview(model) {
    const m = model;
    const canvas = document.querySelector('.drawing-canvas');
    m.frames[m.getCurrentFrame()] = canvas.toDataURL();
    const targetTileCanvas = document.querySelectorAll(`[data-tile-number='${
      m.getCurrentFrame()}']`)[0].querySelector('.tile-view');
    const ctxTile = targetTileCanvas.getContext('2d');
    ctxTile.clearRect(0, 0, 96, 96);
    ctxTile.drawImage(canvas, 0, 0, 96, 96);
    if (m.fps === 0) {
      Utils.changePreviewBackground(m.frames[m.currentFrame]);
    }
  }

  static copyArrayWithCoords(array) {
    const newArray = [];
    array.forEach((crd) => {
      const cd = { x1: crd.x1, y1: crd.y1 };
      newArray.push(cd);
    });
    return newArray;
  }
}
