import React, { useState, useEffect, useRef } from "react";

const Canvas = ({ imgSrc }) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [canvasHeight, setCanvasHeight] = useState<number>();
  const [canvasWidth, setCanvasWidth] = useState<number>();

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
      const ctx = canvas.current.getContext("2d");
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    }
  }, [image, canvas, canvasWidth, canvasHeight]);

  return <canvas ref={canvas} width={canvasWidth} height={canvasHeight} />;
};

export default Canvas;
