export const DashboardCard = ({ title, subtitle, Icon, value }) => {
  return (
    <div className="w-full cursor-pointer p-4 rounded border-[1px] border-gray-700 relative overflow-hidden group bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-5 opacity-50 -right-5 text-8xl text-gray-300 group-hover:text-green-400 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-green-600 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-gray-300 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-gray-300 text-2xl font-bold z-20">{value}</p>
      <p className="text-gray-500 text-sm group-hover:text-green-200 relative z-10 duration-300 overflow-hidden whitespace-nowrap text-ellipsis">
        {subtitle}
      </p>
    </div>
  );
};
