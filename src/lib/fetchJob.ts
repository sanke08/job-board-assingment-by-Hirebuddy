// lib/jobSearch.ts
import { connectDB } from "@/lib/db";
import { Job } from "@/lib/modals";

const LIMIT = 5;

function parseMultiTerms(param?: string | null): string[] {
    if (!param) return [];
    return param.split(",").map(s => s.trim()).filter(Boolean);
}

export async function fetchJobs(options: {
    page?: number;
    title?: string;
    location?: string;
    company?: string;
    source?: string;
    q?: string;
}) {
    const page = options.page || 1;
    const skip = (page - 1) * LIMIT;

    const titleTerms = parseMultiTerms(options.title);
    const locationTerms = parseMultiTerms(options.location);
    const companyTerms = parseMultiTerms(options.company);
    const sourceTerms = parseMultiTerms(options.source);

    await connectDB();

    const hasSearch =
        options.q ||
        titleTerms.length > 0 ||
        locationTerms.length > 0 ||
        companyTerms.length > 0 ||
        sourceTerms.length > 0;

    if (hasSearch) {
        const searchStage: {
            index: string;
            compound: {
                should: object[];
                filter: object[];
            };
        } = {
            index: "default",
            compound: {
                should: [],
                filter: []
            }
        };

        if (options.q) {
            searchStage.compound.should.push({
                text: {
                    query: options.q,
                    path: ["job_title", "job_description", "company_name", "job_location", "source"],
                    fuzzy: {}
                }
            });
        }

        titleTerms.forEach(term => {
            searchStage.compound.should.push({
                text: {
                    query: term,
                    path: "job_title",
                    fuzzy: {}
                }
            });
        });

        if (locationTerms.length > 0) {
            searchStage.compound.filter.push({
                text: {
                    query: locationTerms,
                    path: "job_location"
                }
            });
        }

        if (companyTerms.length > 0) {
            searchStage.compound.filter.push({
                text: {
                    query: companyTerms,
                    path: "company_name"
                }
            });
        }

        if (sourceTerms.length > 0) {
            searchStage.compound.filter.push({
                text: {
                    query: sourceTerms,
                    path: "source"
                }
            });
        }

        if (
            searchStage.compound.should.length === 0 &&
            searchStage.compound.filter.length === 0
        ) {
            const jobs = await Job.find().skip(skip).limit(LIMIT).lean();
            return { jobs, page };
        }

        const jobs = await Job.aggregate([
            { $search: searchStage },
            { $skip: skip },
            { $limit: LIMIT }
        ]);

        return { jobs, page };

    } else {
        const jobs = await Job.find().skip(skip).limit(LIMIT).lean();
        return { jobs, page };
    }
}
