import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import Canvas from "./components/Canvas";
import { BsImage } from "react-icons/bs";
import { BiChevronRight } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import Histogram from "./components/Histogram";

const Home: NextPage = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [imagesList, setImagesList] = useState<File[]>();
  const [quality, setQuality] = useState<number>(100);
  const [imageName, setImageName] = useState<string>();
  const [exportFormat, setExportFormat] = useState<string>("png");
  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const [resizeWidth, setResizeWidth] = useState<number>();
  const [resizeHeight, setResizeHeight] = useState<number>();
  const [uploadActive, setUploadActive] = useState<string>("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exportImageModal, setExportImageModal] = useState(false);

  const [open, setOpen] = useState(true);
  const [channel, setChannel] = useState("3");
  const [gaussSlider, setGaussSlider] = useState("1");
  const [medianBlur, setMedianBlur] = useState("1");
  const [brightness, setBrightness] = useState("0");
  const [contrast, setContrast] = useState("0");
  const [openedMenu, setOpenedMenu] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [histogramOpen, setHistogramOpen] = useState(false);

  const Menus = [
    {
      title: "Image",
      submenu: true,
      submenuItems: [
        { title: "Load Original", action: "loadOriginal", slider: false },
        { title: "Resize", action: "resize", slider: false },
        { title: "Export", action: "export", slider: false },
      ],
    },
    {
      title: "Color conversion",
      submenu: true,
      submenuItems: [{ title: "Grayscale", action: "grayscale" }],
    },
    {
      title: "Adjustments",
      submenu: true,
      submenuItems: [
        { title: "Brightness", action: "setBrightness", slider: true },
        { title: "Contrast", action: "setContrast", slider: true },
        { title: "Gamma", action: "setGamma" },
        { title: "Saturation", action: "setSaturation" },
      ],
    },
    {
      title: "Blur filters",
      submenu: true,
      submenuItems: [
        { title: "Gaussian Blur", action: "gaussianBlur", slider: true },
        { title: "Median Blur", action: "medianBlur", slider: true },
        { title: "Bilateral Filtering", action: "bilateralFiltering" },
      ],
    },
    {
      title: "Histogram",
      submenu: true,
      submenuItems: [
        { title: "Show Histogram", action: "showHistogram" },
        { title: "Equalize Histogram", action: "equalizeHistogram" },
        { title: "Clahe", action: "clahe" },
      ],
    },
    {
      title: "Threshold",
      submenu: true,
      submenuItems: [
        { title: "Simple Thresholding", action: "simpleThreshold" },
        { title: "Adaptive Thresholding", action: "adaptiveThreshold" },
      ],
    },
    {
      title: "Morphological transformations",
      submenu: true,
      submenuItems: [
        { title: "Erosion", action: "erosion" },
        { title: "Dilation", action: "dilation" },
        { title: "Opening", action: "opening" },
        { title: "Closing", action: "closing" },
        { title: "Morphological Gradient", action: "morphGradient" },
        { title: "Top Hat", action: "topHat" },
        { title: "Black Hat", action: "blackHat" },
      ],
    },
    {
      title: "Canny edge detection",
      submenu: false,
      submenuItems: [],
      action: "cannyEdge",
    },
  ];

  const sliderValue = (name: string) => {
    switch (name) {
      case "Gaussian Blur": {
        return gaussSlider;
      }
      case "Median Blur": {
        return medianBlur;
      }
      case "Brightness": {
        return brightness;
      }
      case "Contrast": {
        return contrast;
      }
    }
  };

  const renderSlider = (name: string) => {
    switch (name) {
      case "Gaussian Blur": {
        return (
          <input
            type="range"
            min="1"
            max="99"
            className="h-1 bg-gray-200 w-full appearance-none cursor-pointer range-sm dark:bg-gray-700"
            value={gaussSlider}
            step={2}
            onMouseUp={async () => {
              await canvasRef.current.processImage(
                "gaussianBlur",
                parseInt(gaussSlider)
              );
            }}
            onInput={(e) => {
              setGaussSlider(e.currentTarget.value);
            }}
          />
        );
      }
      case "Median Blur": {
        return (
          <input
            type="range"
            min="1"
            max="99"
            className="h-1 bg-gray-200 w-full appearance-none cursor-pointer range-sm dark:bg-gray-700"
            value={medianBlur}
            step={2}
            onMouseUp={async () => {
              await canvasRef.current.processImage(
                "medianBlur",
                parseInt(medianBlur)
              );
            }}
            onInput={(e) => {
              setMedianBlur(e.currentTarget.value);
            }}
          />
        );
      }
      case "Brightness": {
        return (
          <input
            type="range"
            min="-100"
            max="100"
            className="h-1 bg-gray-200 w-full appearance-none cursor-pointer range-sm dark:bg-gray-700"
            value={brightness}
            onMouseUp={async () => {
              await canvasRef.current.processImage(
                "setBrightness",
                parseInt(brightness)
              );
              await canvasRef.current.processImage(
                "setContrast",
                parseInt(contrast)
              );
            }}
            onInput={(e) => {
              setBrightness(e.currentTarget.value);
            }}
          />
        );
      }
      case "Contrast": {
        return (
          <input
            type="range"
            min="-100"
            max="100"
            className="h-1 bg-gray-200 w-full appearance-none cursor-pointer range-sm dark:bg-gray-700"
            value={contrast}
            onMouseUp={async () => {
              await canvasRef.current.processImage(
                "setBrightness",
                parseInt(brightness)
              );
              await canvasRef.current.processImage(
                "setContrast",
                parseInt(contrast)
              );
            }}
            onInput={(e) => {
              setContrast(e.currentTarget.value);
            }}
          />
        );
      }
    }
  };

  const canvasRef = useRef<any>(null);
  const histogramCanvasRef = useRef<any>(null);

  return (
    <>
      <div className="flex">
        <Head>
          <title>Képfeldolgozás Web</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
          className={`bg-sidebar ${
            imageUploaded ? "" : "hidden"
          } h-screen overflow-y-auto overflow-x-hidden scrollbar ${
            open ? "w-84" : "w-20"
          } duration-300 relative`}
        >
          <ul className="pt-2 mx-4">
            {Menus.map((menu, index) => (
              <>
                <li
                  key={index}
                  className="text-white flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white mt-2"
                  onClick={() => {
                    setOpenedMenu((prevState) =>
                      prevState.map((item, idx) =>
                        idx === index ? !item : item
                      )
                    );
                  }}
                >
                  <span
                    className="text-base font-base flex-1"
                    onClick={async () => {
                      if (!menu.submenu)
                        await canvasRef.current.processImage(menu.action);
                    }}
                  >
                    {menu.title}
                  </span>

                  {menu.submenu && (
                    <span className="text-2xl block float-right">
                      <BiChevronRight
                        className={`${openedMenu[index] && "rotate-90"}`}
                      />
                    </span>
                  )}
                </li>
                {menu.submenu && openedMenu[index] && (
                  <ul className="border-l-[3px] ml-4 border-border-color">
                    {menu.submenuItems.map((submenuItem, index) => (
                      <>
                        <li
                          key={index}
                          className="text-white text-sm flex items-center justify-between gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white mt-2"
                          onClick={async () => {
                            if (
                              submenuItem.action == "showHistogram" &&
                              histogramCanvasRef.current
                            ) {
                              setHistogramOpen(!histogramOpen);
                              setChannel("3");
                              await histogramCanvasRef.current.showHistogram(
                                parseInt(channel)
                              );
                            } else if (submenuItem.action == "resize") {
                              setResizeWidth(imageWidth);
                              setResizeHeight(imageHeight);
                              setShowModal(!showModal);
                            } else if (submenuItem.action == "export") {
                              setExportImageModal(!exportImageModal);
                            } else {
                              setImageWidth(resizeWidth);
                              setImageHeight(resizeHeight);
                              await canvasRef.current.processImage(
                                submenuItem.action
                              );
                            }
                          }}
                        >
                          {submenuItem.title}
                          {submenuItem.slider && (
                            <div className="px-2 text-sm font-medium text-gray-900 text-white">
                              {sliderValue(submenuItem.title)}
                            </div>
                          )}
                        </li>
                        {submenuItem.slider && (
                          <div className="flex flex-row rounded-md gap-x-2 items-center p-2 px-5">
                            {renderSlider(submenuItem.title)}
                          </div>
                        )}
                      </>
                    ))}
                  </ul>
                )}
              </>
            ))}
          </ul>
        </div>
        <div className="flex h-screen w-full">
          {!imageUploaded && (
            <div className="drop-container h-max m-auto">
              <div
                className={`drop ${uploadActive}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setUploadActive("active");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setUploadActive("");
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  var fileList = [];
                  if (e.dataTransfer.files.length) {
                    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
                      fileList.push(e.dataTransfer.files[i]);
                    }

                    setImagesList(fileList);

                    setImageName(e.dataTransfer.files[0].name);
                    setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]));
                    setImageUploaded(true);
                    const img = new Image();
                    img.onload = () => {
                      setImageHeight(img.height);
                      setImageWidth(img.width);
                    };
                    img.src = URL.createObjectURL(e.dataTransfer.files[0]);
                    await canvasRef.current.loadOpenCV();
                  }
                }}
              >
                <BsImage className="icon" size="48px" />
                <span className="text">Drag and drop your photos here.</span>
                <div className="or-con">
                  <span className="line"></span>
                  <span className="or">OR</span>
                  <span className="line"></span>
                </div>
                <label htmlFor="image-upload">Browse Files</label>
                <input
                  type="file"
                  multiple
                  id="image-upload"
                  className="file-input"
                  onChange={async (e) => {
                    var fileList = [];
                    if (e.target.files?.length) {
                      for (var i = 0; i < e.target.files.length; ++i) {
                        fileList.push(e.target.files[i]);
                      }

                      setImagesList(fileList);

                      setImageName(e.target.files[0].name);
                      setImageUrl(URL.createObjectURL(e.target.files[0]));
                      setImageUploaded(true);
                      const img = new Image();
                      img.onload = () => {
                        setImageHeight(img.height);
                        setImageWidth(img.width);
                      };
                      img.src = URL.createObjectURL(e.target.files[0]);
                      await canvasRef.current.loadOpenCV();
                    }
                  }}
                />
              </div>
              <div className="progress" />
            </div>
          )}
          <div className={`${imageUploaded ? "" : "hidden"} w-full`}>
            <div className={` relative w-full flex flex-wrap bg-sidebar`}>
              <ul className="navbar-nav flex flex-row pl-0 list-style-none mr-auto">
                {imagesList?.map((image, index) => (
                  <li
                    key={index}
                    className={`${
                      imagesList[index].name == imageName
                        ? "bg-nav-active text-white"
                        : "text-gray"
                    } nav-item flex flex-row items-center justify-between gap-x-4 text-sm p-2 cursor-pointer hover:bg-nav-active hover:text-white ease-linear transition-all duration-150`}
                    onClick={() => {
                      setImageName(image.name);
                      setImageUrl(URL.createObjectURL(imagesList[index]));

                      const img = new Image();
                      img.onload = () => {
                        setImageHeight(img.height);
                        setImageWidth(img.width);
                      };
                      img.src = URL.createObjectURL(imagesList[index]);
                    }}
                  >
                    <p>{image.name}</p>
                    <IoCloseOutline
                      className="text-lg"
                      onClick={() => {
                        setImagesList(
                          imagesList.filter(
                            (img) => img.name !== imagesList[index].name
                          )
                        );
                        console.log(index);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex h-full">
              <Canvas ref={canvasRef} imgSrc={imageUrl!} />
            </div>
          </div>
          <div
            className={`${
              imageUploaded ? "" : "hidden"
            } fixed bottom-0 bg-gray opacity-80 text-white text-xs px-10 py-[2px]`}
          >
            {imageWidth} x {imageHeight} px
          </div>
          <div className={`${histogramOpen ? "" : "hidden"}`}>
            <div className="absolute top-4 right-4">
              <div className="flex p-2 text-md border-r border-t border-l rounded-t-lg bg-menu-header justify-between items-center">
                <p className="text-white text-2sm cursor-default">Histogram</p>
                <IoCloseOutline
                  className="text-xl cursor-pointer text-white"
                  onClick={() => {
                    setHistogramOpen(!histogramOpen);
                    setChannel("3");
                  }}
                />
              </div>
              <div className="bg-white px-2 py-2 border-x">
                <div className="flex items-center justify-between text-sm">
                  <p className="cursor-default">Channel</p>
                  <select
                    id="channels"
                    value={channel}
                    onChange={async (e) => {
                      setChannel(e.target.value);
                      await histogramCanvasRef.current.showHistogram(
                        parseInt(e.target.value)
                      );
                    }}
                  >
                    <option value={"0"}>Red</option>
                    <option value={"1"}>Green</option>
                    <option value={"2"}>Blue</option>
                    <option value={"3"}>Colors</option>
                  </select>
                </div>
              </div>
              <div className="border">
                <Histogram
                  ref={histogramCanvasRef}
                  imgData={imageUploaded ? canvasRef.current.imageData : null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between items-center px-3 py-3 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold">Resize</h3>
                  <IoCloseOutline
                    className="text-xl cursor-pointer text-black"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  />
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between">
                      <p>Width</p>
                      <input
                        type="number"
                        value={resizeWidth}
                        onChange={(e) =>
                          setResizeWidth(parseInt(e.target.value))
                        }
                        className="bg-slate-200 rounded-md text-center text-md w-2/5"
                      ></input>
                    </div>
                    <div className="flex justify-between">
                      <p>Height</p>
                      <input
                        type="number"
                        value={resizeHeight}
                        onChange={(e) =>
                          setResizeHeight(parseInt(e.target.value))
                        }
                        className="bg-slate-200 rounded-md text-center text-md w-2/5"
                      ></input>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-7 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-7 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={async () => {
                      setShowModal(false);
                      await canvasRef.current.processImage("resize", {
                        resizeWidth,
                        resizeHeight,
                      });
                      setResizeWidth(imageWidth);
                      setResizeHeight(imageHeight);
                      setImageWidth(resizeWidth);
                      setImageHeight(resizeHeight);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            onClick={() => {
              setShowModal(false);
              setResizeWidth(imageWidth);
              setResizeHeight(imageHeight);
            }}
          ></div>
        </>
      ) : null}
      {exportImageModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between items-center px-3 py-3 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold">Export</h3>
                  <IoCloseOutline
                    className="text-xl cursor-pointer text-black"
                    onClick={() => {
                      setExportImageModal(false);
                    }}
                  />
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between">
                      <p>Format</p>
                      <select
                        className="bg-slate-200 rounded-md text-center text-md w-2/5"
                        value={exportFormat}
                        onChange={(e) => {
                          setExportFormat(e.target.value);
                        }}
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                      </select>
                    </div>
                    {exportFormat == "jpg" && (
                      <div className="flex justify-between items-center">
                        <p>Quality</p>
                        <div className="flex flex-col gap-y-2 my-2 rounded-md items-center text-sm w-2/5">
                          <p>{quality}%</p>
                          <input
                            type="range"
                            value={quality}
                            min={1}
                            max={100}
                            onInput={(e) => {
                              setQuality(parseInt(e.currentTarget.value));
                            }}
                            className="h-1 bg-slate-200 appearance-none cursor-pointer w-full"
                          ></input>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p>Width</p>
                      <input
                        disabled
                        type="number"
                        value={imageWidth}
                        className="bg-slate-200 rounded-md text-center text-md w-2/5"
                      ></input>
                    </div>
                    <div className="flex justify-between">
                      <p>Height</p>
                      <input
                        disabled
                        type="number"
                        value={imageHeight}
                        className="bg-slate-200 rounded-md text-center text-md w-2/5"
                      ></input>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-7 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setExportImageModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-7 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={async () => {
                      canvasRef.current.download(
                        imageName?.split(".")[0],
                        exportFormat,
                        quality
                      );
                      setExportImageModal(false);
                    }}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            onClick={() => {
              setExportImageModal(false);
            }}
          ></div>
        </>
      ) : null}
    </>
  );
};

export default Home;
