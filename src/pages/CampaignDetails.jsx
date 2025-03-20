import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { calculateBarPercentage, daysLeft, formatAmount } from "../utils";
import { userIcon } from "../assets";
import { CustomBtn } from "../components";
import api from "../API/api";
import CountBox from "../components/CountBox";
import { AnimatedTooltip } from "../components/ui/AnimatedTooltip";
import { ImagesSlider } from "../components/ui/images-slider";

function CampaignDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const campaign = state?.item;

  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoadingMsg("Loading Profile...");
      const res = await api.get("/profile");
      setLoadingMsg("");
      setUser(res?.data);
    } catch (error) {
      setLoadingMsg("");
      console.error("Failed to fetch profile data:", error);
    }
  };

  const handleDonate = async () => {
    try {
      setLoadingMsg("Funding Campaign...");
      const res = await api.put(`/updated-collected-amt/${campaign?.id}`, {
        amt: amount,
        contributor_id: user?.id,
      });
      setLoadingMsg("");
      if (res?.status === 200) {
        navigate("/");
        alert("Amount updated successfully");
      }
      console.log(res);
    } catch (error) {
      setLoadingMsg("");
      console.log("Faild to update collected amount", error);
    }
  };

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await api.get(`/get-contributors/${campaign?.id}`);
        if (res?.status === 200) {
          setDonators(res?.data?.contributors);
        }
      } catch (error) {
        console.log("Faild to fetch contributors", error);
      }
    };
    fetchContributors();
  }, [campaign?.id]);

  return (
    <div>
      {loadingMsg && <Loader title={loadingMsg} />}

      <div className="w-full h-auto  flex flex-col md:flex-row mt-10 gap-[30px]">
        <div className="flex-1 flex flex-col">
          <ImagesSlider
            images={[campaign?.img_url, ...(campaign?.campaign_images || [])]}
            className="w-full h-[300px] md:h-[410px] object-cover rounded-xl"
            style={{
              display: "flex",
              overflowX: "scroll", // Enables horizontal scrolling
              scrollSnapType: "x mandatory", // Smooth sliding effect
            }}
          />

          <div className="relative w-full h-[8px] rounded-full bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full rounded-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(campaign?.goal_amount, 60)}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={daysLeft(campaign?.deadline)} />
          <CountBox
            title={`Raised of ${formatAmount(campaign?.goal_amount)}`}
            value={formatAmount(campaign?.collected_amount)}
          />
          <CountBox title="Total Backers" value={99} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <img
                // onMouseMove={handleMouseMove}
                height={50}
                width={50}
                src={campaign?.creator_img || userIcon}
                alt={campaign?.creator_name}
                className="relative !m-0 h-14 w-14 rounded-full object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 bg-slate-800"
              />
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {campaign?.creator_name}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {campaign?.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Contributors
            </h4>

            {donators?.length > 0 ? (
              <div className="flex flex-row mt-5 mb-10 w-full">
                <AnimatedTooltip items={donators} />
              </div>
            ) : (
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                No donators yet. Be the first one!
              </p>
            )}
            {/* <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item?.contributor_name}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                      {item?.amount}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div> */}
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Fund
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="Rs. 500"
                step="100"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              <CustomBtn
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetails;
