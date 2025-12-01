import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
import { Provider } from "react-redux";
import store from "./store";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading translations...</div>}>
        <LangProvider>
          <ThemeProvider>
            {/* <Toaster richColors position="bottom-right" expand closeButton /> */}
            <Toaster position="top-right" />
            <App />
          </ThemeProvider>
        </LangProvider>
      </Suspense>
    </Provider>
  </StrictMode>
);
