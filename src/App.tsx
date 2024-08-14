import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";
import MapsPage from "./pages/MapsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashBoardPage />,
    },
    {
      path: "/map",
      element: <MapsPage />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
