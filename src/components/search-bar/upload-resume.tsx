


"use client";

import { useState } from "react";
import { File, Loader, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const UploadResume = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const handleRemoveFile = () => {
        setResumeFile(null);
        setError(null);
    };

    const uploadAndPredict = async (file: File) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await fetch("/api/resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to process resume");

            const data = await response.json();

            const predictedRoles: string[] = data.predictedRoles;



            if (predictedRoles.length > 0) {

                // 🔍 Replace with your actual search logic
                performSearch(predictedRoles);
            } else {
                setError("No roles detected in resume.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };


    const performSearch = (roles: string[]) => {
        const encodedRoles = encodeURIComponent(roles.join(","));
        router.push(`/?title=${encodedRoles}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            uploadAndPredict(file);
        }
    };

    return (
        <div className="w-full lg:w-max border-dashed border-2 border-blue-200 bg-blue-50/50 p-2 md:p-3 rounded-lg space-y-1 md:space-y-2 text-sm">
            {!resumeFile && (
                <p className="text-center opacity-70 text-xs md:text-sm leading-tight w-max mx-auto">
                    Get personalized job recommendations
                </p>
            )}

            <div className="flex flex-col items-center space-y-2 w-full">
                {!resumeFile ? (
                    <>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex items-center justify-center space-x-2 bg-blue-600 text-white w-full md:w-auto px-3 py-2 rounded-md text-xs md:text-sm hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            <span>{loading ? "Uploading..." : "Upload Resume"}</span>
                        </label>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-max gap-2">
                        <File />
                        <p className="text-xs md:text-sm text-gray-600 break-all flex-1">
                            {resumeFile.name.length > 30
                                ? `${resumeFile.name.slice(0, 27)}...`
                                : resumeFile.name}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRemoveFile}
                            className="text-gray-500 hover:text-red-500"
                            aria-label="Remove uploaded resume"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {
                loading && <Loader className="animate-spin mx-auto size-5" />
            }

            {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
            )}
        </div>
    );
};

export default UploadResume;
