import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMainContext } from "../../context/mainContext";
import api from "../../API/api";

export const Tabs = ({ tabs }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories, setCategories, updateCampaigns } = useMainContext();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    handleCategoryChange(selectedCategory?.id);
  }, [selectedCategory]);

  const handleCategoryChange = async (categoryId) => {
    console.log(categoryId);
    try {
      if (!categoryId) {
        // If no category selected, fetch all campaigns
        const res = await api.get("/search-campaigns");
        if (res.status === 200) {
          updateCampaigns(res.data);
        }
      } else {
        // Find category ID from category name
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
          const res = await api.get(
            `/search-campaigns?category_id=${categoryId}`
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
    <div className="inline-block">
      <ul
        onMouseLeave={() => {
          // Keep highlight on selected category when mouse leaves
          if (selectedCategory) {
            const selectedTab = document.getElementById(
              `tab-${selectedCategory.name}`
            );
            if (selectedTab) {
              const { width } = selectedTab.getBoundingClientRect();
              setPosition({
                left: selectedTab.offsetLeft,
                width,
                opacity: 1,
              });
            }
          } else {
            setPosition({ left: 0, width: 0, opacity: 0 });
          }
        }}
        className="relative flex rounded-full border border-gray-700 bg-gray-900 p-0.5 my-2 overflow-x-auto whitespace-nowrap"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={`tab-${tab.name}`}
            tab={tab}
            setPosition={setPosition}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          >
            {tab.name}
          </Tab>
        ))}

        <Cursor position={position} />
      </ul>
    </div>
  );
};

const Tab = ({
  children,
  setPosition,
  selectedCategory,
  setSelectedCategory,
  id,
  tab,
}) => {
  const ref = useRef(null);

  const updatePosition = () => {
    if (!ref?.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });
  };

  return (
    <li
      id={id}
      ref={ref}
      onClick={() => {
        if (selectedCategory?.id === tab.id) {
          // Deselect if clicking the same category
          setSelectedCategory(null);
          setPosition({ left: 0, width: 0, opacity: 0 });
        } else {
          // Select new category
          setSelectedCategory(tab);
          updatePosition();
        }
      }}
      onMouseEnter={() => {
        // Only update position if this is the selected category
        if (selectedCategory?.id === tab.id) {
          updatePosition();
        }
      }}
      className={`relative z-10 block cursor-pointer px-2 py-1 text-xs uppercase whitespace-nowrap
        ${selectedCategory?.id === tab.id ? "text-white" : "text-gray-300"} 
        transition-colors md:px-3 md:py-1.5 md:text-sm`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-6 rounded-full bg-gray-700 md:h-8"
    />
  );
};
