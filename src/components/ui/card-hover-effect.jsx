import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FundCard from "../FundCard";
import { userIcon } from "../../assets";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@heroui/react";
import api from "../../API/api";
import { daysLeft, formatAmount } from "../../utils";

export const HoverEffect = ({ items, className, from }) => {
  const navigate = useNavigate();
  const { onOpenChange } = useDisclosure();
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [showDeleteModal, setshowDeleteModal] = useState(false);
  let [selectedCamp, setSelectedCamp] = useState();

  const deleteCampaign = async () => {
    try {
      const res = await api.get(`/delete-campaign/${selectedCamp}`);
      if (res.status === 200) {
        showDeleteModal(false);
      }
    } catch (error) {
      console.log("Failed to delete campaign", error);
    }
  };
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 cursor-pointer lg:grid-cols-4  py-10",
        className
      )}
    >
      {items.length === 0 && (
        <div className="col-span-full flex justify-center items-center h-full">
          <p className="text-white font-epilogue font-semibold text-[16px] text-left leading-[26px] truncate">
            No campaign found
          </p>
        </div>
      )}
      {items.map((item, idx) => (
        <div>
          <div
            onClick={() =>
              navigate(`/campaign-details/${item.id}`, { state: { item } })
            }
            key={item?.link}
            className="relative group  block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-slate-700 dark:bg-slate-800/[0.8] block  rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <div className="absolute top-2 right-2">
                <p className=" px-1 rounded-md text-sm font-mono bg-white/50 backdrop-blur-md text-black  shadow-md border border-white/20">
                  {item?.start_date &&
                    (() => {
                      const startDate = new Date(item.start_date);
                      const today = new Date();
                      const tomorrow = new Date();
                      tomorrow.setDate(today.getDate() + 1);

                      // Reset time portions for accurate date comparison
                      startDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);
                      tomorrow.setHours(0, 0, 0, 0);

                      if (startDate < today) {
                        return "";
                      } else if (startDate.getTime() === today.getTime()) {
                        return "from Today";
                      } else if (startDate.getTime() === tomorrow.getTime()) {
                        return "from Tomorrow";
                      } else {
                        return (
                          "from " +
                          startDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          })
                        );
                      }
                    })()}
                </p>
              </div>

              <div className="bg-gray-500  rounded-lg min-h-[150px] w-full">
                <img
                  src={item.img_url}
                  alt={item.title}
                  className="w-full h-[158px] object-cover rounded-lg"
                />
              </div>
              {/* <p className="text-slate-400 text-sm">{item?.category_name}</p> */}
              <div className="block mt-2">
                <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
                  {item?.title}{" "}
                  <span className="text-[#808191] font-thin text-sm">
                    - {item?.category_name}
                  </span>
                </h3>
                <p
                  style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // Internet Explorer/Edge
                  }}
                  className="mt-[5px] overflow-scroll font-epilogue font-normal text-[#808191] max-h-[50px] text-left leading-[18px] "
                >
                  {item?.description}
                </p>
              </div>
              <div className="flex  items-center justify-between flex-wrap mt-[15px] gap-2">
                <div className="flex items-center   gap-[12px]">
                  <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
                    <img
                      src={item?.creator_img || userIcon}
                      alt="user"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
                    by{" "}
                    <span className="text-[#b2b3bd]">{item?.creator_name}</span>
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                    {daysLeft(item?.deadline)}{" "}
                    <span className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                      {" "}
                      Days Left
                    </span>
                  </h4>
                </div>
              </div>

              <Progress
                className="mt-2"
                classNames={{
                  base: "max-w-md",
                  track: "drop-shadow-md  bg-slate-800",
                  indicator: "bg-gradient-to-r from-green-200 to-emerald-700",
                  label: "tracking-wider text-slate-300 font-medium ",
                  value: "text-slate-300 font-bold",
                }}
                label={`${formatAmount(
                  item?.collected_amount
                )} / ${formatAmount(item?.goal_amount)}`}
                radius="sm"
                showValueLabel={true}
                size="sm"
                value={
                  item?.collected_amount && item?.goal_amount
                    ? (item?.collected_amount / item?.goal_amount) * 100
                    : 0
                }
              />
              {from === "profile" && (
                <div className="flex z-50 gap-2 justify-end">
                  <Button
                    onPress={() => {
                      setshowDeleteModal(true);
                      setSelectedCamp(item?.id);
                    }}
                    isIconOnly
                    color="danger"
                    variant="bordered"
                  >
                    Del
                  </Button>
                  <Button
                    onPress={() =>
                      navigate(`/create-campaign`, {
                        state: { from: "profile_edit", item: item },
                      })
                    }
                    isIconOnly
                    variant="bordered"
                    className="text-[#5f7aaf]"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      ))}

      <Modal
        className="dark"
        isOpen={showDeleteModal}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex text-white flex-col gap-1">
                Delete Campaign
              </ModalHeader>
              <ModalBody>
                <p className="text-white">
                  Are you sure you want to delete this campaign? <br /> This
                  action cannot be undon.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => setshowDeleteModal(false)}
                >
                  Close
                </Button>
                <Button color="danger" onPress={() => deleteCampaign()}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-2 overflow-hidden bg-[#1c1c24] border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-10">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
