import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Job } from "@/lib/modals"

const LIMIT = 5


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        // const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * LIMIT

        const title = searchParams.get("title")
        const location = searchParams.get("location")
        const company = searchParams.get("company")
        const source = searchParams.get("source")
        const q = searchParams.get("q")

        function parseMultiTerms(param?: string | null) {
            if (!param) return [];
            return param.split(",").map(s => s.trim()).filter(Boolean);
        }

        const titleTerms = parseMultiTerms(title);
        const locationTerms = parseMultiTerms(location);
        const companyTerms = parseMultiTerms(company);
        const sourceTerms = parseMultiTerms(source);

        const andConditions: any[] = []

        // Handle multi-location as OR inside AND
        if (locationTerms.length > 0) {
            andConditions.push({
                $or: locationTerms.map(term => ({
                    job_location: new RegExp(term, "i")
                }))
            });
        }

        // Company filter (optional, ANDed)
        if (companyTerms.length > 0) {
            andConditions.push({
                $or: companyTerms.map(term => ({
                    company_name: new RegExp(term, "i")
                }))
            });
        }

        // Source filter (optional, ANDed)
        if (sourceTerms.length > 0) {
            andConditions.push({
                $or: sourceTerms.map(term => ({
                    source: new RegExp(term, "i")
                }))
            });
        }

        // Prepare OR conditions for title and global q terms
        const orConditions: any[] = []

        if (titleTerms.length > 0) {
            orConditions.push(...titleTerms.map(term => ({
                job_title: new RegExp(term, "i")
            })))
        }

        if (q) {
            const terms = q.split(" ").filter(Boolean)
            terms.forEach(term => {
                orConditions.push({
                    $or: [
                        { job_title: new RegExp(term, "i") },
                        { job_description: new RegExp(term, "i") },
                        { company_name: new RegExp(term, "i") },
                        { job_location: new RegExp(term, "i") },
                        { source: new RegExp(term, "i") },
                    ]
                })
            })
        }

        // Add OR group for title/q search inside AND
        if (orConditions.length > 0) {
            andConditions.push({ $or: orConditions })
        }

        // Compose final filter
        const filter = andConditions.length > 0 ? { $and: andConditions } : {}

        await connectDB()

        const jobs = await Job.find(filter).skip(skip).limit(5).lean()
        // const total = await Job.countDocuments(filter)

        return NextResponse.json({
            jobs,
            // total,
            page,
            // totalPages: Math.ceil(total / limit)
        })

    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
    }
}



// import { type NextRequest, NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
// import { Job } from "@/lib/modals"

// export async function GET(request: NextRequest) {
//     try {
//         const { searchParams } = new URL(request.url)
//         const page = parseInt(searchParams.get("page") || "1")
//         const limit = parseInt(searchParams.get("limit") || "10")
//         const skip = (page - 1) * limit

//         const title = searchParams.get("title")
//         const location = searchParams.get("location")
//         const company = searchParams.get("company")
//         const source = searchParams.get("source")
//         const q = searchParams.get("q")

//         await connectDB()

//         const orConditions: any[] = []

//         // OR-based partial match
//         if (title) {
//             const terms = title.split(" ").filter(Boolean)
//             orConditions.push(
//                 ...terms.map(term => ({
//                     job_title: new RegExp(term, "i")
//                 }))
//             )
//         }

//         if (location) {
//             const terms = location.split(" ").filter(Boolean)
//             orConditions.push(
//                 ...terms.map(term => ({
//                     job_location: new RegExp(term, "i")
//                 }))
//             )
//         }

//         if (company) {
//             const terms = company.split(" ").filter(Boolean)
//             orConditions.push(
//                 ...terms.map(term => ({
//                     company_name: new RegExp(term, "i")
//                 }))
//             )
//         }

//         if (source) {
//             const terms = source.split(" ").filter(Boolean)
//             orConditions.push(
//                 ...terms.map(term => ({
//                     source: new RegExp(term, "i")
//                 }))
//             )
//         }

//         // if (q) {
//         //     const terms = q.split(" ").filter(Boolean)
//         //     orConditions.push(
//         //         ...terms.map(term => ({
//         //             $or: [
//         //                 { job_title: new RegExp(term, "i") },
//         //                 { job_description: new RegExp(term, "i") },
//         //                 { company_name: new RegExp(term, "i") },
//         //                 { job_location: new RegExp(term, "i") },
//         //                 { source: new RegExp(term, "i") }
//         //             ]
//         //         }))
//         //     )
//         // }

//         const filter = orConditions.length > 0 ? { $or: orConditions } : {}

//         const jobs = await Job.find(filter).skip(skip).limit(limit).lean()
//         const total = await Job.countDocuments(filter)

//         return NextResponse.json({
//             jobs,
//             total,
//             page,
//             totalPages: Math.ceil(total / limit)
//         })

//     } catch (error) {
//         console.error("Search error:", error)
//         return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
//     }
// }
