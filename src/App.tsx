import { useState, useEffect } from "react";
import { useSocket } from "./context/Socket";
import "./App.css";
import { Location } from "./types/location";
import { debounce } from "lodash";
import { MapContainer, TileLayer, useMap, Marker, Circle } from "react-leaflet";
import { DivIcon } from "leaflet";
import img from "/location-arrow.svg";
import "leaflet/dist/leaflet.css";
import SideBar from "./components/SideBar";

function App() {
  const { _location, sendLocation, sendOrientation, _orientation } =
    useSocket();
  const [location, setLocation] = useState<Location>({
    latitude: 51.505,
    longitude: -0.09,
  });
  const [arrowDirection, setArrowDirection] = useState<number>(0);

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
    const lat = parseFloat(value.lat);
    const long = parseFloat(value.long);
    const orientation = _orientation[index]
      ? parseFloat(_orientation[index])
      : 0;

    return !(
      lat === location.latitude &&
      long === location.longitude &&
      orientation === arrowDirection
    );
  });
  console.log("Filterd", filteredLocations);

  const createCustomIcon = (direction: number) => {
    return new DivIcon({
      html: `<img src="${img}" style="transform: rotate(${direction}deg);" class="transition-transform duration-200 ease-linear w-6 h-6" alt="arrow" />`,
      iconSize: [25, 25],
      className: "custom-icon",
    });
  };

  return (
    <>
      <SideBar myLocation={location} />
      <div className="flex flex-row h-screen max-w-[1180px] right-0">
        <div className="flex-grow">
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

            <Circle
              center={[location.latitude, location.longitude]}
              radius={10}
            />

            {filteredLocations.map((value, index) => {
              const lat = parseFloat(value.lat);
              const long = parseFloat(value.long);
              const orientation = _orientation[index]
                ? parseFloat(_orientation[index])
                : 0;
              return (
                <Marker
                  key={index}
                  position={[lat, long]}
                  icon={createCustomIcon(orientation)}
                />
              );
            })}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;
