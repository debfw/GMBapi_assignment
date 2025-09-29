import React from "react";
import { getHealthColor } from "@/utils/health";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  CheckCircle,
  Phone,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Tag,
  FileText,
  Image,
  Camera,
  Settings,
} from "lucide-react";
import { HealthBadge } from "@/components/common/HealthBadge";
import { useGetAccountLocationHygiene } from "@/services";

interface LocationHygieneProps {
  locationId: string;
  showDetails?: boolean;
}

export const LocationHygiene: React.FC<LocationHygieneProps> = ({
  locationId,
  showDetails = true,
}) => {
  const {
    data: hygiene,
    isLoading,
    error,
  } = useGetAccountLocationHygiene(locationId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-danger small">
        Failed to load hygiene data: {error.message}
      </div>
    );
  }

  if (!hygiene) {
    return <div className="text-muted small">No hygiene data available</div>;
  }

  const hygieneItems = [
    { key: "is_verified", label: "Verified", icon: CheckCircle },
    { key: "is_published", label: "Published", icon: Globe },
    { key: "has_phone", label: "Phone", icon: Phone },
    { key: "has_website", label: "Website", icon: Globe },
    { key: "has_address", label: "Address", icon: MapPin },
    { key: "has_hours", label: "Hours", icon: Clock },
    { key: "has_special_hours", label: "Special Hours", icon: Calendar },
    { key: "has_category", label: "Category", icon: Tag },
    {
      key: "has_additional_categories",
      label: "Additional Categories",
      icon: Tag,
    },
    { key: "has_attributes", label: "Attributes", icon: Settings },
    { key: "has_description", label: "Description", icon: FileText },
    { key: "has_cover_image", label: "Cover Image", icon: Image },
    {
      key: "has_logo_or_profile_image",
      label: "Logo/Profile Image",
      icon: Camera,
    },
    { key: "has_interior_image", label: "Interior Image", icon: Camera },
    { key: "has_exterior_image", label: "Exterior Image", icon: Camera },
    {
      key: "has_service_with_description",
      label: "Service with Description",
      icon: FileText,
    },
    { key: "has_service", label: "Service", icon: Settings },
    { key: "has_utm_params", label: "UTM Parameters", icon: Settings },
  ];

  return (
    <div className="location-hygiene">
      {/* Overall Health Score */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="mb-0">Overall Health</h6>
          <HealthBadge health={hygiene.payload.health} />
        </div>
        <div className="progress" style={{ height: "8px" }}>
          <div
            className={`progress-bar bg-${getHealthColor(hygiene.payload.health)}`}
            style={{ width: `${hygiene.payload.health}%` }}
          ></div>
        </div>
      </div>

      {/* Hygiene Checklist */}
      {showDetails && (
        <div className="hygiene-checklist">
          <h6 className="mb-3">Health Checklist</h6>
          <div className="row">
            {hygieneItems.map((item) => {
              const Icon = item.icon;
              const isComplete =
                hygiene.payload[item.key as keyof typeof hygiene.payload] === 1;

              return (
                <div key={item.key} className="col-6 mb-2">
                  <div className="d-flex align-items-center">
                    <Icon
                      size={16}
                      className={`me-2 ${isComplete ? "text-success" : "text-muted"}`}
                    />
                    <span className={`small ${isComplete ? "" : "text-muted"}`}>
                      {item.label}
                    </span>
                    {isComplete && (
                      <CheckCircle size={14} className="text-success ms-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
