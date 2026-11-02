export function productSlug(name = "") {
  return name
    .replace(/\s+[—-]\s+Preview$/i, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
