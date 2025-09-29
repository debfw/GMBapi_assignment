import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { useLocationsData } from "@/hooks";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  MapPin,
  Edit3,
  CheckCircle,
  Circle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25); // Changed to 25 per page
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const { locations, metadata, isLoading } = useLocationsData({
    page: currentPage,
    per_page: perPage,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1610);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 80) return "success";
    if (health >= 60) return "warning";
    return "danger";
  };

  const getHealthIcon = (health: number) => {
    if (health >= 80) return <CheckCircle size={16} className="text-success" />;
    if (health >= 60) return <Circle size={16} className="text-warning" />;
    return <XCircle size={16} className="text-danger" />;
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const overallHealth =
    locations.length > 0
      ? Math.round(
          locations.reduce((sum, loc) => sum + loc.health, 0) / locations.length
        )
      : 0;

  // Pagination calculations
  const totalPages = Math.ceil((metadata?.results || 0) / perPage);
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, metadata?.results || 0);
  const maxVisible = isMobile ? 3 : 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <ResponsiveLayout activeSection="locations">
      <div className="page-content-container w-100">
        <div className="main-content-wrapper">
          {/* Header */}
          <div className="content-section">
            <div className="locations-header bg-white rounded-3 p-4">
              <div
                className={`d-flex ${isMobile ? "flex-column gap-3" : "justify-content-between"} align-items-${isMobile ? "stretch" : "center"} mb-3`}
              >
                <div>
                  <h2 className="mb-0 fw-bold">
                    {metadata?.results || 0} Locations
                  </h2>
                  <small className="text-muted">
                    Showing {startItem}-{endItem} of {metadata?.results || 0}
                  </small>
                </div>
                <button
                  className={`btn btn-warning d-flex align-items-center ${isMobile ? "justify-content-center" : ""}`}
                >
                  <Edit3 size={16} className="me-2" />
                  Bulk Edit Locations
                </button>
              </div>

              {/* Search and Filters */}
              <div
                className={`d-flex ${isMobile ? "flex-column" : "align-items-center"} gap-3`}
              >
                <div
                  className="position-relative flex-grow-1"
                  style={{ maxWidth: isMobile ? "100%" : "300px" }}
                >
                  <Search
                    size={16}
                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <ChevronDown
                    size={16}
                    className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  />
                </div>

                <button
                  className={`btn btn-outline-secondary d-flex align-items-center ${isMobile ? "justify-content-center" : ""}`}
                >
                  <Filter size={16} className="me-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="locations-content">
            <div className={isMobile ? "" : "row"}>
              {/* Locations Table/Cards */}
              <div className={isMobile ? "mb-4" : "col-lg-8"}>
                <div className="bg-white rounded-3 shadow-sm">
                  {isMobile ? (
                    // Mobile Card View
                    <div className="p-3">
                      {isLoading ? (
                        <div className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : filteredLocations.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                          No locations found
                        </div>
                      ) : (
                        <>
                          {filteredLocations.map((location) => (
                            <div
                              key={location.location_id}
                              className="location-card border rounded-3 p-3 mb-3"
                              onClick={() =>
                                navigate(`/locations/${location.location_id}`)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1 fw-bold">
                                    {location.name}
                                  </h6>
                                  <span className="text-muted small">
                                    {location.store_code ||
                                      location.location_id}
                                  </span>
                                </div>
                                <div
                                  className="bg-success rounded-circle"
                                  style={{ width: "8px", height: "8px" }}
                                ></div>
                              </div>

                              <div className="mb-2">
                                <small className="text-muted d-flex align-items-center">
                                  <MapPin size={14} className="me-1" />
                                  {location.city}
                                </small>
                                <small className="text-muted d-block">
                                  {location.address}
                                </small>
                              </div>

                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <span className="me-2 fw-semibold small">
                                    {Math.round(location.health)}%
                                  </span>
                                  <div
                                    className="progress"
                                    style={{ width: "80px", height: "6px" }}
                                  >
                                    <div
                                      className={`progress-bar bg-${getHealthColor(location.health)}`}
                                      style={{ width: `${location.health}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <Star
                                    size={14}
                                    className="text-warning me-1"
                                  />
                                  <MapPin size={14} className="text-danger" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    // Desktop Table View
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0">STORE CODE</th>
                            <th className="border-0">LOCATION NAME</th>
                            <th className="border-0">CITY</th>
                            <th className="border-0">ADDRESS</th>
                            <th className="border-0">HEALTH</th>
                            <th className="border-0"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ) : filteredLocations.length === 0 ? (
                            <tr>
                              <td
                                colSpan={6}
                                className="text-center py-4 text-muted"
                              >
                                No locations found
                              </td>
                            </tr>
                          ) : (
                            filteredLocations.map((location) => (
                              <tr
                                key={location.location_id}
                                className="cursor-pointer"
                                onClick={() =>
                                  navigate(`/locations/${location.location_id}`)
                                }
                              >
                                <td className="fw-semibold">
                                  {location.store_code || location.location_id}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">
                                      {location.name}
                                    </span>
                                    <div
                                      className="bg-success rounded-circle"
                                      style={{ width: "8px", height: "8px" }}
                                    ></div>
                                  </div>
                                </td>
                                <td>{location.city}</td>
                                <td>{location.address}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="me-2 fw-semibold">
                                      {Math.round(location.health)}%
                                    </span>
                                    <div
                                      className="progress flex-grow-1 me-2"
                                      style={{ height: "6px" }}
                                    >
                                      <div
                                        className={`progress-bar bg-${getHealthColor(location.health)}`}
                                        style={{ width: `${location.health}%` }}
                                      ></div>
                                    </div>
                                    <Star
                                      size={16}
                                      className="text-warning me-1"
                                    />
                                    <MapPin size={16} className="text-danger" />
                                  </div>
                                </td>
                                <td></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Overall Health */}
              <div className={isMobile ? "" : "col-lg-4"}>
                <div className="bg-white rounded-3 shadow-sm p-4">
                  <h5 className="mb-3">Overall Health</h5>
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold fs-4 me-2">
                        {overallHealth}%
                      </span>
                      {getHealthIcon(overallHealth)}
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className={`progress-bar bg-${getHealthColor(overallHealth)}`}
                        style={{ width: `${overallHealth}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination at bottom center */}
          {!isLoading &&
            filteredLocations.length > 0 &&
            searchTerm.trim() === "" &&
            totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav aria-label="Locations pagination">
                  <ul className="pagination">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>

                    {start > 1 && (
                      <>
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </button>
                        </li>
                        {start > 2 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                      </>
                    )}

                    {Array.from(
                      { length: end - start + 1 },
                      (_, i) => start + i
                    ).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                    {end < totalPages && (
                      <>
                        {end < totalPages - 1 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </li>
                      </>
                    )}

                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};
