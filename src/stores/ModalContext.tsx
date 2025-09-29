import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { replyToReviewMutationOptions } from "@/services/hooks/useReplyToReview";

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

  // Shared reply mutations
  const singleReplyMutation = useMutation({
    ...replyToReviewMutationOptions(),
  });

  const submitSingleReply = useCallback(
    async ({
      reviewId,
      text,
      isPublic,
    }: {
      reviewId: string;
      text: string;
      isPublic: boolean;
    }) => {
      await singleReplyMutation.mutateAsync({
        reviewId,
        data: { text, isPublic },
      });
    },
    [singleReplyMutation]
  );

  const submitBulkReply = useCallback(
    async ({
      reviewIds,
      text,
      isPublic,
    }: {
      reviewIds: string[];
      text: string;
      isPublic: boolean;
    }) => {
      for (const id of reviewIds) {
        try {
          await singleReplyMutation.mutateAsync({
            reviewId: id,
            data: { text, isPublic },
          });
        } catch (_e) {
          // continue
        }
      }
    },
    [singleReplyMutation]
  );

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
