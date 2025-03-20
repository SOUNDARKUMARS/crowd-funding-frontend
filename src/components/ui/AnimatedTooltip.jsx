import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 50, damping: 15 }; // Reduced stiffness, increased damping
  const x = useMotionValue(0);

  // Reduced rotation range from [-45,45] to [-15,15]
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-15, 15]),
    springConfig
  );

  // Reduced translation range from [-50,50] to [-20,20]
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-20, 20]),
    springConfig
  );

  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="group relative -mr-4"
          key={item?.contributor_name}
          onMouseEnter={() => setHoveredIndex(item?.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item?.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }} // Reduced initial offset
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 150, // Reduced stiffness
                    damping: 20, // Increased damping
                  },
                }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }} // Reduced exit offset
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item?.contributor_name}
                </div>
                <div className="text-xs text-white">
                  {item?.amount?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {item?.contributor_img ? (
            <img
              onMouseMove={handleMouseMove}
              height={100}
              width={100}
              src={item?.contributor_img}
              alt={item?.contributor_name}
              className="relative !m-0 h-14 w-14 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
            />
          ) : (
            <div
              onMouseMove={handleMouseMove}
              className="relative !m-0 h-14 w-14 rounded-full border-2 border-white !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-500"
            >
              <span className="text-2xl font-semibold text-emerald-100">
                {item?.contributor_name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
