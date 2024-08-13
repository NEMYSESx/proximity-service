import { useEffect, useState } from "react";
import { Polyline, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { RoutingProps } from "../types/location";

const Routing = ({ myLocation, otherLocation }: RoutingProps) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const map = useMap();
  useEffect(() => {
    const fetchRoute = async () => {
      const profile = "driving";
      if (myLocation && otherLocation) {
        const coordinateString = `${myLocation.longitude},${myLocation.latitude};${otherLocation.longitude},${otherLocation.latitude}`;
        const url = `https://router.project-osrm.org/route/v1/${profile}/${coordinateString}?overview=full`;
        console.log("Request URL:", url);

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const encodedPolyline = data.routes[0].geometry;
            const decodedPolyline = polyline.decode(encodedPolyline);
            setRoute(decodedPolyline);
          } else {
            console.error("No routes found in the response");
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      } else {
        setRoute([]);
      }
    };

    fetchRoute();
  }, [myLocation, otherLocation]);

  useEffect(() => {
    if (route.length > 0) {
      if (!map.getBounds().contains(route)) {
        map.fitBounds(route.map(([lat, lng]) => [lat, lng]));
      }
    }
  }, [route, map]);

  return <>{route.length > 0 && <Polyline positions={route} color="blue" />}</>;
};

export default Routing;
