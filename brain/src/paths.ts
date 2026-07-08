import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Where every JSON-persisted store (catalog, memory, curators, events, push
 * subscriptions, pending contributions) reads and writes. Defaults to
 * `brain/data/` for local dev. In production (Railway) the filesystem the
 * app builds into isn't persistent across deploys — set `DATA_DIR` to the
 * mount path of a real Railway Volume instead, so a redeploy never wipes
 * real user data.
 */
export const DATA_DIR = process.env.DATA_DIR || join(__dirname, '../data');
