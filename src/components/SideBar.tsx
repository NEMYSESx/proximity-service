import useAddress from "../hooks/useAddress";
import { SideBarProps } from "../types/location";
import DataCard from "./DataCard";

const SideBar = ({ myLocation, otherLocation, handleRoute }: SideBarProps) => {
  console.log(myLocation);
  console.log(otherLocation);
  const myAddress = useAddress(myLocation?.latitude, myLocation?.longitude);
  console.log("My address", myAddress);
  const otherAddress = useAddress(
    otherLocation?.latitude,
    otherLocation?.longitude
  );
  return (
    <div className="fixed bottom-0 right-0 md:top-0 md:right-0 md:bottom-auto md:w-[355px] w-full md:h-auto z-50 bg-gray-800 bg-opacity-75 text-white shadow-lg md:p-4 p-1">
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
