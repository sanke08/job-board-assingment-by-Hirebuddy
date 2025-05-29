// import { type NextRequest, NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
// import { Job } from "@/lib/modals"

// const LIMIT = 5


// export async function GET(request: NextRequest) {
//     try {
//         const { searchParams } = new URL(request.url)
//         const page = parseInt(searchParams.get("page") || "1")
//         // const limit = parseInt(searchParams.get("limit") || "10")
//         const skip = (page - 1) * LIMIT

//         const title = searchParams.get("title")
//         const location = searchParams.get("location")
//         const company = searchParams.get("company")
//         const source = searchParams.get("source")
//         const q = searchParams.get("q")

//         function parseMultiTerms(param?: string | null) {
//             if (!param) return [];
//             return param.split(",").map(s => s.trim()).filter(Boolean);
//         }

//         const titleTerms = parseMultiTerms(title);
//         const locationTerms = parseMultiTerms(location);
//         const companyTerms = parseMultiTerms(company);
//         const sourceTerms = parseMultiTerms(source);

//         const andConditions: any[] = []

//         // Handle multi-location as OR inside AND
//         if (locationTerms.length > 0) {
//             andConditions.push({
//                 $or: locationTerms.map(term => ({
//                     job_location: new RegExp(term, "i")
//                 }))
//             });
//         }

//         // Company filter (optional, ANDed)
//         if (companyTerms.length > 0) {
//             andConditions.push({
//                 $or: companyTerms.map(term => ({
//                     company_name: new RegExp(term, "i")
//                 }))
//             });
//         }

//         // Source filter (optional, ANDed)
//         if (sourceTerms.length > 0) {
//             andConditions.push({
//                 $or: sourceTerms.map(term => ({
//                     source: new RegExp(term, "i")
//                 }))
//             });
//         }

//         // Prepare OR conditions for title and global q terms
//         const orConditions: any[] = []

//         if (titleTerms.length > 0) {
//             orConditions.push(...titleTerms.map(term => ({
//                 job_title: new RegExp(term, "i")
//             })))
//         }

//         if (q) {
//             const terms = q.split(" ").filter(Boolean)
//             terms.forEach(term => {
//                 orConditions.push({
//                     $or: [
//                         { job_title: new RegExp(term, "i") },
//                         { job_description: new RegExp(term, "i") },
//                         { company_name: new RegExp(term, "i") },
//                         { job_location: new RegExp(term, "i") },
//                         { source: new RegExp(term, "i") },
//                     ]
//                 })
//             })
//         }

//         // Add OR group for title/q search inside AND
//         if (orConditions.length > 0) {
//             andConditions.push({ $or: orConditions })
//         }

//         // Compose final filter
//         const filter = andConditions.length > 0 ? { $and: andConditions } : {}

//         await connectDB()

//         const jobs = await Job.find(filter).skip(skip).limit(5).lean()
//         // const total = await Job.countDocuments(filter)

//         return NextResponse.json({
//             jobs,
//             // total,
//             page,
//             // totalPages: Math.ceil(total / limit)
//         })

//     } catch (error) {
//         console.error("Search error:", error)
//         return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
//     }
// }


import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/lib/modals";

const LIMIT = 5;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * LIMIT;

        const title = searchParams.get("title");
        const location = searchParams.get("location");
        const company = searchParams.get("company");
        const source = searchParams.get("source");
        const q = searchParams.get("q");

        function parseMultiTerms(param?: string | null) {
            if (!param) return [];
            return param.split(",").map(s => s.trim()).filter(Boolean);
        }

        const titleTerms = parseMultiTerms(title);
        const locationTerms = parseMultiTerms(location);
        const companyTerms = parseMultiTerms(company);
        const sourceTerms = parseMultiTerms(source);

        await connectDB();

        const hasSearch =
            q ||
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

            if (q) {
                searchStage.compound.should.push({
                    text: {
                        query: q,
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

            // Final protection: if no "should" and no "filter", skip $search
            if (
                searchStage.compound.should.length === 0 &&
                searchStage.compound.filter.length === 0
            ) {
                const jobs = await Job.find().skip(skip).limit(LIMIT).lean();
                return NextResponse.json({ jobs, page });
            }

            const jobs = await Job.aggregate([
                { $search: searchStage },
                { $skip: skip },
                { $limit: LIMIT }
            ]);

            return NextResponse.json({ jobs, page });

        } else {
            // No search params: fallback to normal query
            const jobs = await Job.find().skip(skip).limit(LIMIT).lean();
            return NextResponse.json({ jobs, page });
        }
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}
