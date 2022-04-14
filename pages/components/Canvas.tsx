/* eslint-disable react/display-name */
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import cv from "../../services/cv";

type CanvasProps = {
  imgSrc: string;
};

const Canvas = forwardRef((props: CanvasProps, ref) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [canvasHeight, setCanvasHeight] = useState<number>();
  const [canvasWidth, setCanvasWidth] = useState<number>();
  const [processedImage, setProcessedImage] = useState<ImageData>();
  const [loaded, setLoaded] = useState(false);

  const canvas = useRef(null);

  useImperativeHandle(ref, () => ({
    async loadOpenCV() {
      await cv.load();
      setLoaded(true);
      console.log("OpenCV loaded!");
    },
    async processImage(message: string) {
      if (canvas && canvas.current && loaded) {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        const img = ctx?.getImageData(0, 0, canvasWidth!, canvasHeight!);
        const res = await cv.processImage(message, img);
        setProcessedImage(res.data.payload);
        ctx?.putImageData(res.data.payload, 0, 0);
      }
    },
    download() {
      if (canvas && canvas.current) {
        var url = (canvas.current as HTMLCanvasElement).toDataURL("image/png");
        var link = document.createElement("a");
        link.download = "image.png";
        link.href = url;
        link.click();
      }
    },
  }));

  useEffect(() => {
    const img = new Image();
    img.src = props.imgSrc;
    img.onload = () => {
      setImage(img);
      setCanvasHeight(img.height);
      setCanvasWidth(img.width);
    };
  }, [props.imgSrc]);

  useEffect(() => {
    if (image && canvas && canvas.current) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      ctx!.drawImage(image, 0, 0, canvasWidth!, canvasHeight!);
    }
  }, [image, canvas, canvasWidth, canvasHeight]);

  return (
    <canvas
      className="m-auto align-middle"
      ref={canvas}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={(e) => {
        console.log(e);
      }}
    />
  );
});

export default Canvas;
