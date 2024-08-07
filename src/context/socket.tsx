import React, { useContext, useEffect, useState, useCallback } from "react";
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
  const [isConnected, setIsConnected] = useState(false);
  const [_location, _setLocation] = useState<{ lat: string; long: string }[]>(
    []
  );
  const [_orientation, _setOrientation] = useState<string[]>([]);

  useEffect(() => {
    console.log("Initializing socket connection...");
    const _socket = io(
      "https://proximity-service-bk-production.up.railway.app"
    );

    setSocket(_socket);

    _socket.on("connect", () => {
      console.log("Socket connected", _socket.id);
      setIsConnected(true);
    });

    _socket.on("connect_error", (error) => {
      console.error("Connection Error: ", error);
    });

    _socket.on(
      "getLocation",
      (data: { [key: string]: { lat: string; long: string } }) => {
        console.log("Received location data from backend:", data);
        _setLocation(Object.values(data));
      }
    );

    _socket.on("getOrientation", (data: { [key: string]: string }) => {
      console.log("Received orientation data:", data);
      _setOrientation(Object.values(data));
    });

    _socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      console.log("Disconnecting socket...");
      _socket.disconnect();
    };
  }, []);

  const sendLocation = useCallback(
    (lat: string, long: string) => {
      console.log(
        "Attempting to send location to backend",
        { lat, long },
        "Connected:",
        isConnected
      );
      if (socket && isConnected) {
        socket.emit("sendLocation", { lat, long });
      } else {
        console.log("Socket is not connected");
      }
    },
    [socket, isConnected]
  );

  const sendOrientation = useCallback(
    (alpha: string) => {
      console.log(
        "Attempting to send orientation",
        alpha,
        "Connected:",
        isConnected
      );
      if (socket && isConnected) {
        socket.emit("sendOrientation", alpha);
      } else {
        console.log("Socket is not connected");
      }
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{ sendLocation, sendOrientation, _location, _orientation }}
    >
      {children}
    </SocketContext.Provider>
  );
};
