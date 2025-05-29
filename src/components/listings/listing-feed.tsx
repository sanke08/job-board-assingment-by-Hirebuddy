"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ListingCard from "./listing-card"
import { Job } from "@/app/page"
import axios from "axios"
import { Loader } from "lucide-react"

const ListingFeed = ({ data, searchParams }: { data: Job[], searchParams: Record<string, string> }) => {
    const page = useRef(2)
    const [newData, setNewData] = useState<Job[]>(data)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const observerRef = useRef<HTMLDivElement | null>(null)

    const loadMoreJobs = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)

        try {
            const query = new URLSearchParams({
                ...searchParams,
                page: page.current.toString(),
            }).toString()


            const res = await axios.get(`/api/jobs/search?${query}`)
            const jobs: Job[] = res.data.jobs

            if (jobs.length > 0) {
                setNewData(prev => [...prev, ...jobs])
                page.current += 1
            } else {
                setHasMore(false)
            }
        } catch (err) {
            console.error("Failed to fetch more jobs", err)
        } finally {
            setLoading(false)
        }
    }, [loading, hasMore, searchParams])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreJobs()
                }
            },
            {
                rootMargin: "50px",
            }
        )

        const currentRef = observerRef.current
        if (currentRef) observer.observe(currentRef)

        return () => {
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [loadMoreJobs])


    useEffect(() => {
        page.current = 2
        setNewData(data)
        setHasMore(true)
    }, [searchParams, data])


    const formatDescription = (description: string) => {

        return JSON.stringify(description
            .split(". ").slice(0, 4))
    }


    return (
        <>
            {newData.map((job) => (
                <ListingCard
                    key={job._id}
                    {...{
                        ...job,
                        job_description: formatDescription(job.job_description),
                    }}
                />
            ))}

            <div ref={observerRef} className="h-10" />
            {loading && <p className="text-center my-4 text-gray-500 mx-auto w-fit"><Loader className="animate-spin" /></p>}
            {!hasMore && <p className="text-center my-4 text-gray-400">No more jobs available.</p>}
        </>
    )
}

export default ListingFeed


