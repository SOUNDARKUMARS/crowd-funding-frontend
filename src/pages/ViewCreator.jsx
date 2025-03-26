import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HoverEffect } from "../components/ui/card-hover-effect";
import api from "../API/api";
import Loader from "../components/Loader";

function ViewCreator() {
  const state = useLocation();
  const { campaign, user_id } = state.state;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/get-campaigns?user_id=${user_id}`);
      setCampaigns(response?.data?.campaigns);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserCampaigns();
  }, []);
  return (
    <div>
      <p className="text-white text-2xl font-bold">{`${campaign?.creator_name}'s Campaigns`}</p>
      {loading ? (
        <Loader text="Loading campaigns..." />
      ) : (
        <HoverEffect items={campaigns} />
      )}
    </div>
  );
}

export default ViewCreator;
