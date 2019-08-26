import Utils from './index';

describe('Utils.nullXY', () => {
  it('Should change values to undefined', () => {
    const model = { prevX: 1, prevY: 1 };
    Utils.nullXY(model);
    expect(model).toEqual({ prevX: undefined, prevY: undefined });
  });
});

describe('Utils.reorderFrames', () => {
  it('Should reorder values in array', () => {
    const model = {
      frames: [1, 2, 3, 4, 5],
      currentFrame: 0,
      setCurrentFrame: (newCurrentFrame) => {
        model.currentFrame = newCurrentFrame;
      },
    };
    const removePosition = 2;
    const insertPosition = 3;
    Utils.reorderFrames(model, removePosition, insertPosition);
    expect(model.currentFrame).toBe(3);
    expect(model.frames).toEqual([1, 2, 4, 3, 5]);
  });
});
