import useAddress from "../hooks/useAddress";
import { SideBarProps } from "../types/location";
import DataCard from "./DataCard";

const SideBar = ({ myLocation, otherLocation, handleRoute }: SideBarProps) => {
  console.log(myLocation);
  console.log(otherLocation);
  const myAddress = useAddress(myLocation?.latitude, myLocation?.longitude);
  const otherAddress = useAddress(
    otherLocation?.latitude,
    otherLocation?.longitude
  );
  return (
    <div className="fixed top-0 h-screen w-[355px] z-50 p-4 bg-gray-800 bg-opacity-75 text-white shadow-lg right-0">
      <DataCard
        isUser={true}
        title="My Details"
        address={myAddress}
        myLocation={myLocation}
        handleRoute={handleRoute}
      />
      <DataCard
        isUser={false}
        title="User Details"
        address={otherAddress}
        otherLocation={otherLocation}
        handleRoute={handleRoute}
      />
    </div>
  );
};

export default SideBar;
