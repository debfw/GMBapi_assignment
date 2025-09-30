import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { REPLY_LIMITS } from "@/utils/constants";
import { AISuggestionDisplay } from "./AISuggestionDisplay";

const replyFormSchema = z.object({
  text: z
    .string()
    .min(REPLY_LIMITS.MIN_LENGTH, "Reply cannot be empty")
    .max(
      REPLY_LIMITS.MAX_LENGTH,
      `Reply must be less than ${REPLY_LIMITS.MAX_LENGTH} characters`
    ),
  isPublic: z.boolean().default(true),
});

interface ReplyFormProps {
  onSubmit: (data: z.infer<typeof replyFormSchema>) => void;
  onTextChange: (characterCount: number) => void;
  characterCount: number;
  isSubmitting: boolean;
  selectedCount: number;
  getSuggestionPrompt?: () => string;
  registerSubmit?: (submitFn: () => void) => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  onSubmit,
  onTextChange,
  characterCount,
  getSuggestionPrompt,
  registerSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const watchedText = watch("text", "");
  const prompt = getSuggestionPrompt ? getSuggestionPrompt() : watchedText;
  const isAISuggestionDisabled = !prompt || !prompt.trim();

  useEffect(() => {
    onTextChange(watchedText.length);
  }, [watchedText, onTextChange]);

  useEffect(() => {
    if (registerSubmit) {
      const submitFn = () => handleSubmit(onSubmit)();
      registerSubmit(submitFn);
    }
  }, [registerSubmit, handleSubmit, onSubmit]);

  const isOverLimit = characterCount > REPLY_LIMITS.MAX_LENGTH;
  const remainingChars = REPLY_LIMITS.MAX_LENGTH - characterCount;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Reply Text Section */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-medium mb-3">Reply Text</Form.Label>
        {/* AI Suggestion UI next to input */}
        <AISuggestionDisplay
          prompt={prompt}
          onUseSuggestion={setValue}
          disabled={isAISuggestionDisabled}
          className="mb-2"
        />
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Write a professional and helpful reply..."
          {...register("text")}
          isInvalid={!!errors.text}
          className="bulk-reply-textarea"
        />
        <Form.Control.Feedback type="invalid" className="mt-2">
          {errors.text?.message}
        </Form.Control.Feedback>
        <div className="d-flex justify-content-between mt-3">
          <Form.Text
            className={isOverLimit ? "text-danger" : "text-muted small"}
          >
            {characterCount} / {REPLY_LIMITS.MAX_LENGTH} characters
            {isOverLimit && " (over limit)"}
          </Form.Text>
          {remainingChars < 50 && remainingChars > 0 && (
            <Form.Text className="text-warning small">
              {remainingChars} characters remaining
            </Form.Text>
          )}
        </div>
      </Form.Group>

      {/* Public Reply Section */}
      <Form.Group className="mb-4">
        <Form.Check
          type="checkbox"
          label="Make these replies public (visible to customers)"
          {...register("isPublic")}
          className="mb-3"
        />
        <Form.Text className="text-muted small">
          Public replies will be visible to customers and other potential
          customers.
        </Form.Text>
      </Form.Group>
    </Form>
  );
};
