import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [priceInEth, setPriceInEth] = useState("");
  const [loading, setLoading] = useState(true);

  // thirdweb
  const nftDrop = useNFTDrop(collection.address);

  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();
      setLoading(false);
      setClaimedSupply(claimed.length);
      setTotalSupply(total);
    };

    fetchNFTDropData();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) return;

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();

      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
    };

    fetchPrice();
  }, [nftDrop]);

  // helper
  const mintNft = () => {
    if (!nftDrop || !address) return;

    const quantity = 1; //how many unique nft want to claim

    setLoading(true);
    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNFT = await tx[0].data();

        toast("Woah.. You successfully minted", {
          duration: 8000,
          style: {
            background: "white",
            color: "green",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });

        console.log(receipt);
        console.log(claimedTokenId);
        console.log(claimedNFT);
      })
      .catch((err) => {
        console.log(err);
        toast("Whoops... Something went wrong", {
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(notification);
      });
  };

  // Auth
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
      {/* left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt=""
            />
          </div>
          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollection}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="col-span-6 p-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <Link href={`/`}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{" "}
              <span className="font-extrabold underline decoration-pink-600/50">
                PIGYOYO
              </span>{" "}
              NFT MARKETPLACE
            </h1>
          </Link>
          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold  lg:text-base"
          >
            {address ? "Sign Out" : "Sign In"}
          </button>
        </header>

        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-rose-400">
            You&apos;re logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 lg:justify-center lg:space-y-0 text-center lg:mt-60">
          <img
            src={urlFor(collection.mainImage).url()}
            alt=""
            className="w-80 object-cover pb-10 lg:h-40 "
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold ">
            {collection.title}
          </h1>

          {loading ? (
            <p className="pt-2 text-xl text-yellow-500 animate-pulse">
              Loading supply count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT&apos;s claimed
            </p>
          )}
        </div>

        {/* mint button */}
        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="h-16 w-full bg-rose-400 text-white rounded-full mt-10  transition active:scale-90 duration-300 disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign in to mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollection,
    mainImage {
       asset
    },
    circleImage{
      asset
    },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug{
      current
     },
  },
   
}`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};
