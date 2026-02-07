import type { Scraper, ScraperOptions, ScrapeResult } from "../base-scraper";
import { searchByCompanyWebsite } from "./search";
import { createLogger } from "../../utils/logger";

const log = createLogger("linkedin");

export class LinkedInScraper implements Scraper {
  readonly platform = "linkedin" as const;
  readonly name = "LinkedIn (NinjaPear)";

  async scrape(options: ScraperOptions): Promise<ScrapeResult> {
    const errors: string[] = [];

    // Query can be a company website or comma-separated list of websites
    const websites = options.query.split(",").map((w) => w.trim());
    const allRecruiters: ScrapeResult["recruiters"] = [];

    const perSiteLimit = Math.ceil(
      (options.maxResults ?? 50) / websites.length
    );

    for (const website of websites) {
      try {
        log.info(`Discovering companies via "${website}"...`);
        const { recruiters, companies } = await searchByCompanyWebsite(
          website,
          perSiteLimit
        );
        allRecruiters.push(...recruiters);
        log.info(
          `Found ${recruiters.length} recruiter leads and ${companies.length} companies via "${website}"`
        );
      } catch (err) {
        const msg = `NinjaPear search for "${website}": ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        log.error(msg);
      }
    }

    return { recruiters: allRecruiters, jobs: [], errors };
  }

  async shutdown(): Promise<void> {
    // No persistent resources
  }
}
