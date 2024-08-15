import { useState, useEffect } from "react";
import { useSocket } from "../context/Socket";

import { Location, MarkerData } from "../types/location";
import { debounce } from "lodash";

import { DivIcon } from "leaflet";
import img from "/location-arrow.svg";
import "leaflet/dist/leaflet.css";
import SideBar from "../components/SideBar";
import { Icon } from "leaflet";

import { MapContainer, TileLayer, useMap, Marker, Circle } from "react-leaflet";
import Routing from "./Routing";
const Map = () => {
  const { _location, sendLocation, sendOrientation, _orientation, mySocketId } =
    useSocket();
  const [location, setLocation] = useState<Location>({
    latitude: 51.505,
    longitude: -0.09,
  });
  const [arrowDirection, setArrowDirection] = useState<number>(0);
  const [markerData, setMarkerData] = useState<MarkerData>({
    latitude: 3423,
    longitude: 3232,
    socket_id: "3dfvfd",
  });
  const [markerClicked, setMarkerClicked] = useState<boolean>(false);
  const [showRouting, setShowRouting] = useState<boolean>(false);

  function UpdateMapCenter({ location }: { location: Location }) {
    const map = useMap();
    useEffect(() => {
      if (location.latitude && location.longitude) {
        map.setView([location.latitude, location.longitude], map.getZoom());
      }
    }, [location.latitude, location.longitude, map]);

    return null;
  }

  useEffect(() => {
    const handleDebouncedUpdate = debounce((position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      sendLocation(latitude.toString(), longitude.toString());
    }, 300);
    const watchID = navigator.geolocation.watchPosition(
      handleDebouncedUpdate,

      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  }, [sendLocation]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const alpha = 360 - event.alpha;
        setArrowDirection(alpha);
        sendOrientation(alpha.toString());
      } else {
        console.log("error1");
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      console.log("error");
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [sendOrientation]);

  const filteredLocations = Object.values(_location).filter((value, index) => {
    // const lat = parseFloat(value.lat);
    // const long = parseFloat(value.long);
    // const orientation = _orientation[index]
    //   ? parseFloat(_orientation[index])
    //   : 0;
    const socketId = Object.keys(_location)[index];
    console.log(value);
    return !(socketId === mySocketId);
  });
  console.log("Filterd", filteredLocations);
  console.log("myLocation", location);

  const createCustomIcon = (direction: number) => {
    return new DivIcon({
      html: `<img src="${img}" style="transform: rotate(${direction}deg);" class="transition-transform duration-200 ease-linear w-6 h-6" alt="arrow" />`,
      iconSize: [25, 25],
      className: "custom-icon",
    });
  };

  const defaultIcon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    className: "",
  });

  const handleMarkerClick = ({
    lat,
    long,
    socket_id,
  }: {
    lat: number;
    long: number;
    socket_id: string;
  }) => {
    setMarkerData({ latitude: lat, longitude: long, socket_id });
    setMarkerClicked(true);
  };

  const handleRoute = () => {
    setShowRouting(true);
  };

  return (
    <div className="order-2 md:order-1 flex-grow">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={15}
        className="h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UpdateMapCenter location={location} />

        <Marker
          position={[location.latitude, location.longitude]}
          icon={createCustomIcon(arrowDirection)}
        />

        <Circle center={[location.latitude, location.longitude]} radius={10} />
        {showRouting ? (
          <Routing myLocation={location} otherLocation={markerData} />
        ) : null}

        {filteredLocations.map((value, index) => {
          const lat = parseFloat(value.lat);
          const long = parseFloat(value.long);
          const orientation = _orientation[index]
            ? parseFloat(_orientation[index])
            : 0;

          return markerClicked ? (
            <Marker
              key={index}
              position={[lat, long]}
              icon={createCustomIcon(orientation)}
            />
          ) : (
            <Marker
              key={index}
              position={[lat, long]}
              eventHandlers={{
                click: () => {
                  const socket_id = Object.keys(_location)[index];
                  handleMarkerClick({
                    lat,
                    long,
                    socket_id,
                  });
                },
              }}
              icon={defaultIcon}
            ></Marker>
          );
        })}
      </MapContainer>
      <div className="order-1 md:order-2 w-full md:w-auto">
        <SideBar
          myLocation={location}
          otherLocation={markerData}
          handleRoute={handleRoute}
        />
      </div>
    </div>
  );
};

export default Map;
