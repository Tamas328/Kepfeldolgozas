import React, { useState, useEffect, useRef, useCallback } from "react";
import cv from "../../services/cv";

const Canvas = ({ imgSrc, message }: { imgSrc: string; message: string }) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [canvasHeight, setCanvasHeight] = useState<number>();
  const [canvasWidth, setCanvasWidth] = useState<number>();
  const [processedImage, setProcessedImage] = useState<ImageData>();
  const [loaded, setLoaded] = useState(false);

  const canvas = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      setImage(img);
      setCanvasHeight(img.height);
      setCanvasWidth(img.width);
    };
  }, [imgSrc]);

  useEffect(() => {
    if (image && canvas && canvas.current) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      ctx!.drawImage(image, 0, 0, canvasWidth!, canvasHeight!);
    }
  }, [image, canvas, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (message) {
      const loadOpenCV = async () => {
        await cv.load();
        setLoaded(true);
      };

      loadOpenCV();
    }
  }, [message]);

  useEffect(() => {
    if (image && canvas && canvas.current && loaded && message) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      const img = ctx?.getImageData(0, 0, canvasWidth!, canvasHeight!);

      (async () => {
        const res = await cv.processImage(message, img);
        setProcessedImage(res.data.payload);
      })();
    }
  }, [canvasHeight, canvasWidth, image, loaded, message]);

  useEffect(() => {
    if (canvas && canvas.current && processedImage) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      ctx?.putImageData(processedImage, 0, 0);
    }
  }, [processedImage, canvasHeight, canvasWidth, canvas]);

  return <canvas ref={canvas} width={canvasWidth} height={canvasHeight} />;
};

export default Canvas;
