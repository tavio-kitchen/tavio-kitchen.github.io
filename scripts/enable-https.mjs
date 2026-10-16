import { pathToFileURL } from "node:url";

const domain = "taviokitchen.com";

export async function enableHttps({
  api,
  repository,
  delay = () => new Promise((resolve) => setTimeout(resolve, 60_000)),
  attempts = 65,
  log = console.log,
}) {
  const endpoint = `/repos/${repository}/pages`;
  let refreshed = false;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const pages = await api("GET", endpoint);
    if (pages.cname !== domain)
      throw new Error(
        "The custom domain has changed; no settings were updated.",
      );
    if (pages.https_enforced) {
      log(`HTTPS is enforced for ${domain}.`);
      return;
    }
    if (pages.https_certificate?.state === "approved") {
      await api("PUT", endpoint, { https_enforced: true });
      const verified = await api("GET", endpoint);
      if (!verified.https_enforced)
        throw new Error("GitHub did not confirm HTTPS enforcement.");
      log(`Enabled and verified HTTPS for ${domain}.`);
      return;
    }
    if (!pages.https_certificate && !refreshed) {
      const health = await api("GET", `${endpoint}/health`);
      if (
        health?.domain?.is_pointed_to_github_pages_ip === true &&
        health?.alt_domain?.is_pointed_to_github_pages_ip === true
      ) {
        // GitHub recommends re-saving the domain after DNS changes to restart provisioning.
        await api("PUT", endpoint, { cname: null });
        try {
          await api("PUT", endpoint, { cname: domain });
        } catch (error) {
          // Restore the existing domain before surfacing a transient API error.
          await api("PUT", endpoint, { cname: domain });
          throw error;
        }
        refreshed = true;
        log(
          "DNS is validated. Restarted custom-domain certificate provisioning.",
        );
      }
    }
    log(
      `Waiting for GitHub certificate: ${pages.https_certificate?.state || "pending DNS validation"} (${attempt}/${attempts}).`,
    );
    if (attempt < attempts) await delay();
  }
  throw new Error(
    "GitHub has not approved the certificate yet. Re-run Enable custom-domain HTTPS after DNS propagation completes.",
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const token = process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || repository !== "tavio-kitchen/tavio-kitchen.github.io") {
    throw new Error(
      "Run this helper in the website repository's authenticated administrative session.",
    );
  }
  const api = async (method, path, body) => {
    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok)
      throw new Error(
        `GitHub ${method} ${path} returned HTTP ${response.status}.`,
      );
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };
  await enableHttps({ api, repository });
}
