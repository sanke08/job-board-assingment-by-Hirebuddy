


// import { type NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { Job } from "@/lib/modals";

// const LIMIT = 5;

// export async function GET(request: NextRequest) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const page = parseInt(searchParams.get("page") || "1");
//         const skip = (page - 1) * LIMIT;

//         const title = searchParams.get("title");
//         const location = searchParams.get("location");
//         const company = searchParams.get("company");
//         const source = searchParams.get("source");
//         const q = searchParams.get("q");

//         function parseMultiTerms(param?: string | null) {
//             if (!param) return [];
//             return param.split(",").map(s => s.trim()).filter(Boolean);
//         }

//         const titleTerms = parseMultiTerms(title);
//         const locationTerms = parseMultiTerms(location);
//         const companyTerms = parseMultiTerms(company);
//         const sourceTerms = parseMultiTerms(source);

//         await connectDB();

//         const hasSearch =
//             q ||
//             titleTerms.length > 0 ||
//             locationTerms.length > 0 ||
//             companyTerms.length > 0 ||
//             sourceTerms.length > 0;

//         if (hasSearch) {
//             const searchStage: {
//                 index: string;
//                 compound: {
//                     should: object[];
//                     filter: object[];
//                 };
//             } = {
//                 index: "default",
//                 compound: {
//                     should: [],
//                     filter: []
//                 }
//             };

//             if (q) {
//                 searchStage.compound.should.push({
//                     text: {
//                         query: q,
//                         path: ["job_title", "job_description", "company_name", "job_location", "source"],
//                         fuzzy: {}
//                     }
//                 });
//             }

//             titleTerms.forEach(term => {
//                 searchStage.compound.should.push({
//                     text: {
//                         query: term,
//                         path: "job_title",
//                         fuzzy: {}
//                     }
//                 });
//             });

//             if (locationTerms.length > 0) {
//                 searchStage.compound.filter.push({
//                     text: {
//                         query: locationTerms,
//                         path: "job_location"
//                     }
//                 });
//             }

//             if (companyTerms.length > 0) {
//                 searchStage.compound.filter.push({
//                     text: {
//                         query: companyTerms,
//                         path: "company_name"
//                     }
//                 });
//             }

//             if (sourceTerms.length > 0) {
//                 searchStage.compound.filter.push({
//                     text: {
//                         query: sourceTerms,
//                         path: "source"
//                     }
//                 });
//             }

//             // Final protection: if no "should" and no "filter", skip $search
//             if (
//                 searchStage.compound.should.length === 0 &&
//                 searchStage.compound.filter.length === 0
//             ) {
//                 const jobs = await Job.find().skip(skip).limit(LIMIT).lean();
//                 return NextResponse.json({ jobs, page });
//             }

//             const jobs = await Job.aggregate([
//                 { $search: searchStage },
//                 { $skip: skip },
//                 { $limit: LIMIT }
//             ]);

//             return NextResponse.json({ jobs, page });

//         } else {
//             // No search params: fallback to normal query
//             const jobs = await Job.find().skip(skip).limit(LIMIT).lean();
//             return NextResponse.json({ jobs, page });
//         }
//     } catch (error) {
//         console.error("Search error:", error);
//         return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
//     }
// }






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




// app/api/jobs/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const result = await fetchJobs({
            page: parseInt(searchParams.get("page") || "1"),
            title: searchParams.get("title") || undefined,
            location: searchParams.get("location") || undefined,
            company: searchParams.get("company") || undefined,
            source: searchParams.get("source") || undefined,
            q: searchParams.get("q") || undefined
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}
