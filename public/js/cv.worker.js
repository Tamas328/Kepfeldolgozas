const _brightness = 0;
const _contrast = 1.0;

function imageGrayscale({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();

  cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY);
  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function resize({ msg, payload, value }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();
  let dsize = new cv.Size(value.resizeWidth, value.resizeHeight);

  cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function gaussianBlurring({ msg, payload, value }) {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();

  let ksize = new cv.Size(value, value);
  cv.GaussianBlur(img, result, ksize, 1);

  postMessage({ msg, payload: imageDataFromMat(result) });
}

function medianBlur({ msg, payload, value }) {
  let img = cv.matFromImageData(payload);
  let result = new cv.Mat();
  cv.medianBlur(img, result, value);

  postMessage({ msg, payload: imageDataFromMat(result) });
}

function bilateralFiltering({ msg, payload, value }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();

  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
  cv.bilateralFilter(src, dst, 9, 75, 75, cv.BORDER_DEFAULT);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function canny({ msg, payload }) {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();
  cv.cvtColor(img, img, cv.COLOR_BGR2GRAY);
  cv.Canny(img, result, 50, 100, 3, false);

  postMessage({ msg, payload: imageDataFromMat(result) });
}

function calculateHistogram({ msg, payload, value }) {
  let src = cv.matFromImageData(payload);
  let srcVec = new cv.MatVector();
  srcVec.push_back(src);

  let accumulate = false;
  let histSize = [256];
  let ranges = [0, 255];
  let hist = new cv.Mat();
  let mask = new cv.Mat();
  let colors = [
    new cv.Scalar(255, 0, 0),
    new cv.Scalar(0, 255, 0),
    new cv.Scalar(0, 0, 255),
  ];
  let scale = 4.5;
  let histograms = [
    new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3),
    new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3),
    new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3),
  ];

  let dst = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);
  let alpha = 1;

  for (let i = 0; i < 3; ++i) {
    cv.calcHist(srcVec, [i], mask, hist, histSize, ranges, accumulate);
    let result = cv.minMaxLoc(hist, mask);
    let max = result.maxVal;
    for (let j = 0; j < histSize[0]; ++j) {
      let binVal = (hist.data32F[j] * src.rows) / max;
      let point1 = new cv.Point(j * scale, src.rows - 1);
      let point2 = new cv.Point((j + 1) * scale - 1, src.rows - binVal);
      cv.rectangle(histograms[i], point1, point2, colors[i], cv.FILLED);
    }
    if (value == 3) {
      cv.addWeighted(histograms[i], alpha, dst, 1, 0, dst);
    } else {
      cv.addWeighted(histograms[value], alpha, dst, 1, 0, dst);
    }
  }

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function equalizeHistogram({ msg, payload }) {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();

  cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
  cv.equalizeHist(img, result);

  postMessage({ msg, payload: imageDataFromMat(result) });
}

function simpleThreshold({ msg, payload }) {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();

  cv.threshold(img, result, 177, 200, cv.THRESH_BINARY);

  postMessage({ msg, payload: imageDataFromMat(result) });
}

function adaptiveThreshold({ msg, payload }) {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();
  cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
  cv.adaptiveThreshold(
    img,
    result,
    200,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    3,
    3
  );

  postMessage({ msg, payload: imageDataFromMat(result) });
}

function clahe({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  let equalDst = new cv.Mat();
  let claheDst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_BGR2GRAY, 0);
  cv.equalizeHist(src, equalDst);
  let tileGridSize = new cv.Size(8, 8);
  let clahe = new cv.CLAHE(40, tileGridSize);
  clahe.apply(src, claheDst);

  postMessage({ msg, payload: imageDataFromMat(claheDst) });

  src.delete();
  equalDst.delete();
  claheDst.delete();
  clahe.delete();
}

