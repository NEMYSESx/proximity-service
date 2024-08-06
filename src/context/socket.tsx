import React, { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface SocketContextProps {
  sendLocation: (lat: string, long: string) => void;
  sendOrientation: (alpha: string) => void;
  _location: { lat: string; long: string }[];
  _orientation: string[];
}

const SocketContext = React.createContext<SocketContextProps | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("Context is not defined");
  return context;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [_location, _setLocation] = useState<{ lat: string; long: string }[]>(
    []
  );
  const [_orientation, _setOrientation] = useState<string[]>([]);

  useEffect(() => {
    const _socket = io("https://proximity-service-bk.onrender.com");
    setSocket(_socket);

    _socket.on("connect", () => {
      console.log("Socket is connected", _socket.id);
    });

    _socket.on("getLocation", (lat: string, long: string) => {
      _setLocation((prev) => [...prev, { lat, long }]);
    });

    _socket.on("getOrientation", (alpha: string) => {
      _setOrientation((prev) => [...prev, alpha]);
    });

    _socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      _socket.disconnect();
    };
  }, []);

  const sendLocation: SocketContextProps["sendLocation"] = (
    lat: string,
    long: string
  ) => {
    if (socket) {
      socket.emit("sendLocation", { lat, long });
    } else {
      console.log("Socket is not connected");
    }
  };

  const sendOrientation: SocketContextProps["sendOrientation"] = (
    alpha: string
  ) => {
    if (socket) {
      socket.emit("sendOrientation", alpha);
    } else {
      console.log("Socket is not connected");
    }
  };

  return (
    <SocketContext.Provider
      value={{ sendLocation, sendOrientation, _location, _orientation }}
    >
      {children}
    </SocketContext.Provider>
  );
};
