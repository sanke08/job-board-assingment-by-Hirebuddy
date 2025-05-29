
"use client"
import SearchBox from "./search-box";
import UploadResume from "./upload-resume";

const SearchBar = () => {

    return (
        <div className=" sticky top-0 bg-background rounded-lg overflow-hidden border border-neutral-300 flex flex-col-reverse lg:flex-row  md:gap-4 gap-2 md:p-4 p-2">
            <div className="w-full ">
                <h1 className="text-xl font-semibold mb-2">Search for Job Titles</h1>
                <SearchBox />
            </div>

            <UploadResume />
        </div>
    );
};

export default SearchBar;
