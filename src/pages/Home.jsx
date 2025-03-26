import React, { useEffect, useState } from "react";
import { HoverEffect } from "../components/ui/card-hover-effect";
import api from "../API/api";
import { HeroParallax } from "../components/ui/hero-parallax";
import { HeroHighlight, Highlight } from "../components/ui/hero-highlight";
import { useMainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";
import { LinkPreview } from "../components/ui/link-preview";
import { investor } from "../assets";
import { Input } from "../components/ui/input";
function Home() {
  const navigate = useNavigate();
  const { campaigns, setCampaigns, searchResults, setSearchResults } =
    useMainContext();

  useEffect(() => {
    const getCampaigns = async () => {
      const res = await api.get("/get-campaigns");
      if (res.status === 200) {
        console.log(res);
        setCampaigns(res?.data?.campaigns);
      }
    };

    getCampaigns();
  }, []);

  const products = [
    {
      title: "startup",
      link: "/campaign/1",
      thumbnail:
        "https://img.freepik.com/free-photo/startup-business-progress-strategy-enterprise_53876-127927.jpg?t=st=1742276452~exp=1742280052~hmac=83ed3ba84f4a21d895b84a27823eedda6eac208adcee5bf28641677869e7fb22&w=1060",
    },
    {
      title: "crowd funding",
      link: "/campaign/2",
      thumbnail:
        "https://img.freepik.com/free-photo/market-share-challenge-competitor-excellent-growing_1150-18252.jpg?t=st=1742276452~exp=1742280052~hmac=d18104b9e8ee887b20b8b7c1915f2446ae48f79e08c3a4fa0c4f374fda1daa92&w=1380",
    },
    {
      title: "Monetize",
      link: "/campaign/3",
      thumbnail:
        "https://img.freepik.com/free-vector/woman-examining-banknote-man-counting-coins-illustration_1262-18985.jpg?t=st=1742276962~exp=1742280562~hmac=9076f846aedd9be99432a0ac81b90d6542de6662013904a55f0aadba3c777ec7&w=1380",
    },
    {
      title: "Campaign 4",
      link: "/campaign/4",
      thumbnail:
        "https://img.freepik.com/free-vector/flat-hand-drawn-people-starting-business-project_52683-57827.jpg?t=st=1742276452~exp=1742280052~hmac=3737426bebf5780f9ce1225d287686113bc849ef394d13541d8f4fa238a44a80&w=1380",
    },
    {
      title: "startup",
      link: "/campaign/1",
      thumbnail:
        "https://img.freepik.com/free-photo/startup-business-progress-strategy-enterprise_53876-127927.jpg?t=st=1742276452~exp=1742280052~hmac=83ed3ba84f4a21d895b84a27823eedda6eac208adcee5bf28641677869e7fb22&w=1060",
    },
    {
      title: "crowd funding",
      link: "/campaign/2",
      thumbnail:
        "https://img.freepik.com/free-photo/market-share-challenge-competitor-excellent-growing_1150-18252.jpg?t=st=1742276452~exp=1742280052~hmac=d18104b9e8ee887b20b8b7c1915f2446ae48f79e08c3a4fa0c4f374fda1daa92&w=1380",
    },
    {
      title: "Monetize",
      link: "/campaign/3",
      thumbnail:
        "https://img.freepik.com/free-vector/woman-examining-banknote-man-counting-coins-illustration_1262-18985.jpg?t=st=1742276962~exp=1742280562~hmac=9076f846aedd9be99432a0ac81b90d6542de6662013904a55f0aadba3c777ec7&w=1380",
    },
    {
      title: "Campaign 4",
      link: "/campaign/4",
      thumbnail:
        "https://img.freepik.com/free-vector/flat-hand-drawn-people-starting-business-project_52683-57827.jpg?t=st=1742276452~exp=1742280052~hmac=3737426bebf5780f9ce1225d287686113bc849ef394d13541d8f4fa238a44a80&w=1380",
    },
  ];

  return (
    <div>
      <p
        onClick={() => setSearchResults([])}
        className="cursor-pointer hover:text-slate-400  text-3xl text-left font-bold text-white"
      >
        {searchResults.length > 0 && "Clear Search Results"}
      </p>
      {searchResults && (
        <div style={{ display: searchResults.length > 0 ? "block" : "none" }}>
          {searchResults && <HoverEffect items={searchResults} />}
        </div>
      )}

      {/* <LabelInputContainer> */}
      {/* <Label htmlFor="firstname">First name</Label> */}
      {/* <Input id="firstname" placeholder="Tyler" type="text" /> */}
      {/* </LabelInputContainer> */}

      <HeroHighlight
        customContent={
          <div className="relative z-20 text-center flex flex-col items-center justify-around  h-full">
            <h1
              style={{ lineHeight: "60px" }}
              className="select-none text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6"
            >
              <span
                className="cursor-pointer"
                onClick={() => navigate("/investors")}
              >
                {" "}
                <Highlight>
                  <LinkPreview url="/investors" src={investor}>
                    Connecting Investors
                  </LinkPreview>
                </Highlight>
              </span>{" "}
              & Empowering Growth.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Our platform empowers innovators and connects investors,
              accelerating global growth. Launch your campaign or fund the next
              big idea with a seamless, fast, and worldwide investment process.
            </p>
          </div>
        }
      />

      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 shadow-xl rounded-2xl p-6 hover:bg-gray-700 transition duration-300">
              <h3 className="text-4xl font-bold text-white">Innovate</h3>
              <p className="text-gray-300 mt-2">
                Driving innovation through technology
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-700 to-gray-800 shadow-xl rounded-2xl p-6 hover:bg-gray-700 transition duration-300">
              <h3 className="text-4xl font-bold text-white">Connect</h3>
              <p className="text-gray-300 mt-2">
                Connecting startups with investors
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-700 to-gray-800 shadow-xl rounded-2xl p-6 hover:bg-gray-700 transition duration-300">
              <h3 className="text-4xl font-bold text-white">Grow</h3>
              <p className="text-gray-300 mt-2">
                Empowering growth across the globe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <HeroParallax products={products} /> */}
      <p className="font-epilogue text-3xl mt-14 mb-2 text-left font-bold text-white">
        Explore the campagins
      </p>

      <div className="">{campaigns && <HoverEffect items={campaigns} />}</div>
    </div>
  );
}

export default Home;

// const LabelInputContainer = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div className={cn("flex w-full flex-col space-y-2", className)}>
//       {children}
//     </div>
//   );
// };
