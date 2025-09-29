import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import GmpApiLogo from "@/assets/gmpApi.svg";
import { Sidebar } from "./Sidebar";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  activeSection = "reviews",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const location = useLocation();

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1610);
      if (window.innerWidth >= 1610) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (isMobile) {
    return (
      <div className="responsive-layout-mobile">
        {/* Mobile Topbar */}
        <div className="mobile-topbar">
          <div className="mobile-topbar-left">
            <button
              className="mobile-menu-button"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="mobile-logo">
              <img src={GmpApiLogo} alt="GMBapi Logo" />
            </div>
            <div className="mobile-breadcrumb">
              <span className="breadcrumb-text">
                {activeSection === "reviews"
                  ? ""
                  : activeSection === "locations"
                    ? "Locations"
                    : activeSection.charAt(0).toUpperCase() +
                      activeSection.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isSidebarOpen && (
          <>
            <div
              className="mobile-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="mobile-sidebar">
              <div className="mobile-sidebar-content">
                {navigationItems.map((group, groupIndex) => {
                  if (!group.section) {
                    return group.items?.map((item) => {
                      const isClickable =
                        item.id === "reviews" || item.id === "locations";
                      const href =
                        item.id === "reviews"
                          ? "/reviews"
                          : item.id === "locations"
                            ? "/locations"
                            : "#";

                      if (isClickable) {
                        return (
                          <Link
                            key={item.id}
                            to={href}
                            className={`mobile-nav-item ${
                              activeSection === item.id ? "active" : ""
                            }`}
                            onClick={handleNavClick}
                          >
                            <item.icon size={18} className="mobile-nav-icon" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      }

                      return (
                        <div key={item.id} className="mobile-nav-item disabled">
                          <item.icon size={18} className="mobile-nav-icon" />
                          <span>{item.label}</span>
                        </div>
                      );
                    });
                  }

                  return (
                    <div key={groupIndex} className="mobile-nav-section">
                      <button
                        className="mobile-nav-section-header"
                        onClick={() => toggleSection(group.section!)}
                      >
                        <span>{group.section}</span>
                        <ChevronDown
                          size={16}
                          className={`mobile-nav-chevron ${
                            openSections.includes(group.section!)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {openSections.includes(group.section!) && (
                        <div className="mobile-nav-section-items">
                          {group.items?.map((item) => {
                            const isClickable =
                              item.id === "reviews" || item.id === "locations";
                            const href =
                              item.id === "reviews"
                                ? "/reviews"
                                : item.id === "locations"
                                  ? "/locations"
                                  : "#";

                            if (isClickable) {
                              return (
                                <Link
                                  key={item.id}
                                  to={href}
                                  className={`mobile-nav-item ${
                                    activeSection === item.id ? "active" : ""
                                  }`}
                                  onClick={handleNavClick}
                                >
                                  <item.icon
                                    size={18}
                                    className="mobile-nav-icon"
                                  />
                                  <span>{item.label}</span>
                                </Link>
                              );
                            }

                            return (
                              <div
                                key={item.id}
                                className="mobile-nav-item disabled"
                              >
                                <item.icon
                                  size={18}
                                  className="mobile-nav-icon"
                                />
                                <span>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="mobile-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="responsive-layout-desktop d-flex">
      <Sidebar activeSection={activeSection} />
      <div className="desktop-content">{children}</div>
    </div>
  );
};
