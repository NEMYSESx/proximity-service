import { MapContainer, TileLayer, useMap, Marker, Circle } from "react-leaflet";
import img from "/location-arrow.svg";
import { useState, useEffect } from "react";
import { DivIcon } from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";

interface Location {
  latitude: number;
  longitude: number;
}

const createCustomIcon = (direction: number) => {
  return new DivIcon({
    html: `<img src="${img}" style="transform: rotate(${direction}deg);" class="transition-transform duration-200 ease-linear w-6 h-6" alt="arrow" />`,
    iconSize: [25, 25],
    className: "custom-icon",
  });
};

function UpdateMapCenter({ location }: { location: Location }) {
  const map = useMap();
  useEffect(() => {
    if (location.latitude && location.longitude) {
      map.setView([location.latitude, location.longitude], map.getZoom());
    }
  }, [location, map]);

  return null;
}

function App() {
  const [location, setLocation] = useState<Location>({
    latitude: 51.505,
    longitude: -0.09,
  });
  const [arrowDirection, setArrowDirection] = useState<number>(0);
  const [orientationSupported, setOrientationSupported] =
    useState<boolean>(true);

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 200,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setArrowDirection(360 - event.alpha);
      } else {
        console.log("second");
        console.log(event);
        console.log(window.isSecureContext);
        setOrientationSupported(false);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      console.log("first");
      setOrientationSupported(false);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div>
      {!orientationSupported && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          Device orientation is not supported on this browser.
        </div>
      )}
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={20}
        className="h-screen"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UpdateMapCenter location={location} />
        <Marker
          position={[location.latitude, location.longitude]}
          icon={createCustomIcon(arrowDirection)}
        ></Marker>
        <Circle center={[location.latitude, location.longitude]} radius={10} />
      </MapContainer>
    </div>
  );
}

export default App;
