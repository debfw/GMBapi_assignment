import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ReviewsPage } from "@/components/pages/ReviewsPage/ReviewsPage";
import { LocationsPage } from "@/components/pages/LocationPage/LocationsPage";
import { LocationProfilePage } from "@/components/pages/LocationPage/ui/LocationProfilePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <ReviewsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/reviews"
            element={
              <ErrorBoundary>
                <ReviewsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/locations"
            element={
              <ErrorBoundary>
                <LocationsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/locations/:locationId"
            element={
              <ErrorBoundary>
                <LocationProfilePage />
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
