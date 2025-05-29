
// app/components/listings.tsx
import { Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ListingFeed from "./listing-feed"
import { fetchJobs } from "@/app/api/jobs/search/route"

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
}

const Listings = async ({ searchParams }: Props) => {


    const stringParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(searchParams)) {
        if (typeof value === "string") {
            stringParams[key] = value;
        } else if (Array.isArray(value)) {
            stringParams[key] = value.join(",");
        }
    }

    const jobsData = await fetchJobs({
        page: stringParams.page ? parseInt(stringParams.page) : 1,
        title: stringParams.title,
        location: stringParams.location,
        company: stringParams.company,
        source: stringParams.source,
        q: stringParams.q,
    });

    const jobs = jobsData.jobs;


    return (
        <div className="space-y-4">
            {jobs?.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">
                            {searchParams.q
                                ? `No jobs found for "${searchParams.q}". Try a different search term.`
                                : "Upload your resume or search for jobs to get started."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <ListingFeed data={jobs} searchParams={stringParams} />
            )}
        </div>
    )
}

export default Listings










// // app/components/listings.tsx
// import axios from "axios"
// import { Briefcase } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import ListingFeed from "./listing-feed"

// type Props = {
//     searchParams: { [key: string]: string }
// }

// const Listings = async ({ searchParams: SEARCH_PARAMS }: Props) => {

//     const searchParams = await SEARCH_PARAMS

//     const finalParams = { ...searchParams, }

//     const stringParams: Record<string, string> = {}

//     Object.entries(finalParams).forEach(([key, value]) => {
//         if (typeof value === "string" || typeof value === "number") {
//             stringParams[key] = String(value)
//         }
//     })

//     const query = new URLSearchParams(stringParams).toString()

//     const { data } = await axios.get(`http://localhost:3000/api/jobs/search?${query}`)


//     const key = data.jobs.map((d) => d.job_title)
//     return (
//         <div className="space-y-4">
//             {data.jobs.length === 0 ? (
//                 <Card>
//                     <CardContent className="text-center py-12">
//                         <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
//                         <p className="text-gray-600">
//                             {searchParams.q
//                                 ? `No jobs found for "${searchParams.q}". Try a different search term.`
//                                 : "Upload your resume or search for jobs to get started."}
//                         </p>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <ListingFeed data={data.jobs} searchParams={stringParams} key={key} />
//             )}
//         </div>
//     )
// }

// export default Listings
