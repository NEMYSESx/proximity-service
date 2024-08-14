// import { SignedIn } from "@clerk/clerk-react";
import Map from "../components/Map";

const MapsPage = () => {
  return (
    // <SignedIn>
    <div className="flex flex-col md:flex-row h-screen max-w-[1180px]">
      <Map />;
    </div>
  );
  {
    /* </SignedIn> */
  }
};

export default MapsPage;
