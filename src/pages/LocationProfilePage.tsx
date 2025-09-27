import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLocationProfileData } from "@/hooks";
import { LocationHygiene, LocationReviews } from "@/components/locations";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Image,
  FileText,
  Settings,
} from "lucide-react";

export const LocationProfilePage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { profile, isLoading, isError, error } = useLocationProfileData(
    locationId || ""
  );

  if (isLoading) {
    return (
      <div className="d-flex h-100">
        <Sidebar activeSection="locations" />
        <div className="main-content d-flex flex-column bg-light">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="d-flex h-100">
        <Sidebar activeSection="locations" />
        <div className="main-content d-flex flex-column bg-light">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <h4 className="text-danger">Error Loading Location Profile</h4>
              <p className="text-muted">
                {error && typeof error === "object" && "message" in error
                  ? (error as any).message
                  : "An error occurred while loading the location profile"}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/locations")}
              >
                Back to Locations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data, attributes, hygiene } = profile;

  const getHealthColor = (health: number) => {
    if (health >= 80) return "success";
    if (health >= 60) return "warning";
    return "danger";
  };

  const getHealthIcon = (health: number) => {
    if (health >= 80) return <CheckCircle size={16} className="text-success" />;
    if (health >= 60) return <XCircle size={16} className="text-warning" />;
    return <XCircle size={16} className="text-danger" />;
  };

  const formatAttributeName = (name: string) => {
    return name
      .replace("attributes/", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="d-flex h-100">
      <Sidebar activeSection="locations" />

      <div className="main-content d-flex flex-column bg-light">
        {/* Header */}
        <div className="bg-white border-bottom p-4">
          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-link p-0 me-3"
              onClick={() => navigate("/locations")}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="mb-0 fw-bold">{data.name}</h2>
              <p className="text-muted mb-0">
                Location Profile - Store Code: {data.store_code}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-bottom px-4">
          <div className="d-flex">
            {[
              { id: "overview", label: "Overview" },
              { id: "hygiene", label: "Hygiene" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`btn btn-link text-decoration-none me-3 ${
                  activeTab === tab.id
                    ? "text-primary border-bottom border-primary border-2"
                    : "text-muted"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {activeTab === "overview" && (
            <div className="row">
              {/* Left Column - Basic Info */}
              <div className="col-lg-8">
                <div className="row">
                  {/* Basic Information */}
                  <div className="col-md-6 mb-4">
                    <div className="bg-white rounded shadow-sm p-4 h-100">
                      <h5 className="mb-3 d-flex align-items-center">
                        <Building size={20} className="me-2 text-primary" />
                        Basic Information
                      </h5>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Name</label>
                        <p className="mb-0">{data.name}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Category
                        </label>
                        <p className="mb-0">{data.category}</p>
                      </div>

                      {data.additional_categories &&
                        data.additional_categories.length > 0 && (
                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Additional Categories
                            </label>
                            <div className="d-flex flex-wrap gap-1">
                              {data.additional_categories.map(
                                (category, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-secondary"
                                  >
                                    {category}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Description
                        </label>
                        <p className="mb-0 text-muted">{data.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="col-md-6 mb-4">
                    <div className="bg-white rounded shadow-sm p-4 h-100">
                      <h5 className="mb-3 d-flex align-items-center">
                        <MapPin size={20} className="me-2 text-primary" />
                        Contact Information
                      </h5>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Address
                        </label>
                        <p className="mb-0">
                          {data.address}
                          <br />
                          {data.city}, {data.postal}
                          <br />
                          {data.country_code}
                        </p>
                      </div>

                      {data.phone_number && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold d-flex align-items-center">
                            <Phone size={16} className="me-2" />
                            Phone
                          </label>
                          <p className="mb-0">{data.phone_number}</p>
                        </div>
                      )}

                      {data.website_uri && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold d-flex align-items-center">
                            <Globe size={16} className="me-2" />
                            Website
                          </label>
                          <a
                            href={data.website_uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {data.website_uri}
                          </a>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Coordinates
                        </label>
                        <p className="mb-0 text-muted">
                          {data.latitude}, {data.longitude}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="col-12 mb-4">
                    <div className="bg-white rounded shadow-sm p-4">
                      <h5 className="mb-3 d-flex align-items-center">
                        <Settings size={20} className="me-2 text-primary" />
                        Location Attributes
                      </h5>

                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-success mb-3">
                            Available Attributes
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            {attributes.available_attributes.map(
                              (attr, index) => (
                                <span key={index} className="badge bg-success">
                                  {formatAttributeName(attr)}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <h6 className="text-danger mb-3">
                            Missing Attributes
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            {attributes.missing_attributes.map(
                              (attr, index) => (
                                <span key={index} className="badge bg-danger">
                                  {formatAttributeName(attr)}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Health & Hygiene */}
              <div className="col-lg-4">
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                  <h5 className="mb-3">Overall Health</h5>
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold fs-4 me-2">
                        {Math.round(hygiene.health)}%
                      </span>
                      {getHealthIcon(hygiene.health)}
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className={`progress-bar bg-${getHealthColor(hygiene.health)}`}
                        style={{ width: `${hygiene.health}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <h6 className="mb-3">Health Checklist</h6>
                    {[
                      {
                        label: "Verified",
                        value: hygiene.is_verified,
                        icon: CheckCircle,
                      },
                      {
                        label: "Published",
                        value: hygiene.is_published,
                        icon: CheckCircle,
                      },
                      { label: "Phone", value: hygiene.has_phone, icon: Phone },
                      {
                        label: "Website",
                        value: hygiene.has_website,
                        icon: Globe,
                      },
                      {
                        label: "Address",
                        value: hygiene.has_address,
                        icon: MapPin,
                      },
                      { label: "Hours", value: hygiene.has_hours, icon: Clock },
                      {
                        label: "Special Hours",
                        value: hygiene.has_special_hours,
                        icon: Clock,
                      },
                      {
                        label: "Category",
                        value: hygiene.has_category,
                        icon: Building,
                      },
                      {
                        label: "Additional Categories",
                        value: hygiene.has_additional_categories,
                        icon: Building,
                      },
                      {
                        label: "Attributes",
                        value: hygiene.has_attributes,
                        icon: Settings,
                      },
                      {
                        label: "Description",
                        value: hygiene.has_description,
                        icon: FileText,
                      },
                      {
                        label: "Cover Image",
                        value: hygiene.has_cover_image,
                        icon: Image,
                      },
                      {
                        label: "Logo Or Profile Image",
                        value: hygiene.has_logo_or_profile_image,
                        icon: Image,
                      },
                      {
                        label: "Interior Image",
                        value: hygiene.has_interior_image,
                        icon: Image,
                      },
                      {
                        label: "Exterior Image",
                        value: hygiene.has_exterior_image,
                        icon: Image,
                      },
                      {
                        label: "Service",
                        value: hygiene.has_service,
                        icon: Settings,
                      },
                      {
                        label: "Service With Description",
                        value: hygiene.has_service_with_description,
                        icon: FileText,
                      },
                      {
                        label: "UTM Parameters",
                        value: hygiene.has_utm_params,
                        icon: Settings,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="d-flex align-items-center justify-content-between mb-2"
                      >
                        <div className="d-flex align-items-center">
                          <item.icon size={16} className="me-2 text-muted" />
                          <span className="small">{item.label}</span>
                        </div>
                        {item.value ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hygiene" && (
            <div className="row">
              <div className="col-12">
                <div className="bg-white rounded shadow-sm p-4">
                  <h5 className="mb-4">Location Hygiene</h5>
                  <LocationHygiene
                    locationId={locationId || ""}
                    showDetails={true}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="row">
              <div className="col-12">
                <div className="bg-white rounded shadow-sm p-4">
                  <h5 className="mb-4">Location Reviews</h5>
                  <LocationReviews
                    locationId={locationId}
                    storeCode={data.store_code}
                    showFilters={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