function erosion({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(5, 5, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.erode(
    src,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function dilation({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(5, 5, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.dilate(
    src,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function opening({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(5, 5, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.morphologyEx(
    src,
    dst,
    cv.MORPH_OPEN,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function closing({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(5, 5, cv.CV_8U);

  cv.morphologyEx(src, dst, cv.MORPH_CLOSE, M);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function morphGradient({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(5, 5, cv.CV_8U);
  cv.morphologyEx(src, dst, cv.MORPH_GRADIENT, M);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function topHat({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(9, 9, cv.CV_8U);

  cv.morphologyEx(src, dst, cv.MORPH_TOPHAT, M);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function blackHat({ msg, payload }) {
  let src = cv.matFromImageData(payload);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(53, 53, cv.CV_8U);

  cv.morphologyEx(src, dst, cv.MORPH_BLACKHAT, M);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function setBrightness({ msg, payload, value }) {
  let src = cv.matFromImageData(payload);
  let hsv = new cv.Mat(src.rows, src.cols, src.type());
  let res = new cv.Mat(src.rows, src.cols, src.type());
  let hsvPlanes = new cv.MatVector();
  brightness = value;
  cv.cvtColor(src, hsv, cv.COLOR_BGR2HSV);
  cv.split(hsv, hsvPlanes);

  for (let x = 0; x < hsv.rows; x++) {
    for (let y = 0; y < hsv.cols; y++) {
      let k = hsv.data[x * hsv.cols * hsv.channels() + y * hsv.channels() + 2];
      if (k + value > 255) {
        hsv.data[x * hsv.cols * hsv.channels() + y * hsv.channels() + 2] = 255;
      } else if (k + value < 0) {
        hsv.data[x * hsv.cols * hsv.channels() + y * hsv.channels() + 2] = 0;
      } else {
        hsv.data[x * hsv.cols * hsv.channels() + y * hsv.channels() + 2] +=
          value;
      }
    }
  }

  cv.cvtColor(hsv, res, cv.COLOR_HSV2BGR);

  postMessage({ msg, payload: imageDataFromMat(res) });
}

function setContrast({ msg, payload, value }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat(src.rows, src.cols, src.type());

  let a = 2 * [(value + 100) / 200];

  let src2 = new cv.Mat();
  src.copyTo(src2);
  cv.addWeighted(src, parseFloat(a), src2, 0, _brightness, dst);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

function cannyEdge({ msg, payload, value }) {
  let src = cv.matFromImageData(payload);
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
  cv.Canny(src, dst, 50, 100, 3, false);

  postMessage({ msg, payload: imageDataFromMat(dst) });
}

/**
 * This function is to convert again from cv.Mat to ImageData
 */
function imageDataFromMat(mat) {
  // convert the mat type to cv.CV_8U
  const img = new cv.Mat();
  const depth = mat.type() % 8;
  const scale =
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
  mat.convertTo(img, cv.CV_8U, scale, shift);

  // convert the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error(
        "Bad number of channels (Source image must have 1, 3 or 4 channels)"
      );
  }
  const clampedArray = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );
  img.delete();
  return clampedArray;
}

function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
  if (cv.Mat) callbackFn(true);

  let timeSpentMs = 0;
  const interval = setInterval(() => {
    const limitReached = timeSpentMs > waitTimeMs;
    if (cv.Mat || limitReached) {
      clearInterval(interval);
      return callbackFn(!limitReached);
    } else {
      timeSpentMs += stepTimeMs;
    }
  }, stepTimeMs);
}

self.onmessage = (e) => {
  switch (e.data.msg) {
    case "load": {
      importScripts("https://docs.opencv.org/3.4.0/opencv.js");
      waitForOpencv(function (success) {
        if (success) postMessage({ msg: e.data.msg });
        else throw new Error("Error on loading OpenCV!");
      });
      break;
    }
    case "grayscale": {
      return imageGrayscale(e.data);
    }
    case "resize": {
      return resize(e.data);
    }
    case "gaussianBlur": {
      return gaussianBlurring(e.data, e.data.value);
    }
    case "medianBlur": {
      return medianBlur(e.data);
    }
    case "bilateralFiltering": {
      return bilateralFiltering(e.data);
    }
    case "canny": {
      return canny(e.data);
    }
    case "calculateHistogram": {
      return calculateHistogram(e.data, e.data.value);
    }
    case "equalizeHistogram": {
      return equalizeHistogram(e.data);
    }
    case "clahe": {
      return clahe(e.data);
    }
    case "simpleThreshold": {
      return simpleThreshold(e.data);
    }
    case "adaptiveThreshold": {
      return adaptiveThreshold(e.data);
    }
    case "erosion": {
      return erosion(e.data);
    }
    case "dilation": {
      return dilation(e.data);
    }
    case "opening": {
      return opening(e.data);
    }
    case "closing": {
      return closing(e.data);
    }
    case "morphGradient": {
      return morphGradient(e.data);
    }
    case "topHat": {
      return topHat(e.data);
    }
    case "blackHat": {
      return blackHat(e.data);
    }
    case "setBrightness": {
      return setBrightness(e.data);
    }
    case "setContrast": {
      return setContrast(e.data);
    }
    case "cannyEdge": {
      return cannyEdge(e.data);
    }
    default:
      break;
  }
};
