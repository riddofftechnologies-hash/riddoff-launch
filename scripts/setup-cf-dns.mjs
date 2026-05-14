import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { config } from "dotenv";
import Cloudflare from "cloudflare";

config({ path: ".env.cloudflare" });

// Try .env.cloudflare first, then fall back to wrangler's stored OAuth token
function resolveToken() {
  // 1. Explicit env file
  try {
    const raw = readFileSync(join(process.cwd(), ".env.cloudflare"), "utf8");
    const match = raw.match(/^CLOUDFLARE_API_TOKEN=(.+)$/m);
    if (match) return { apiToken: match[1].trim() };
  } catch {}

  // 2. Wrangler OAuth token (~/.wrangler/config/default.toml)
  try {
    const toml = readFileSync(
      join(homedir(), ".wrangler", "config", "default.toml"),
      "utf8"
    );
    const match = toml.match(/oauth_token\s*=\s*"(.+?)"/);
    if (match) return { apiToken: match[1] };
  } catch {}

  return null;
}

function resolveZoneId() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.cloudflare"), "utf8");
    const match = raw.match(/^CLOUDFLARE_ZONE_ID=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  return process.env.CLOUDFLARE_ZONE_ID ?? null;
}

const creds = resolveToken();
if (!creds) {
  console.error(
    "No Cloudflare credentials found.\n" +
    "Run:  npx wrangler login\n" +
    "Then re-run:  npm run dns:setup"
  );
  process.exit(1);
}

const cf = new Cloudflare(creds);

// Discover zone ID from the API if not supplied
async function getZoneId(cf) {
  const stored = resolveZoneId();
  if (stored) return stored;

  const zones = await cf.zones.list({ name: "riddoff.com" });
  if (!zones.result.length) throw new Error("Zone riddoff.com not found in this account");
  const zoneId = zones.result[0].id;
  console.log(`Resolved zone ID for riddoff.com: ${zoneId}`);
  return zoneId;
}

// DNS records to upsert for ed.riddoff.com on Vercel
// Proxied = false: Vercel terminates SSL, Cloudflare proxy would conflict
const RECORDS = [
  {
    type: "CNAME",
    name: "ed",
    content: "cname.vercel-dns.com",
    proxied: false,
    comment: "ed.riddoff.com → Vercel e-learning platform",
  },
];

async function run() {
  const zoneId = await getZoneId(cf);

  const existing = await cf.dns.records.list({ zone_id: zoneId });

  for (const record of RECORDS) {
    const fqdn = `${record.name}.riddoff.com`;
    const match = existing.result.find(
      (r) => r.type === record.type && r.name === fqdn
    );

    if (match) {
      await cf.dns.records.update(match.id, { zone_id: zoneId, ...record });
      console.log(`Updated : ${record.type} ${fqdn} → ${record.content}`);
    } else {
      await cf.dns.records.create({ zone_id: zoneId, ...record });
      console.log(`Created : ${record.type} ${fqdn} → ${record.content}`);
    }
  }

  console.log("\nDone. Check: https://dash.cloudflare.com/");
}

run().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
