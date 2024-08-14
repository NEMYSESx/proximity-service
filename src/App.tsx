import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";
import MapsPage from "./pages/MapsPage";
import { useUser } from "@clerk/clerk-react";

function App() {
  const { isSignedIn } = useUser();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashBoardPage />,
    },

    {
      path: "/map",
      element: isSignedIn ? <MapsPage /> : <DashBoardPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
