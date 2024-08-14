import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import DashBoardPage from "./pages/DashBoardPage";
import MapsPage from "./pages/MapsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MapsPage />,
    },
    {
      path: "/map",
      element: <></>,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
