"use client";

import { useState, useRef, useMemo } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import SelectedItems from "./selected-items";
import CategoryTabs from "./category-tabs";
import { useRouter, useSearchParams } from "next/navigation";

type TabType = "title" | "location" | "work_type";

type SelectedItemsType = {
    [key in TabType]: Set<string>;
};



export default function SearchBox() {



    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const commandInputRef = useRef<HTMLInputElement>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    // Parse URL params into SelectedItemsType
    const selected = useMemo((): SelectedItemsType => {
        function paramToSet(paramName: string) {
            const val = searchParams.get(paramName) || "";
            return new Set(val.split(",").filter(Boolean));
        }

        return {
            title: paramToSet("title"),
            location: paramToSet("location"),
            work_type: paramToSet("company"), // or whatever you want
        };
    }, [searchParams]);

    // Update URL query params by adding/removing filter values
    function updateFilter(category: TabType, value: string, add: boolean = true) {
        const params = new URLSearchParams(searchParams.toString());
        const key = category === "work_type" ? "company" : category;
        const currentSet = new Set((params.get(key) || "").split(",").filter(Boolean));

        if (add) {
            currentSet.add(value);
        } else {
            currentSet.delete(value);
        }

        if (currentSet.size === 0) {
            params.delete(key);
        } else {
            params.set(key, Array.from(currentSet).join(","));
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    }

    // Remove item example
    function handleRemoveTitle(category: TabType, title: string) {
        updateFilter(category, title, false);
    }

    const handleOpen = () => setOpen(true);

    return (
        <div className="w-full bg-neutral-300/30 rounded-lg" ref={containerRef} >
            <Popover
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (isOpen) {
                        requestAnimationFrame(() => {
                            commandInputRef.current?.focus();
                        });
                    }
                }}
            >
                <PopoverTrigger asChild>
                    <div>
                        <SelectedItems
                            handleRemoveTitle={handleRemoveTitle}
                            open={open}
                            selected={selected}
                            handleOpen={handleOpen}
                        />

                    </div>
                </PopoverTrigger>

                <PopoverContent
                    onPointerDownOutside={(event) => {
                        if (
                            containerRef.current &&
                            !containerRef.current.contains(event.target as Node)
                        ) {
                            setOpen(false);
                        }
                    }}
                    className="p-0 w-[340px] sm:w-[500px]"
                >
                    {/* Pass grouped selected and setSelected */}
                    <CategoryTabs selected={selected} onUpdateFilter={updateFilter} />
                </PopoverContent>
            </Popover>
        </div>
    );
}