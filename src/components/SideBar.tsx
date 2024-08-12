import DataCard from "./DataCard";
const SideBar = () => {
  return (
    <div className="fixed top-0 h-screen w-[355px] z-50 p-4 bg-gray-800 bg-opacity-75 text-white shadow-lg right-0">
      <DataCard />
      <DataCard />
    </div>
  );
};

export default SideBar;
