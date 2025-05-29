import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobTitle, Location } from "@/lib/modals";




export async function GET(request: Request) {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
        return NextResponse.json({}, { status: 200 });
    }

    try {
        const data = await (await Location.find()).map(val => val.name)
        console.log(data)
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching job titles:", error);
        return NextResponse.json({ error: "Failed to fetch job titles" }, { status: 500 });
    }
}



