/* eslint-disable react/display-name */
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import cv from "../../services/cv";

type HistogramProps = {
  imgData: ImageData;
};

const Histogram = forwardRef((props: HistogramProps, ref) => {
  const [canvasHeight, setCanvasHeight] = useState<number>();
  const [canvasWidth, setCanvasWidth] = useState<number>();

  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvasHeight(150);
    setCanvasWidth(300);
  }, [props.imgData]);

  useImperativeHandle(ref, () => ({
    async showHistogram(value: number) {
      if (canvasRef && canvasRef.current && props.imgData) {
        const ctx = (canvasRef.current as HTMLCanvasElement).getContext("2d");
        const res = await cv.processImage(
          "calculateHistogram",
          props.imgData,
          value
        );
        var imgObj = new Image();
        imgObj.onload = () => {
          Promise.all([createImageBitmap(res.data.payload)]).then((x) => {
            ctx?.drawImage(
              x[0],
              0,
              0,
              props.imgData.width,
              props.imgData.height,
              0,
              0,
              canvasWidth!,
              canvasHeight!
            );
          });
        };
        imgObj.src = (canvasRef.current as HTMLCanvasElement).toDataURL();
      }
    },
  }));

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
});

export default Histogram;
