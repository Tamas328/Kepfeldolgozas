import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Canvas from "./components/Canvas";

const Home: NextPage = () => {
  const [imageUrl, setImageUrl] = useState<string>();

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
        <Canvas imgSrc={imageUrl} />
      </main>
    </div>
  );
};

export default Home;
