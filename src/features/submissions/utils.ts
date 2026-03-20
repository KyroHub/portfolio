export function formatLessonSlug(lessonSlug: string) {
  return lessonSlug.replace(/-/g, " ");
}

export function formatSubmissionDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString();
}
