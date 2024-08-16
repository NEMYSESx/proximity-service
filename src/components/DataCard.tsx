import { Location, MarkerData } from "../types/location";

const DataCard = ({
  isUser,
  title,
  address,
  myLocation,
  otherLocation,
  handleRoute,
}: {
  isUser: boolean;
  title: string;
  address?: string;
  myLocation?: Location;
  otherLocation?: MarkerData;
  handleRoute: () => void;
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
      {isUser ? (
        <div>
          <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-2">
            {title}
          </h3>
          <ul className="text-gray-700">
            <li>
              <span className="text-sm md:font-medium">Latitude:</span>{" "}
              {myLocation?.latitude ?? "N/A"}
            </li>
            <li>
              <span className="text-sm md:font-medium">Longitude:</span>{" "}
              {myLocation?.longitude ?? "N/A"}
            </li>
            <li>
              <span className="text-sm md:font-medium">Address:</span>{" "}
              {address ?? "N/A"}
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-2">
            {title}
          </h3>
          <ul className="text-gray-700">
            <li>
              <span className="text-sm md:font-medium">UserId:</span>{" "}
              {otherLocation?.socket_id ?? "N/A"}
            </li>
            <li>
              <span className="text-sm md:font-medium">Latitude:</span>{" "}
              {otherLocation?.latitude ?? "N/A"}
            </li>
            <li>
              <span className="text-sm md:font-medium">Longitude:</span>{" "}
              {otherLocation?.longitude ?? "N/A"}
            </li>
            <li>
              <span className="text-sm md:font-medium">Address:</span>{" "}
              {address ?? "N/A"}
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
