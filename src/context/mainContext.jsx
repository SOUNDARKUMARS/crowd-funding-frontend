import React, { createContext, useState, useContext } from "react";

const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState(null);

  const updateCampaigns = (newCampaigns) => {
    setCampaigns(newCampaigns);
  };

  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <MainContext.Provider
      value={{
        campaigns,
        setCampaigns,
        updateCampaigns,
        searchResults,
        setSearchResults,
        updateSearchResults,
        loading,
        setLoading,
        categories,
        setCategories,
        // selectedCategory,
        // setSelectedCategory,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;
};
