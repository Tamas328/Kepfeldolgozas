/* eslint-disable react/display-name */
import { ImageError } from "next/dist/server/image-optimizer";
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
  const [imageSize, setImageSize] = useState<number>();
  const [originalImg, setOriginalImg] = useState<string>();
  const [canvasHeight, setCanvasHeight] = useState<number>();
  const [canvasWidth, setCanvasWidth] = useState<number>();
  const [loaded, setLoaded] = useState(false);

  const canvas = useRef(null);

  useImperativeHandle(ref, () => ({
    async loadOpenCV() {
      await cv.load();
      setLoaded(true);
      console.log("OpenCV loaded!");
    },
    async processImage(message: string, value: any) {
      if (message == "loadOriginal") {
        this.loadOriginalImage();
      }
      if (canvas && canvas.current && loaded) {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        const img = ctx?.getImageData(0, 0, canvasWidth!, canvasHeight!);
        if (message == "resize") {
          setCanvasWidth(value.resizeWidth);
          setCanvasHeight(value.resizeHeight);
        }
        const res = await cv.processImage(message, img, value);
        ctx?.putImageData(res.data.payload, 0, 0);
      }
    },
    loadOriginalImage() {
      const img = new Image();
      img.src = originalImg!;
      img.onload = () => {
        setImage(img);
        setCanvasHeight(img.height);
        setCanvasWidth(img.width);
      };
    },
    get imageData() {
      if (canvas && canvas.current && loaded) {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        const img = ctx?.getImageData(0, 0, canvasWidth!, canvasHeight!);
        return img;
      }
    },
    download(name: string, format: string, quality: number) {
      if (canvas && canvas.current) {
        var url = "";
        switch (format) {
          case "png": {
            var url = (canvas.current as HTMLCanvasElement).toDataURL(
              "image/png"
            );
            break;
          }
          case "jpg": {
            var nq = quality / 100;
            console.log(nq);
            var url = (canvas.current as HTMLCanvasElement).toDataURL(
              "image/jpeg",
              nq
            );
            break;
          }
        }

        var link = document.createElement("a");
        link.download = `${name}.${format}`;
        link.href = url;
        link.click();
      }
    },
  }));

  useEffect(() => {
    setOriginalImg(props.imgSrc);
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
    <>
      <canvas
        className="m-auto align-middle"
        ref={canvas}
        width={canvasWidth}
        height={canvasHeight}
      />
    </>
  );
});

export default Canvas;
