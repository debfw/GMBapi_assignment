import React from "react";
import { Modal } from "react-bootstrap";

interface ReplyModalLayoutProps {
  show: boolean;
  onClose: () => void;
  title: React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  warningNode?: React.ReactNode;
  footerRight?: React.ReactNode;
}

export const ReplyModalLayout: React.FC<React.PropsWithChildren<ReplyModalLayoutProps>> = ({
  show,
  onClose,
  title,
  icon,
  size = "lg",
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  warningNode,
  footerRight,
  children,
}) => {
  return (
    <Modal show={show} onHide={onClose} size={size} centered className={className}>
      <Modal.Header closeButton className={headerClassName ?? "border-0 pb-4"}>
        <Modal.Title className="d-flex align-items-center fw-semibold">
          {icon}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={bodyClassName ?? "px-4 pb-4"}>
        {warningNode}
        {children}
      </Modal.Body>
      {footerRight && (
        <Modal.Footer className={footerClassName ?? "border-0 pt-0 px-4 pb-4"}>
          <div className="d-flex gap-3 w-100 justify-content-end">{footerRight}</div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ReplyModalLayout;


