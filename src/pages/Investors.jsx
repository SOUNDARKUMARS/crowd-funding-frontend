import React from "react";
import { HeroHighlight, Highlight } from "../components/ui/hero-highlight";
import { DashboardCard } from "../components";
import {
  FiBarChart2,
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

function Investors() {
  return (
    <div>
      <HeroHighlight
        customContent={
          <div className="relative z-20 text-center flex flex-col items-center justify-around  h-full">
            <h1
              style={{ lineHeight: "60px" }}
              className="select-none text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-8 md:mb-6"
            >
              Dealflow, Simplified. <br /> <Highlight>Invest</Highlight> in
              Tomorrow’s Unicorns <Highlight>Today.</Highlight>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto  px-4">
              Explore a curated list of high-potential startups. Make informed,
              data-driven investments and access swift, secure, and significant
              opportunities on our elite platform.
            </p>
          </div>
        }
      />
      <br />
      <div className="p-4">
        <p className="text-xl font-semibold mb-2">Settings</p>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Investments"
            value="₹10,00,000"
            subtitle="Track your total portfolio in real time"
            Icon={FiTrendingUp}
          />

          <DashboardCard
            title="ROI Percentage"
            value="25%"
            subtitle="Monitor your profits and performance"
            Icon={FiBarChart2}
          />

          <DashboardCard
            title="Active Campaigns"
            value="5 Ongoing"
            subtitle="View and manage your ongoing investments"
            Icon={FiBriefcase}
          />

          <DashboardCard
            title="Earnings"
            value="₹2,50,000"
            subtitle="Track your total earnings and withdrawals"
            Icon={FiDollarSign}
          />
        </div>
      </div>
    </div>
  );
}

export default Investors;

const ExampleContent = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl text-white font-bold md:col-span-4">
      Additional content explaining the above card here
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-white md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
        blanditiis soluta eius quam modi aliquam quaerat odit deleniti minima
        maiores voluptate est ut saepe accusantium maxime doloremque nulla
        consectetur possimus.
      </p>
      <p className="mb-8 text-xl text-white md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        reiciendis blanditiis aliquam aut fugit sint.
      </p>
      <button className="w-full rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit">
        Learn more {">"}
      </button>
    </div>
  </div>
);
