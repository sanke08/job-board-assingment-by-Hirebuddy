"use client";

import { Edit, Search, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type TabType = "title" | "location" | "work_type";

interface SelectedItemsProps {
    selected: {
        [key in TabType]: Set<string>;
    };
    handleRemoveTitle: (category: TabType, val: string) => void;
    open: boolean;
    handleOpen: () => void;
}

const CATEGORY_STYLES: Record<TabType, string> = {
    title: "bg-blue-100/50 border border-blue-200",
    location: "bg-green-100/50  border border-green-200",
    work_type: "bg-yellow-100/50 border border-yellow-200",
};


const SelectedItems = ({
    selected,
    handleRemoveTitle,
    open,
    handleOpen,
}: SelectedItemsProps) => {
    const hasSelected = Object.values(selected).some((set) => set.size > 0);

    // Flatten selected items into an array of { category, title }
    const allItems: { category: TabType; title: string }[] = [];
    (Object.entries(selected) as [TabType, Set<string>][]).forEach(([category, items]) => {
        items.forEach((title) => {
            allItems.push({ category, title });
        });
    });




    const shownItems = open ? allItems : allItems.slice(0, 5);
    const remainingCount = allItems.length - shownItems.length;

    return (
        <div
            className="w-full min-h-[48px] cursor-pointer flex flex-wrap items-center gap-1 rounded-md p-2"
            onClick={() => handleOpen()}
        >
            {shownItems.map(({ category, title }) => (
                <Badge
                    key={`${category}-${title}`}
                    variant="secondary"
                    className={`flex items-center gap-0 h-9 group ${CATEGORY_STYLES[category]}`}
                >
                    {title}
                    {open && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className=" hover:bg-transparent"
                            aria-label={`Remove ${title}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTitle(category, title);
                            }}
                        >
                            <X />
                        </Button>
                    )}
                </Badge>
            ))}

            {remainingCount > 0 && (
                <p className="text-sm text-muted-foreground px-1">+{remainingCount}</p>
            )}

            {hasSelected && (
                <Badge
                    variant="secondary"
                    className="flex items-center gap-0 h-9 group"
                >
                    <Button size={"icon"} variant={"ghost"} className=" hover:bg-transparent">
                        <Edit />
                    </Button>
                </Badge>
            )}

            {!open && !hasSelected && (
                <span className="text-muted-foreground select-none text-sm px-2 flex gap-2">
                    <Search size={20} />
                    Click to add Search...
                </span>
            )}
        </div>
    );
};


export default SelectedItems