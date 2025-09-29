import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ModalContextState = {
  isReplyOpen: boolean;
  isBulkOpen: boolean;
  openReply: () => void;
  closeReply: () => void;
  openBulk: () => void;
  closeBulk: () => void;
  submitSingleReply: (args: {
    reviewId: string;
    text: string;
    isPublic: boolean;
  }) => Promise<void>;
  submitBulkReply: (args: {
    reviewIds: string[];
    text: string;
    isPublic: boolean;
  }) => Promise<void>;
};

const ModalContext = createContext<ModalContextState | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const openReply = useCallback(() => setIsReplyOpen(true), []);
  const closeReply = useCallback(() => setIsReplyOpen(false), []);
  const openBulk = useCallback(() => setIsBulkOpen(true), []);
  const closeBulk = useCallback(() => setIsBulkOpen(false), []);
  const submitSingleReply = useCallback(async () => {}, []);
  const submitBulkReply = useCallback(async () => {}, []);

  const value = useMemo(
    () => ({
      isReplyOpen,
      isBulkOpen,
      openReply,
      closeReply,
      openBulk,
      closeBulk,
      submitSingleReply,
      submitBulkReply,
    }),
    [
      isReplyOpen,
      isBulkOpen,
      openReply,
      closeReply,
      openBulk,
      closeBulk,
      submitSingleReply,
      submitBulkReply,
    ]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export function useModalContext(): ModalContextState {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error("useModalContext must be used within ModalProvider");
  return ctx;
}
