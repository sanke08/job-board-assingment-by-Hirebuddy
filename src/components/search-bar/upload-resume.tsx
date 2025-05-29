


"use client";

import { Dock, File, Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button"; // Optional: for consistent style if you're using a design system

const UploadResume = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleRemoveFile = () => {
        setResumeFile(null);
    };

    return (
        <div className="w-full lg:w-max border-dashed border-2 border-blue-200 bg-blue-50/50 p-2 md:p-4 rounded-lg space-y-1 md:space-y-2 text-sm">
            {
                !resumeFile &&
                <p className="text-center opacity-70 text-xs md:text-sm leading-tight w-max mx-auto">
                    Get personalized job recommendations
                </p>
            }

            <div className="flex flex-col items-center space-y-2 w-full ">
                {!resumeFile ? (
                    <>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setResumeFile(file);
                            }}
                            className="hidden"
                            id="resume-upload"
                        />

                        <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex items-center justify-center space-x-2 bg-blue-600 text-white w-full md:w-auto px-3 py-2 rounded-md text-xs md:text-sm hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            <span>Upload Resume</span>
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
        </div>
    );
};

export default UploadResume;
