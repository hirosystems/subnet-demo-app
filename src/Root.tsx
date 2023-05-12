import { useEffect, useState } from "react";
import { UserData } from "@stacks/connect";

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { Subnet } from "./pages/subnet/Subnet";
import { Withdraw } from "./pages/subnet/Withdraw";
import { Deposit } from "./pages/subnet/Deposit";
import { Home } from "./pages/Home";
import { NFTPage, NFTLoader } from "./pages/NFTPage";
import { MyNFTs } from "./pages/my-nfts/MyNFTs";
import { AllMyNFTs } from "./pages/my-nfts/All";
import { MyNFTsL1 } from "./pages/my-nfts/L1";
import { MyNFTsL2 } from "./pages/my-nfts/L2";
import { Error } from "./pages/Error";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { userSession } from "./stacks/auth";
import { Splash } from "./components/Splash";

export async function loader() {
  try {
    const userData = userSession.loadUserData();
    return userData;
  } catch {
    return null;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        loader,
        element: <Home />,
      },
      {
        path: "/subnet-settings",
        element: <Subnet />,
        loader,
        errorElement: <Error />,
        children: [
          {
            path: "",
            element: <Navigate to="deposit" />,
          },
          {
            path: "deposit",
            element: <Deposit />,
            loader,
          },
          {
            path: "withdraw",
            element: <Withdraw />,
            loader,
          },
        ],
      },
      {
        path: "/my-nfts",
        element: <MyNFTs />,
        errorElement: <Error />,
        children: [
          {
            path: "",
            loader,
            element: <AllMyNFTs />,
          },
          {
            path: "l1",
            loader,
            element: <MyNFTsL1 />,
          },
          {
            path: "l2",
            loader,
            element: <MyNFTsL2 />,
          },
        ],
      },
      {
        path: "/nft/:nftId",
        element: <NFTPage />,
        loader: NFTLoader,
        errorElement: <Error />,
      },
    ],
  },
]);

export function Container() {
  return <RouterProvider router={router} />;
}

export function Root() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setIsLoggedIn(true);
      setUserData(userSession.loadUserData());
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="m-auto flex w-full max-w-5xl grow flex-col">
        {isLoggedIn && userData ? (
          <>
            <Header {...{ isLoggedIn, userData }} />
            <main className="rounded-md bg-hiro-neutral-0 p-6 pb-10">
              <Outlet />
            </main>
          </>
        ) : (
          <Splash />
        )}
      </div>
      <Footer />
    </div>
  );
}
