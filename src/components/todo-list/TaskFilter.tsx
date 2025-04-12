"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function TaskFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filter = searchParams.get("filter") || "all";

  const handleFilter = (newFilter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", newFilter);
    replace(`${pathname}?${params.toString()}`);
  };

  const filterLabels = {
    all: "All Tasks",
    pending: "Pending",
    completed: "Completed",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListFilter className="h-4 w-4" />
          {filterLabels[filter as keyof typeof filterLabels]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleFilter("all")}>
          All Tasks
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilter("pending")}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilter("completed")}>
          Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
