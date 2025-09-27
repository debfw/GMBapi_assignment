import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  MapPin,
  LayoutDashboard,
  Star,
  BarChart3,
  Users,
  Zap,
  HelpCircle,
  Settings,
} from "lucide-react";
import GmpApiLogo from "@/assets/gmpApi.svg";

interface SidebarProps {
  activeSection?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection = "reviews",
}) => {
  const navigationItems = [
    {
      section: null,
      items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      section: "MANAGE",
      items: [
        { id: "locations", label: "Locations", icon: MapPin },
        { id: "citations", label: "Citations", icon: Star },
      ],
    },
    {
      section: "ANALYZE",
      items: [
        { id: "performance", label: "Performance", icon: BarChart3 },
        { id: "competitors", label: "Competitors", icon: Users },
      ],
    },
    {
      section: "ENGAGE",
      items: [
        { id: "content", label: "Content", icon: Zap },
        { id: "reviews", label: "Reviews", icon: MessageSquare },
        { id: "qa", label: "Q&A", icon: HelpCircle },
      ],
    },
    {
      section: "ADMIN",
      items: [
        { id: "users", label: "Users", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ id: "help", label: "Help Desk", icon: HelpCircle }],
    },
  ];

  return (
    <div className="d-flex flex-column h-100 sidebar-container">
      {/* Logo Section */}
      <div className="p-4 border-bottom sidebar-border">
        <div className="d-flex align-items-center">
          <div className="me-3 sidebar-logo-container">
            <img src={GmpApiLogo} alt="GMBapi Logo" className="sidebar-logo" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow-1 p-3">
        {navigationItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={index} className="mb-4">
                <div className="small fw-600 mb-2 px-2 sidebar-section-label">
                  {item.section}
                </div>
                {item.items?.map((navItem) => {
                  const isClickable =
                    navItem.id === "reviews" || navItem.id === "locations";
                  const href =
                    navItem.id === "reviews"
                      ? "/reviews"
                      : navItem.id === "locations"
                        ? "/locations"
                        : "#";

                  if (isClickable) {
                    return (
                      <Link
                        key={navItem.id}
                        to={href}
                        className={`d-flex align-items-center px-2 py-2 mb-1 rounded-2 text-decoration-none sidebar-nav-link ${
                          activeSection === navItem.id
                            ? "sidebar-nav-link-active"
                            : ""
                        }`}
                      >
                        <navItem.icon
                          size={18}
                          className="me-3 sidebar-nav-icon"
                        />
                        <span className="fw-500 sidebar-nav-text">
                          {navItem.label}
                        </span>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={navItem.id}
                        className="d-flex align-items-center px-2 py-2 mb-1 rounded-2 sidebar-nav-link-disabled"
                      >
                        <navItem.icon
                          size={18}
                          className="me-3 sidebar-nav-icon-disabled"
                        />
                        <span className="fw-500 sidebar-nav-text-disabled">
                          {navItem.label}
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
