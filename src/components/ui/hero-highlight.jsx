import { cn } from "../../lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, { useEffect, useState } from "react";
import { Tabs } from "./tabs";
import api from "../../API/api";
import { useMainContext } from "../../context/mainContext";
import { LinkPreview } from "./link-preview";

export const HeroHighlight = ({ customContent }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const { categories, setCategories, selectedCategory, updateCampaigns } =
    useMainContext();

  useEffect(() => {
    getCategories();
  }, []);

  // SVG patterns for different states and themes
  const dotPatterns = {
    default: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23404040' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
    hover: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23c4c5ff' filter='url(%23glow)' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3Cdefs%3E%3Cfilter id='glow'%3E%3CfeGaussianBlur stdDeviation='1' result='blur'/%3E%3CfeFlood flood-color='white' flood-opacity='0.3'/%3E%3CfeComposite in2='blur' operator='in'/%3E%3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E")`,
  };

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const getCategories = async () => {
    const res = await api.get("/get-categories");
    if (res.status === 200) {
      setCategories(res?.data?.categories);
    }
  };

  const handleCategoryChange = async (categoryName) => {
    try {
      if (!categoryName) {
        // If no category selected, fetch all campaigns
        const res = await api.get("/search-campaigns");
        if (res.status === 200) {
          updateCampaigns(res.data);
        }
      } else {
        // Find category ID from category name
        const category = categories.find((cat) => cat.name === categoryName);
        if (category) {
          const res = await api.get(
            `/search-campaigns?category_id=${category.id}`
          );
          if (res.status === 200) {
            updateCampaigns(res.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  return (
    <div
      className="group relative flex-col flex h-[20rem] sm:h-[30rem] lg:h-[22rem] w-full items-center justify-around bg-[#13131a]"
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: dotPatterns.default,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: dotPatterns.hover,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      {customContent}

      {/* <div className="w-full px-4 overflow-x-scroll scrollbar-hide">
        <p className="text-white text-2xl font-bold z-50">Categories</p>
        <Tabs tabs={categories} onCategoryChange={handleCategoryChange} />
      </div> */}
    </div>
  );
};

export const Highlight = ({ children }) => {
  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className="relative inline-block rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-1 pb-1"
    >
      {children}
    </motion.span>
  );
};
