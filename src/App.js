import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { Home, CreateCampaign, CampaignDetails, Profile } from "./pages";
import { Sidebar, Navbar } from "./components";
import { MainProvider } from "./context/mainContext";
function App() {
  return (
    <HeroUIProvider>
      <MainProvider>
        <Router>
          <div className="relative sm:p-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
            <div className="sm:flex hidden mr-10 relative">
              <Sidebar />
            </div>

            <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/campaign-details/:id"
                  element={<CampaignDetails />}
                />
              </Routes>
            </div>
          </div>
        </Router>
      </MainProvider>
    </HeroUIProvider>
  );
}

export default App;

// echo "# crowd-funding-frontend" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/SOUNDARKUMARS/crowd-funding-frontend.git
// git push -u origin main
