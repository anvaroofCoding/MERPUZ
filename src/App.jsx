import { RouterProvider } from "react-router-dom";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import OfflineOverlay from "./OfflinePage";
import { router } from "./router/router";

function App() {
  const isOnline = useOnlineStatus();

  return (
    <>
      <RouterProvider router={router} />
      {!isOnline && <OfflineOverlay />}
    </>
  );
}

export default App;
