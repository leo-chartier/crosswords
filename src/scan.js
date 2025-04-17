let openCV = null;

function getOpenCV() {
  if (openCV) return openCV;

  // In case of hot reload, the previous script is still here but the var is cleared
  const oldScript = document.getElementById('opencv');
  if (oldScript) {
    alert('Hot reload detected. Please reload the page fully.');
    return null;
  }

  openCV = new Promise((resolve) => {
    const script = document.createElement('script');
    script.setAttribute('id', 'opencv');
    script.src = 'https://docs.opencv.org/4.11.0/opencv.js';
    script.onload = () => cv.then(resolve);
    document.head.appendChild(script);
  });

  return openCV;
}

function orderQuadPoints(points) {
  // Sort by y, then x to find top-left and top-right
  points.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const [tl, tr] = points[0][0] < points[1][0] ? [points[0], points[1]] : [points[1], points[0]];
  const [bl, br] = points[2][0] < points[3][0] ? [points[2], points[3]] : [points[3], points[2]];
  return [tl, tr, bl, br];
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export async function scan(canvas) {
  const cv = await getOpenCV();
  if (!cv) return;

  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const mat = cv.matFromImageData(imgData);

  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  const thresh = new cv.Mat();
  cv.adaptiveThreshold(gray, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 15, 3);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(thresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

  const points = orderQuadPoints(findFirstQuad(cv, contours, 20));
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points.flat());
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, 0, h, w, h]);
  const transform = cv.getPerspectiveTransform(srcTri, dstTri);
  const warpped = new cv.Mat();
  cv.warpPerspective(mat, warpped, transform, new cv.Size(w, h));
  show(cv, canvas, warpped);

  // Cleanup
  mat.delete();
  gray.delete();
  thresh.delete();
  contours.delete();
  hierarchy.delete();
  srcTri.delete();
  dstTri.delete();
  transform.delete();
  warpped.delete();
}

/**
 *
 * @param {Array} contours
 * @param {number} angleTolerance
 */
function findFirstQuad(cv, contours, angleTolerance) {
  const nbVertices = 4;

  function angle(pt1, pt2, pt0) {
    const v1 = [pt1[0] - pt0[0], pt1[1] - pt0[1]];
    const v2 = [pt2[0] - pt0[0], pt2[1] - pt0[1]];
    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const norm1 = Math.hypot(v1[0], v1[1]);
    const norm2 = Math.hypot(v2[0], v2[1]);
    const cos = Math.min(1, Math.max(-1, dot / (norm1 * norm2)));
    return Math.acos(cos) * (180 / Math.PI);
  }

  function compare(indexA, indexB) {
    const cntA = contours.get(indexA);
    const cntB = contours.get(indexB);
    const areaA = cv.contourArea(cntA);
    const areaB = cv.contourArea(cntB);
    cntA.delete();
    cntB.delete();
    return areaB - areaA;
  }

  const approx = new cv.Mat();
  let points;
  [...Array(contours.size()).keys()].sort(compare).find((index, i) => {
    const cnt = contours.get(index);

    const epsilon = 0.1 * cv.arcLength(cnt, true);
    cv.approxPolyDP(cnt, approx, epsilon, true);
    cnt.delete();
    console.log(approx.size().height, Array.from(approx.data32S)); // TEMP
    if (approx.size().height != nbVertices) return false;

    points = Array.from({ length: nbVertices }, (_, i) =>
      Array.from(approx.data32S.slice(2 * i, 2 * i + 2)),
    );
    const angles = points.map((_, i) =>
      angle(points[i], points[(i + 2) % nbVertices], points[(i + 1) % nbVertices]),
    );

    const isQuad = angles.every((a) => a >= 90 - angleTolerance && a <= 90 + angleTolerance);
    console.log(angles, isQuad); // TEMP
    return isQuad;
  });

  approx.delete();
  return points;
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function show(cv, canvas, mat) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cv.imshow(canvas, mat);

  document.body.append(canvas);
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
}
