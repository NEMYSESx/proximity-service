import { Location, MarkerData } from "../types/location";
import Routing from "./Routing";

const DataCard = ({
  isUser,
  title,
  address,
  myLocation,
  otherLocation,
}: {
  isUser: boolean;
  title: string;
  address?: string;
  myLocation?: Location;
  otherLocation?: MarkerData;
}) => {
  const handleRoute = () => {
    if (myLocation && otherLocation) {
      return <Routing myLocation={myLocation} otherLocation={otherLocation} />;
    }
    console.error("Locations are not available for routing.");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
      {isUser ? (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <ul className="text-gray-700 space-y-1">
            <li>
              <span className="font-medium">Latitude:</span>{" "}
              {myLocation?.latitude ?? "N/A"}
            </li>
            <li>
              <span className="font-medium">Longitude:</span>{" "}
              {myLocation?.longitude ?? "N/A"}
            </li>
            <li>
              <span className="font-medium">Address:</span> {address ?? "N/A"}
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <ul className="text-gray-700 space-y-1">
            <li>
              <span className="font-medium">UserId:</span>{" "}
              {otherLocation?.socket_id ?? "N/A"}
            </li>
            <li>
              <span className="font-medium">Latitude:</span>{" "}
              {otherLocation?.latitude ?? "N/A"}
            </li>
            <li>
              <span className="font-medium">Longitude:</span>{" "}
              {otherLocation?.longitude ?? "N/A"}
            </li>
            <li>
              <span className="font-medium">Address:</span> {address ?? "N/A"}
            </li>
          </ul>
          <button
            className="border border-black text-white bg-black p-1 rounded-lg mt-2"
            onClick={handleRoute}
          >
            Route
          </button>
        </div>
      )}
    </div>
  );
};

export default DataCard;
