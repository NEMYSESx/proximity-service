import { SignInButton } from "@clerk/clerk-react";

const DashBoard = () => {
  return (
    <>
      <nav className="border h-16 relative">
        <button className="absolute border p-1 rounded-lg right-6 mt-3 bg-yellow-300 shadow-xl">
          <SignInButton forceRedirectUrl="/map" />
        </button>
      </nav>
      <div className="flex justify-center items-center mt-4 text-3xl">
        <h1>Locatify</h1>
      </div>
    </>
  );
};

export default DashBoard;
