
import { MapPin, Building2, ExternalLink, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/app/page"
import { Suspense } from "react"



const ListingCard = ({ apply_link, company_name, job_description, job_location, job_title, source }: Job) => {

    return (
        <Card className="hover:shadow-lg transition-shadow p-3">
            <CardHeader className=" px-0">
                <div className="space-y-1 w-full flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-900 hover:text-blue-700">{job_title}</CardTitle>
                    <Badge variant="secondary">{source}</Badge>
                </div>
                <div className="md:flex items-center space-x-4 text-gray-600 w-full">
                    <div className="flex items-center space-x-1 w-fit ">
                        <Building2 className="h-4 w-4" />
                        <p className="">{company_name}</p>
                    </div>
                    <div className="flex items-center space-x-1 w-fit">
                        <MapPin className="h-4 w-4" />
                        <p className=" text-sm">{job_location}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className=" p-0">
                {/* <p className="text-gray-700 mb-4 leading-relaxed">{job_description}</p> */}
                <Suspense>
                    <Description job_description={job_description} />
                </Suspense>
                <Separator className="my-1" />
                <div className="flex items-center justify-end">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <a
                            href={apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                        >
                            <span>Apply Now</span>
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ListingCard





const Description = ({ job_description }: { job_description: string }) => {

    const formatDescriptionToBullets = (description: string): string[] => {
        return JSON.parse(description)      // remove empty lines
    }



    const descriptionPoints = formatDescriptionToBullets(job_description)
    return (
        <div className="text-gray-700 mb-4 leading-relaxed">

            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {descriptionPoints.map((point, index) => {
                    if (point.length > 300) return <li key={index}>{point.slice(0, 300)}...</li>
                    return (
                        <li key={index}>{point}.</li>
                    )
                })}
            </ul>
        </div>
    )
}



