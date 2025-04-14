let openCVReady = null;

function getOpenCV() {
  if (openCVReady) return openCVReady;

  openCVReady = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.11.0/opencv.js';
    script.onload = () => cv.then(resolve);
    document.head.appendChild(script);
  });

  return openCVReady;
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export async function scan(canvas) {
  const opencv = await getOpenCV();

  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const mat = opencv.matFromImageData(imgData);

  const gray = new opencv.Mat();
  opencv.cvtColor(mat, gray, opencv.COLOR_RGBA2GRAY, 0);
  show(opencv, canvas, gray);

  mat.delete();
  gray.delete();
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function show(opencv, canvas, mat) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  opencv.imshow(canvas, mat);

  document.body.append(canvas);
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
}
