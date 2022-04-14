import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import Canvas from "./components/Canvas";
import { BsPlusCircleFill } from "react-icons/bs";
import { BiChevronRight, BiChevronDown } from "react-icons/bi";

const Home: NextPage = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [colorConversionOpen, setColorConversionOpen] = useState(false);
  const [blurOpen, setBlurOpen] = useState(false);
  const [histogramOpen, setHistogramOpen] = useState(false);

  const canvasRef = useRef<any>(null);

  return (
    <div className="parent font-sans md:h-screen md:grid md:grid-cols-8">
      <Head>
        <title>Képfeldolgozás Web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="sidebar bg-sidebar md:col-span-1 text-base">
        <ul className="space-y-4 mt-4">
          <li className="flex justify-center">
            <label
              className="flex flex-row content-center text-green"
              htmlFor="image-upload"
            >
              <BsPlusCircleFill
                className="hover:text-dark-green hover:outline-none cursor-pointer"
                size="32px"
              />
            </label>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.length) {
                  setImageUrl(URL.createObjectURL(e.target.files[0]));
                  await canvasRef.current.loadOpenCV();
                }
              }}
            />
          </li>
          <li className="flex flex-row justify-between mx-3 cursor-pointer text-white">
            <p
              onClick={() => {
                setColorConversionOpen(!colorConversionOpen);
              }}
            >
              Color Conversion
            </p>
            {colorConversionOpen ? (
              <BiChevronDown
                size="24px"
                onClick={() => {
                  setColorConversionOpen(!colorConversionOpen);
                }}
              />
            ) : (
              <BiChevronRight
                size="24px"
                onClick={() => {
                  setColorConversionOpen(!colorConversionOpen);
                }}
              />
            )}
          </li>
          {colorConversionOpen && (
            <ul className="py-2 space-y-2">
              <li className="pl-8 w-full text-white">
                <button
                  onClick={async () => {
                    await canvasRef.current.processImage("grayscale");
                  }}
                >
                  Grayscale
                </button>
              </li>
            </ul>
          )}
          <li className="flex flex-row justify-between mx-3 cursor-pointer text-white">
            <p
              onClick={() => {
                setBlurOpen(!blurOpen);
              }}
            >
              Blur filters
            </p>
            {blurOpen ? (
              <BiChevronDown
                size="24px"
                onClick={() => {
                  setBlurOpen(!blurOpen);
                }}
              />
            ) : (
              <BiChevronRight
                size="24px"
                onClick={() => {
                  setBlurOpen(!blurOpen);
                }}
              />
            )}
          </li>
          {blurOpen && (
            <ul className="py-2 space-y-2">
              <li className="pl-8 w-full text-white">
                <button
                  onClick={async () => {
                    await canvasRef.current.processImage("gaussianBlur");
                  }}
                >
                  Gaussian Blur
                </button>
              </li>
              <li className="pl-8 w-full text-white">
                <button
                  onClick={async () => {
                    await canvasRef.current.processImage("medianBlur");
                  }}
                >
                  Median Blur
                </button>
              </li>
            </ul>
          )}
          <li className="flex flex-row justify-between mx-3 cursor-pointer text-white">
            <p
              onClick={() => {
                setHistogramOpen(!histogramOpen);
              }}
            >
              Histogram
            </p>
            {histogramOpen ? (
              <BiChevronDown
                size="24px"
                onClick={() => {
                  setHistogramOpen(!histogramOpen);
                }}
              />
            ) : (
              <BiChevronRight
                size="24px"
                onClick={() => {
                  setHistogramOpen(!histogramOpen);
                }}
              />
            )}
          </li>
          {histogramOpen && (
            <ul className="py-2 space-y-2">
              <li className="pl-8 w-full text-white">
                <button
                  onClick={async () => {
                    await canvasRef.current.processImage("equalizeHistogram");
                  }}
                >
                  Equalize Histogram
                </button>
              </li>
            </ul>
          )}
        </ul>
      </div>
      <main className="main h-full bg-main md:col-span-7">
        <div className="flex h-full justify-center">
          <Canvas ref={canvasRef} imgSrc={imageUrl!} />
        </div>
      </main>

      {/* <div className="flex w-full items-center justify-between gap-4 py-2">
        <input
          type="file"
          onChange={async (e) => {
            if (e.target.files?.length) {
              setImageUrl(URL.createObjectURL(e.target.files[0]));
              await canvasRef.current.loadOpenCV();
            }
          }}
        />
        <button
          onClick={() => {
            canvasRef.current.download();
          }}
        >
          Download
        </button>
        <button
          onClick={async () => {
            await canvasRef.current.processImage("grayscale");
          }}
        >
          Grayscale
        </button>
        <button
          onClick={async () => {
            await canvasRef.current.processImage("gaussianBlur");
          }}
        >
          Gaussian Blur
        </button>
        <button
          onClick={async () => {
            await canvasRef.current.processImage("medianBlur");
          }}
        >
          Median Blur
        </button>
        <button
          onClick={async () => {
            await canvasRef.current.processImage("canny");
          }}
        >
          Canny
        </button>
        <button
          onClick={async () => {
            await canvasRef.current.processImage("equalizeHistogram");
          }}
        >
          Equalize Histogram
        </button>
      </div>
      <div className="flex">
        <Canvas ref={canvasRef} imgSrc={imageUrl!} />
      </div> */}
    </div>
  );
};

export default Home;
