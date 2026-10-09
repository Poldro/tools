const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Builds a sitemap listing each path as an absolute URL under siteUrl. */
export const buildSitemap = (
  siteUrl: string,
  paths: readonly string[]
): string => {
  const urls = paths
    .map((path) => new URL(path, siteUrl).href)
    .map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};
