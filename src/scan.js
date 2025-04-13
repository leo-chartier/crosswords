/**
 * @param {HTMLCanvasElement} canvas
 */
export function scan(canvas) {
  let ctx = canvas.getContext('2d');
  let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let pixels = Array.from({ length: data.length / 4 }, (_, i) => data.slice(4 * i, 4 * i + 3));
  let gray = pixels.map((rgb) => Math.floor(rgb.reduce((a, v) => a + v) / 3));

  // TEMP
  for (let i = 0; i < gray.length; i++) {
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = gray[i];
  }
  ctx.putImageData(new ImageData(data, canvas.width), 0, 0);
  document.body.append(canvas);
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;

  // TODO: Reimplement opencv's algorithm because I can't build the node package for some reason
}
