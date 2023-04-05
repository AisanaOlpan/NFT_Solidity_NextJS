import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Contract, providers, ethers } from "ethers";
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ADDRESS, abi } from "../../constants/index";
import MetamaskIcon from "../../components/Icons/MetamaskIcon";
import CardNFT from "../../components/Cards/CardNFT";
import Loading from "../../components/Loading/Loading";
import Coin from "../../components/Icons/Coin";

import classes from "../styles/MainPage.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [nfts, setNfts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [maxLimit, setMaxLimit] = useState(0);
  const web3ModalRef = useRef();

  const [myArray, setArrNFT] = useState([]);
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 97) {
      window.alert("Change network");
      //TODO metmask переключился на 97
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();

      return signer;
    }
    return web3Provider;
  };

  const safeMint = async () => {
    setIsLoading(true);
    try {
      const signer = await getProviderOrSigner(true);

      console.log(signer);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const valLimit = Number(await nftContract.getMaxLimit());
      console.log("ststst");
      console.log(valLimit);
      if (nfts > valLimit) {
        return console.error("you buy all NFT");
      }
      const tx = await nftContract.safeMint(signer.getAddress(), {
        value: ethers.utils.parseEther("0.00001"),
      });
      console.log("safeMint wait");
      const txReceipt = await tx.wait(2);
      console.log("safeMint finsh");
      await getNFTs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNFTs = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();

      const nftBalance = Number(await nftContract.balanceOf(address));

      const arrNFT = await nftContract.getListNFT(address);

      if (nftBalance) {
        setNfts(nftBalance);
        if (myArray.length == 0) {
          for (let i = 0; i < arrNFT.length; i++) {
            myArray.push(i);
            setArrNFT(i);
            readJson(myArray[i]);
          }
        } else if (typeof myArray == typeof 0) {
          readJson(myArray + 1);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      return (
        <div className={classes.divBtn}>
          <div className={classes.divElement}>
            <button className={styles.button} onClick={safeMint}>
              Mint NFT in BNB test
              <div className={classes.load_div}>
                {isLoading ? <Loading /> : <Coin />}
              </div>
            </button>
          </div>

          {/* <div className={classes.divElement}> {isLoading && <Loading />}</div> */}
        </div>
      );
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      );
    }
  };

  const readJson = (num) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://ipfs.filebase.io/ipfs/QmWtBBvaBtgPBMPaM6pHaxAsc6duDVxqLe9tByAsUgzEFU/" +
        num +
        ".json",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        const imgSrc =
          "https://ipfs.filebase.io/" + data.image.replace("ipfs://", "ipfs/");

        const nft = <CardNFT img_src={imgSrc} name={data.name} />;
        const nftContainer = document.createElement("div");
        nftContainer.className = classes.card_nft;
        document.getElementById("NFT_list").appendChild(nftContainer);
        ReactDOM.render(nft, nftContainer);
      }
    };

    xhr.send();
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 97,
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getNFTs();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div className={classes.btnWallet}>
            <MetamaskIcon functionWallet={connectWallet} />
            <p>{!walletConnected ? "Connect Wallet" : "disconnect"} </p>
          </div>
        </div>

        <div className={classes.nftList} id="NFT_list"></div>

        <div className={classes.blockMint}>
          <br />
          {renderButton()}

          <br />
          <p>Your number of nfts: {nfts}</p>
        </div>
      </main>
    </div>
  );
}
