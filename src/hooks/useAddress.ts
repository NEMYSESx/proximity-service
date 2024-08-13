import { useState, useEffect } from "react";
import axios from "axios";

function useAddress(
  latitude: number | undefined,
  longitude: number | undefined
) {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchAddress = async () => {
      const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=66b9135372750463292938hxo2c8caa`;

      try {
        const response = await axios.get(url);
        if (response.data) {
          setAddress(response.data.display_name);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return address;
}

export default useAddress;
