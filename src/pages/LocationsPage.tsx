import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
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
} from "lucide-react";

export const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { locations, metadata, isLoading } = useLocationsData({
    page: currentPage,
    per_page: perPage,
  });

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

  return (
    <div className="d-flex h-100">
      <Sidebar activeSection="locations" />

      <div className="main-content d-flex flex-column bg-light">
        {/* Header */}
        <div className="bg-white border-bottom p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0 fw-bold">{metadata?.results || 0} Locations</h2>
            <button className="btn btn-warning d-flex align-items-center">
              <Edit3 size={16} className="me-2" />
              Bulk Edit Locations
            </button>
          </div>

          {/* Search and Filters */}
          <div className="d-flex align-items-center gap-3">
            <div
              className="position-relative flex-grow-1"
              style={{ maxWidth: "300px" }}
            >
              <Search
                size={16}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ChevronDown
                size={16}
                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
              />
            </div>

            <button className="btn btn-outline-secondary d-flex align-items-center">
              <Filter size={16} className="me-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <div className="row">
            {/* Locations Table */}
            <div className="col-lg-8">
              <div className="bg-white rounded shadow-sm">
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
                                <span className="me-2">{location.name}</span>
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
                                <Star size={16} className="text-warning me-1" />
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
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-lg-4">
              <div className="bg-white rounded shadow-sm p-4">
                <h5 className="mb-3">Overall Health</h5>
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <span className="fw-bold fs-4 me-2">{overallHealth}%</span>
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
      </div>
    </div>
  );
};
