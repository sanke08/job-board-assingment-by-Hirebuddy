// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { JobTitle } from "@/lib/modals";


// let cached: string | any[] = []


// export async function GET(request: Request) {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const q = searchParams.get("q")?.trim() || "";

//     if (!q) {
//         if (cached.length) return NextResponse.json(cached, { status: 200 });
//         const titles = await JobTitle.aggregate([
//             { $sample: { size: 20 } }
//         ]).exec()
//         const result = titles.map((t) => t.name);
//         cached = result
//         return NextResponse.json(result, { status: 200 });
//     }

//     try {
//         // Find job titles with case-insensitive partial match using regex
//         const titles = await JobTitle.find({
//             name: { $regex: q, $options: "i" },
//         })
//             .limit(20)
//             .sort({ name: 1 }) // Sort alphabetically
//             .lean();

//         // Map to array of strings (names only)
//         const result = titles.map((t) => t.name);

//         return NextResponse.json(result, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching job titles:", error);
//         return NextResponse.json({ error: "Failed to fetch job titles" }, { status: 500 });
//     }
// }
