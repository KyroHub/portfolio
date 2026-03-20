import { EmptyState } from "@/components/EmptyState";

type SubmissionEmptyStateProps = {
  title: string;
  description: string;
};

export function SubmissionEmptyState({
  title,
  description,
}: SubmissionEmptyStateProps) {
  return <EmptyState title={title} description={description} />;
}
