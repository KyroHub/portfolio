import { hasLengthInRange, normalizeWhitespace } from "@/lib/validation";

export const MAX_PROFILE_FULL_NAME_LENGTH = 120;

export function normalizeProfileFullName(value: string) {
  const normalized = normalizeWhitespace(value);
  return normalized.length > 0 ? normalized : null;
}

export function isValidProfileFullName(value: string | null) {
  return (
    value === null ||
    hasLengthInRange(value, {
      min: 1,
      max: MAX_PROFILE_FULL_NAME_LENGTH,
    })
  );
}

export function getAvatarStorageObjectPath(
  avatarUrl: string,
  {
    storageOrigin,
    userId,
  }: {
    storageOrigin: string;
    userId: string;
  },
) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(avatarUrl);
  } catch {
    return null;
  }

  if (parsedUrl.origin !== storageOrigin) {
    return null;
  }

  const publicPrefix = "storage/v1/object/public/";
  const normalizedPathname = parsedUrl.pathname.replace(/^\/+/, "");
  const expectedUserPrefix = `${publicPrefix}avatars/${userId}/`;

  if (!normalizedPathname.startsWith(expectedUserPrefix)) {
    return null;
  }

  const objectPath = normalizedPathname.slice(publicPrefix.length);
  const objectSuffix = objectPath.slice(`avatars/${userId}/`.length);

  return objectSuffix.length > 0 ? objectPath : null;
}
