
import React, { useState, useEffect, useMemo } from "react";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LOCATION_DATA, TITLE_DATA } from "@/lib/data";



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



