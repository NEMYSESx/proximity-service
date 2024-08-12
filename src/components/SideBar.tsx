import { SideBarProps } from "../types/location";
import DataCard from "./DataCard";
import { useState, useEffect } from "react";
import axios from "axios";

const SideBar = ({ myLocation, otherLocation, handleRoute }: SideBarProps) => {
  console.log(myLocation);
  console.log(otherLocation);

  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    setInterval(() => {
      const fetchAddress = async () => {
        if (myLocation?.latitude && myLocation?.longitude) {
          const url = `https://geocode.maps.co/reverse?lat=${myLocation.latitude}&lon=${myLocation.longitude}&api_key=66b9135372750463292938hxo2c8caa`;

          try {
            const response = await axios.get(url);
            if (response.data) {
              setAddress(response.data.display_name);
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        }
      };
      fetchAddress();
    }, 10000);
  }, [myLocation?.latitude, myLocation?.longitude]);
  return (
    <div className="fixed top-0 h-screen w-[355px] z-50 p-4 bg-gray-800 bg-opacity-75 text-white shadow-lg right-0">
      <DataCard
        isUser={true}
        title="My Details"
        address={address}
        myLocation={myLocation}
        handleRoute={handleRoute}
      />
      <DataCard
        isUser={false}
        title="User Details"
        otherLocation={otherLocation}
        handleRoute={handleRoute}
      />
    </div>
  );
};

export default SideBar;
