/**
 * TikTok's public oEmbed endpoint — unauthenticated, no API key, part of the open oEmbed
 * standard TikTok itself publishes for embed cards. Gives a real caption/author for a TikTok
 * link instead of the opaque URL a Reel/Instagram link stays as (Instagram's oEmbed has required
 * a Meta app + token since 2020 — see docs/PENDING-FEATURES.md, not implemented here).
 */

const TIKTOK_URL_RE = /tiktok\.com/i;

export interface TikTokOEmbed {
  title: string;
  authorName: string;
}

export function isTikTokUrl(url: string): boolean {
  return TIKTOK_URL_RE.test(url);
}

/** Returns null on any failure (private video, deleted, malformed URL, network) — never throws, always a graceful fallback to the manual-review queue. */
export async function fetchTikTokOEmbed(url: string): Promise<TikTokOEmbed | null> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string; author_name?: string };
    if (!data.title) return null;
    return { title: data.title, authorName: data.author_name ?? '' };
  } catch {
    return null;
  }
}
