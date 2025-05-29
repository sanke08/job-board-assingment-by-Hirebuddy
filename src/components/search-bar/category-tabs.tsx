
import React, { useState, useEffect, useMemo } from "react";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";



type TabType = "title" | "location";

const tabs: TabType[] = ["title", "location"];

// const WORK_TYPES = ["Remote", "On-site", "Hybrid"];

interface SelectedItemsType {
    title: Set<string>;
    location: Set<string>;
    work_type: Set<string>;
}

const CategoryTabs = ({
    selected,
    onUpdateFilter,
}: {
    selected: SelectedItemsType;
    onUpdateFilter: (category: TabType, value: string, add: boolean) => void;
}) => {
    const [activeTab, setActiveTab] = useState<TabType>("title");
    const [data, setData] = useState<string[]>(TITLE_DATA);
    const [inputValue, setInputValue] = useState("");


    const handleTypeChange = (type: TabType) => {
        if (type === activeTab) return;
        setActiveTab(type);
        // setInputValue("");

        if (type === "title") {
            setData(TITLE_DATA);
        } else if (type === "location") {
            setData(LOCATION_DATA);
        }
    };


    const filteredOptions = useMemo(
        () =>
            data.filter(
                (item) =>
                    !selected[activeTab].has(item) &&
                    item.toLowerCase().includes(inputValue.toLowerCase())
            ),
        [selected, inputValue, data, activeTab]
    );

    const showCustomOption =
        inputValue &&
        !data.includes(inputValue) &&
        !selected[activeTab].has(inputValue);

    const handleSelectTitle = (item: string) => {
        onUpdateFilter(activeTab, item, true);
        setInputValue("");
    };



    return (
        <div className="w-full">
            <Command className="h-full w-full">
                <CommandInput
                    autoFocus={false}
                    placeholder={getPlaceholder(activeTab)}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && inputValue.trim()) {
                            e.preventDefault();
                            if (!selected[activeTab].has(inputValue.trim())) {
                                handleSelectTitle(inputValue.trim());
                            }
                        }
                    }}
                />

                <div className="flex p-1 h-fit justify-between w-full relative items-center bg-neutral-500/10 z-0">
                    {tabs.map((val) => (
                        <Button
                            key={val}
                            variant="outline"
                            onClick={() => handleTypeChange(val)}
                            className={cn(
                                "flex-1 bg-transparent border-none hover:bg-transparent",
                                val === activeTab && "text-[#333333]"
                            )}
                        >
                            {val}
                        </Button>
                    ))}
                    <div
                        className={cn(
                            "bg-white -z-10 absolute w-[49%] h-[80%] rounded-lg transition-all border-neutral-300 border"
                        )}
                        style={{
                            transform:
                                activeTab === "title"
                                    ? "translateX(0)"

                                    : "translateX(100%)",
                        }}
                    />
                </div>

                <CommandGroup className="overflow-y-auto max-h-60 md:max-h-96">
                    {filteredOptions.map((item) => (
                        <CommandItem
                            key={item}
                            value={item}
                            disabled={selected[activeTab].has(item)}
                            onSelect={() => handleSelectTitle(item)}
                        >
                            {item}
                        </CommandItem>
                    ))}

                    {showCustomOption && (
                        <CommandItem
                            key="custom-search"
                            className="cursor-pointer"
                            value={inputValue.trim()}
                            onSelect={() => handleSelectTitle(inputValue.trim())}
                        >
                            Add <span className="font-medium">"{inputValue.trim()}"</span>
                        </CommandItem>
                    )}
                </CommandGroup>
            </Command>
        </div>
    );
};

export default CategoryTabs;







const getPlaceholder = (activeTab: TabType) => {
    switch (activeTab) {
        case "title":
            return "Type to search job titles...";
        case "location":
            return "Type to search locations...";
        default:
            return "Search...";
    }
};




const TITLE_DATA = [
    "AI Engineer",
    "Actuary",
    "Analyst",
    "Architect",
    "Art Director",
    "Assistant Manager",
    "Associate Director",
    "Associate Engineer",
    "Automation Engineer",
    "Biotechnology Associate",
    "Brand Manager",
    "Branch Manager",
    "Business Development",
    "CFD Engineer",
    "Cloud Engineer",
    "Computer Vision Engineer",
    "Content Writer",
    "Copywriter",
    "Creative Director",
    "Cybersecurity Analyst",
    "Data Analyst",
    "Data Engineer",
    "Data Scientist",
    "Database Administrator",
    "Design Engineer",
    "DevOps Engineer",
    "DevSecOps Engineer",
    "Digital Marketing",
    "Director of Engineering",
    "Director of Marketing",
    "Engineer",
    "Engineering Director",
    "Executive Assistant",
    "Fashion Designer",
    "Field Service Engineer",
    "Finance Director",
    "Financial Analyst",
    "Front End Developer",
    "Full Stack Developer",
    "Game Developer",
    "Graphic Designer",
    "HR Executive",
    "Intern",
    "Java Developer",
    "Junior Architect",
    "Legal",
    "Machine Learning Engineer",
    "Manager",
    "Marketing Manager",
    "Mechanical Engineer",
    "Mobile App Developer",
    "Network Administrator",
    "Operations Manager",
    "Photographer",
    "Pipeline Engineer",
    "Principal Engineer",
    "Product Designer",
    "Project Manager",
    "Python Developer",
    "QA Engineer",
    "Research Assistant",
    "Sales Executive",
    "Sales Manager",
    "Senior Engineer",
    "Site Engineer",
    "Social Media Manager",
    "Software Developer",
    "Software Engineer",
    "Software Tester",
    "Supply Chain Analyst",
    "Talent Acquisition Specialist",
    "Technical Support",
    "UI/UX Designer",
    "Video Editor",
    "Web Developer",
    "Windows Administrator"
]



const LOCATION_DATA = [
    "Agasthiswaram",
    "Ahmedabad",
    "Alwar",
    "Andhra Pradesh",
    "Bagalur",
    "Bangalore",
    "Bengaluru",
    "Bhubaneswar",
    "Bokaro",
    "Calcutta",
    "Chandigarh",
    "Chennai",
    "Chorasi",
    "Coimbatore",
    "Dahej",
    "Delhi",
    "Dombivli",
    "Faridabad",
    "Goa",
    "Goregaon",
    "Greater Bengaluru Area",
    "Greater Chennai Area",
    "Greater Delhi Area",
    "Greater Kolkata Area",
    "Gurgaon",
    "Gurugram",
    "Guwahati",
    "Hadapsar",
    "HSR Layout",
    "Hyderabad",
    "India",
    "Indore",
    "Itanagar",
    "Jaipur",
    "Jamnagar",
    "Kalamnuri",
    "Kanwali",
    "Karnataka",
    "Kharadi",
    "Kochi",
    "Kolkata",
    "Kottayam",
    "Madurai",
    "Mahad",
    "Maldah",
    "Marine Drive",
    "Mathura",
    "Mohali",
    "Mumbai",
    "Mumbai Metropolitan Region",
    "Nashik",
    "Navi Mumbai",
    "New Delhi",
    "New Town",
    "Noida",
    "Palghar",
    "Panvel",
    "Patia",
    "Pimpri-Chinchwad",
    "Pune",
    "Remote",
    "Sadar",
    "Serilingampalli",
    "Shivajinagar",
    "Sonipat",
    "Tamil Nadu",
    "Telangana",
    "Thiruvananthapuram",
    "Tiruchchirappalli",
    "Uttar Pradesh",
    "Vadodara",
    "Vagator",
    "Vaishali Nagar",
    "West Bengal",
    "Yerwada"
]
