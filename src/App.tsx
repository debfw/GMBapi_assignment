import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ReviewsPage } from "@/pages/ReviewsPage";
import { LocationsPage } from "@/pages/LocationsPage";
import { LocationProfilePage } from "@/pages/LocationProfilePage";
import { queryClient } from "@/stores/queryClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  return (
    <ErrorBoundary
      disableRetry={false}
      retryDisabledMessage="Retry functionality has been disabled. Please contact support for assistance."
    >
      <QueryClientProvider client={queryClient}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="App">
            <Routes>
              <Route path="/" element={<ReviewsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route
                path="/locations/:locationId"
                element={<LocationProfilePage />}
              />
            </Routes>
          </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
