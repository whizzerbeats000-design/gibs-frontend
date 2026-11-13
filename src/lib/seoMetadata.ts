const CANONICAL_DOMAIN = "https://gibs.com.ng";

type MetaAttribute = "name" | "property";

function metaTag(document: Document, attribute: MetaAttribute, key: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  return tag;
}

export function syncRouteMetadata(
  document: Document,
  path: string,
  title: string,
  description?: string
) {
  document.title = title;
  const canonical = `${CANONICAL_DOMAIN}${path}`;

  let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement("link");
    canonicalTag.rel = "canonical";
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.href = canonical;

  metaTag(document, "property", "og:url").content = canonical;
  metaTag(document, "property", "og:title").content = title;
  metaTag(document, "name", "twitter:title").content = title;

  if (description !== undefined) {
    metaTag(document, "name", "description").content = description;
    metaTag(document, "property", "og:description").content = description;
    metaTag(document, "name", "twitter:description").content = description;
  }
}
