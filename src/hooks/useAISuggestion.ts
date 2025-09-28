import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { getReviewSuggestionMutationOptions } from "@/services/hooks/useGetReviewSuggestion";

interface UseAISuggestionOptions {
  onSuggestionUsed?: (suggestion: string) => void;
}

export const useAISuggestion = (options?: UseAISuggestionOptions) => {
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [hasSuggestion, setHasSuggestion] = useState(false);

  const suggestionMutation = useMutation({
    ...getReviewSuggestionMutationOptions(),
    onError: (error) => {
      console.error("Failed to get AI suggestion:", error);
    },
  });

  const handleGetSuggestion = useCallback(
    async (reviewText: string) => {
      if (!reviewText.trim()) return;

      try {
        const result = await suggestionMutation.mutateAsync({
          data: { review: reviewText },
        });

        if (
          result?.msg &&
          result.msg.length > 0 &&
          result.msg[0]?.message?.content
        ) {
          const suggestion = result.msg[0].message.content;
          setAiSuggestion(suggestion);
          setShowSuggestion(true);
          setHasSuggestion(true);
        }
      } catch (error) {
        console.error("Failed to get suggestion:", error);
      }
    },
    [suggestionMutation]
  );

  const handleUseSuggestion = useCallback(() => {
    if (aiSuggestion) {
      options?.onSuggestionUsed?.(aiSuggestion);
      setShowSuggestion(false);
      setHasSuggestion(false);
    }
  }, [aiSuggestion, options]);

  const clearSuggestion = useCallback(() => {
    setAiSuggestion("");
    setShowSuggestion(false);
    setHasSuggestion(false);
  }, []);

  return {
    aiSuggestion,
    showSuggestion,
    hasSuggestion,
    isLoading: suggestionMutation.isPending,
    handleGetSuggestion,
    handleUseSuggestion,
    clearSuggestion,
  };
};
