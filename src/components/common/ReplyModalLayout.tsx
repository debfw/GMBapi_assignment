import React, { createContext, useContext } from "react";
import { Modal } from "react-bootstrap";
import { useAISuggestion } from "@/hooks/useAISuggestion";

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
  aiSuggestionConfig?: {
    onSuggestionApplied?: (suggestion: string) => void;
  };
}

type SuggestionContextValue = {
  aiSuggestion: string;
  showSuggestion: boolean;
  hasSuggestion: boolean;
  isLoading: boolean;
  handleGetSuggestion: (text: string) => void;
  handleUseSuggestion: () => void;
  clearSuggestion: () => void;
};

const SuggestionContext = createContext<SuggestionContextValue | undefined>(
  undefined
);

export function useReplyModalAISuggestion():
  | SuggestionContextValue
  | undefined {
  return useContext(SuggestionContext);
}

export const ReplyModalLayout: React.FC<
  React.PropsWithChildren<ReplyModalLayoutProps>
> = ({
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
  aiSuggestionConfig,
  children,
}) => {
  const ai = useAISuggestion({
    onSuggestionUsed: aiSuggestionConfig?.onSuggestionApplied,
  });

  return (
    <Modal
      show={show}
      onHide={onClose}
      size={size}
      centered
      className={className}
    >
      <Modal.Header closeButton className={headerClassName ?? "border-0 pb-4"}>
        <Modal.Title className="d-flex align-items-center fw-semibold">
          {icon}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={bodyClassName ?? "px-4 pb-4"}>
        {warningNode}
        <SuggestionContext.Provider
          value={{
            aiSuggestion: ai.aiSuggestion,
            showSuggestion: ai.showSuggestion,
            hasSuggestion: ai.hasSuggestion,
            isLoading: ai.isLoading,
            handleGetSuggestion: ai.handleGetSuggestion,
            handleUseSuggestion: ai.handleUseSuggestion,
            clearSuggestion: ai.clearSuggestion,
          }}
        >
          {children}
        </SuggestionContext.Provider>
      </Modal.Body>
      {footerRight && (
        <Modal.Footer className={footerClassName ?? "border-0 pt-0 px-4 pb-4"}>
          <div className="d-flex gap-3 w-100 justify-content-end">
            {footerRight}
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ReplyModalLayout;
