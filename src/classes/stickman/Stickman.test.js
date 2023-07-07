import Stickman from "./Stickman.js";

test("stickman has x, y, width, height", () => {
  const stickman = new Stickman(50, 100, 0, 0, {});
  expect(stickman.size.x).toBe(50);
  expect(stickman.size.y).toBe(100);
  expect(stickman.position.x).toBe(0);
  expect(stickman.position.y).toBe(0);
});

test("stickman call callback on change pos, scale", () => {
  const stickman = new Stickman(50, 100, 0, 0, {});
  const sizeLogger = jest.fn();
  const positionLogger = jest.fn();
  stickman.size.setEventListener((x, y) => {
    sizeLogger();
  })
  stickman.position.setEventListener((x, y) => {
    positionLogger();
  })
  stickman.size.x = 10;
  expect(sizeLogger).toHaveBeenCalled();
  stickman.position.x = 10;
  expect(positionLogger).toHaveBeenCalled();
})

test("stickman x0 y0 to x0+x100 y0+y100 1s linear", async () => {
  const startTime = Date.now();
  const stickman = new Stickman(50, 100, 0, 0, {});
  const stack = [];
  const logger = (x, y) => {
    stack.push([x, y]);
  };
  stickman.position.setEventListener(logger);

  await stickman.move(100, 100, 1).linear();
  const endTime = Date.now();
  expect(endTime - startTime).toBeGreaterThanOrEqual(900);
  expect(endTime - startTime).toBeLessThanOrEqual(1100);
  expect(stack).toEqual([
    [6, 6],
    [12, 12],
    [18, 18],
    [24, 24],
    [30, 30],
    [36, 36],
    [42, 42],
    [48, 48],
    [54, 54],
    [60, 60],
    [66, 66],
    [72, 72],
    [78, 78],
    [84, 84],
    [90, 90],
    [96, 96],
    [100, 100],
  ]);
});

test("stickman x0 y0 to x100 y100 1s linear", async () => {
  const startTime = Date.now();
  const stickman = new Stickman(50, 100, 0, 0, {actionsList: 0});
  const stack = [];
  const logger = (x, y) => {
    stack.push([x, y]);
  };
  stickman.position.setEventListener(logger);

  await stickman.moveTo(100, 100, 1).linear();
  const endTime = Date.now();
  expect(endTime - startTime).toBeGreaterThanOrEqual(900);
  expect(endTime - startTime).toBeLessThanOrEqual(1100);
  expect(stack).toEqual([
    [6, 6],
    [12, 12],
    [18, 18],
    [24, 24],
    [30, 30],
    [36, 36],
    [42, 42],
    [48, 48],
    [54, 54],
    [60, 60],
    [66, 66],
    [72, 72],
    [78, 78],
    [84, 84],
    [90, 90],
    [96, 96],
    [100, 100],
  ]);
});