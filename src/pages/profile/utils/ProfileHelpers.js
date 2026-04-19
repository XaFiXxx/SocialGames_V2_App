export function getImageUrl(path, imageVersion) {
  if (!path) return null;
  if (path.startsWith("http")) return `${path}?v=${imageVersion}`;
  return `${import.meta.env.VITE_API_URL}/${path}?v=${imageVersion}`;
}

export function formatDate(dateString) {
  if (!dateString) return "Non renseignée";

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString) {
  if (!dateString) return "Date inconnue";

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function memberSince(dateString) {
  if (!dateString) return "Non renseigné";

  return new Intl.DateTimeFormat("fr-BE", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getPostMedia(post) {
  if (!post?.media || !Array.isArray(post.media)) return [];
  return post.media;
}

export function getFirstImageFromPost(post, imageVersion) {
  const media = getPostMedia(post);
  const image = media.find((item) =>
    item.type?.toLowerCase().includes("image"),
  );

  if (!image?.url) return null;

  return getImageUrl(image.url, imageVersion);
}
