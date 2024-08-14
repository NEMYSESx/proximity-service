import { SignInButton } from "@clerk/clerk-react";

const DashBoard = () => {
  return (
    <nav>
      <SignInButton forceRedirectUrl="/map" />
    </nav>
  );
};

export default DashBoard;
