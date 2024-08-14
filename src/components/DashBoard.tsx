import { SignInButton } from "@clerk/clerk-react";

const DashBoard = () => {
  return (
    <nav>
      <SignInButton forceRedirectUrl="map/12" />
    </nav>
  );
};

export default DashBoard;
