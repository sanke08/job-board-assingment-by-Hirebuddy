import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Location } from "@/lib/modals";


let cached: string | any[] = []

export async function GET(request: Request) {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
        if (cached.length) return NextResponse.json(cached, { status: 200 });
        const locations = await Location.aggregate([
            { $sample: { size: 20 } }
        ]).exec()
        const result = locations.map((loc) => loc.name);
        cached = result
        return NextResponse.json(result, { status: 200 });
    }

    try {
        // Find locations with case-insensitive partial match using regex
        const locations = await Location.find({
            name: { $regex: q, $options: "i" },
        })
            .limit(20)
            .sort({ name: 1 }) // Sort alphabetically
            .lean();

        // Map to array of strings (names only)
        const result = locations.map((loc) => loc.name);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
