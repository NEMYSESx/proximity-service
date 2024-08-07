import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Circle } from "react-leaflet";
import { DivIcon } from "leaflet";
import img from "/location-arrow.svg";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { useSocket } from "./context/socket";

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
  const {
    _location = [],
    sendLocation,
    sendOrientation,
    _orientation = [],
  } = useSocket();
  const [arrowDirection, setArrowDirection] = useState<number>(0);
  const [orientationSupported, setOrientationSupported] =
    useState<boolean>(true);

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        sendLocation(latitude.toString(), longitude.toString());
      },
      (error) => {
        console.log(error);
        // Optionally, handle the error or notify the user
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 }
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
        setOrientationSupported(false);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      setOrientationSupported(false);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [sendOrientation]);

  return (
    <div>
      {!orientationSupported && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          Device orientation is not supported on this browser.
        </div>
      )}
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={15}
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
        />
        <Circle center={[location.latitude, location.longitude]} radius={10} />
        {_location.map((value, index) => {
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
  );
}

export default App;
