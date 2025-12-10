import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { LangProvider } from "./context/LangContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./i18n";
import "./index.css";
import store from "./store";

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
  </StrictMode>,
);
