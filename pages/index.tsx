import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Canvas from "./components/Canvas";

const Home: NextPage = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [message, setMessage] = useState<string>();

  return (
    <div className={styles.container}>
      <Head>
        <title>Képfeldolgozás Web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.length) {
              setImageUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        <Canvas imgSrc={imageUrl!} message={message!} />
        <button
          onClick={(e) => {
            setMessage("grayscale");
          }}
        >
          Grayscale
        </button>
        <button
          onClick={(e) => {
            setMessage("gaussianBlur");
          }}
        >
          Gaussian Blur
        </button>
      </main>
    </div>
  );
};

export default Home;
