import { getConfig } from "../../config";
import { rateLimited } from "../../utils/rate-limiter";
import { withRetry } from "../../utils/retry";
import { createLogger } from "../../utils/logger";
import type { ScrapeResult } from "../base-scraper";

const log = createLogger("linkedin");
const NUBELA_BASE = "https://nubela.co/api/v1";

interface NubelaCustomer {
  name: string;
  description: string;
  tagline: string;
  industry: string;
  website: string;
  specialties: string[];
  linkedin_url: string;
  twitter_url: string;
  location: string;
}

interface NubelaCustomerListingResponse {
  customers: NubelaCustomer[];
  total_count: number;
  next_page: string | null;
}

/**
 * Uses NinjaPear's Customer Listing API to discover companies
 * and their associated contact info. Maps company data into
 * recruiter-adjacent records for follow-up enrichment.
 */
export async function searchByCompanyWebsite(
  website: string,
  maxResults: number
): Promise<{
  recruiters: ScrapeResult["recruiters"];
  companies: Array<{
    name: string;
    website: string;
    linkedinUrl: string;
    twitterHandle: string;
    industry: string;
    location: string;
    description: string;
  }>;
}> {
  const config = getConfig();
  if (!config.NUBELA_API_KEY) {
    throw new Error("NUBELA_API_KEY required for NinjaPear API");
  }

  const params = new URLSearchParams({
    website,
  });

  log.info(`Querying NinjaPear Customer Listing for "${website}"...`);

  const data = await withRetry(() =>
    rateLimited(async () => {
      const res = await fetch(
        `${NUBELA_BASE}/customer/listing?${params}`,
        {
          headers: {
            Authorization: `Bearer ${config.NUBELA_API_KEY}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`NinjaPear ${res.status}: ${await res.text()}`);
      }
      return res.json() as Promise<NubelaCustomerListingResponse>;
    })
  );

  log.info(`Found ${data.total_count ?? data.customers?.length ?? 0} customers`);

  const customers = (data.customers ?? []).slice(0, maxResults);
  const companies: Array<{
    name: string;
    website: string;
    linkedinUrl: string;
    twitterHandle: string;
    industry: string;
    location: string;
    description: string;
  }> = [];

  const recruiters: ScrapeResult["recruiters"] = [];

  for (const customer of customers) {
    // Store company data for the companies table
    const twitterHandle = customer.twitter_url
      ? extractTwitterHandle(customer.twitter_url)
      : null;

    companies.push({
      name: customer.name,
      website: customer.website,
      linkedinUrl: customer.linkedin_url,
      twitterHandle: twitterHandle ?? "",
      industry: customer.industry,
      location: customer.location,
      description: customer.description || customer.tagline,
    });

    // Create a recruiter placeholder from company data
    // These records represent companies where recruiters can be found
    if (customer.linkedin_url) {
      recruiters.push({
        fullName: `Hiring @ ${customer.name}`,
        role: "recruiter",
        company: customer.name,
        linkedinUrl: customer.linkedin_url,
        twitterHandle,
        location: customer.location ?? null,
        jobTypes: customer.specialties ?? [],
        source: "linkedin",
        sourceUrl: customer.linkedin_url,
        scrapedAt: new Date(),
      });
    }
  }

  return { recruiters, companies };
}

function extractTwitterHandle(url: string): string | null {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\//, "").split("/")[0];
    return path ? `@${path}` : null;
  } catch {
    return null;
  }
}
