import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import React from "react";

const NFTDropPage = () => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt=""
            />
          </div>
          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl font-bold text-white">PIGYOYO</h1>
            <h2 className="text-xl text-gray-300">A COLLECTION OF APES</h2>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="col-span-6 p-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{" "}
            <span className="font-extrabold underline decoration-pink-600/50">
              PIGYOYO
            </span>{" "}
            NFT MARKETPLACE
          </h1>
          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold  lg:text-base"
          >
            {address ? "Sign Out" : "Sign In"}
          </button>
        </header>

        <hr className="my-2 border" />
        {address && (
          <p  className="text-center text-rose-400">
            You&apos;re logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 lg:justify-center lg:space-y-0 text-center lg:mt-60">
          <img
            src="https://links.papareact.com/bdy"
            alt=""
            className="w-80 object-cover pb-10 lg:h-40 "
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold ">
            THE PIGYOYO APE CLUB | NFT DROP
          </h1>

          <p className="pt-2 text-xl text-green-500">
            13 / 18 NFT&apos;s claimed
          </p>
        </div>

        {/* mint button */}
        <button className="h-16 w-full bg-gradient-to-br from-yellow-300 to-rose-400 text-white rounded-full mt-10  transition active:scale-90 duration-300 ">
          Mint NFT (0.06 ETH)
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;
