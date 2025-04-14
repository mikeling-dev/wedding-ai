"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskFilterProps {
  currentFilter: string;
  currentSort: string;
}

export function TaskFilter({ currentFilter, currentSort }: TaskFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ListFilter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 mr-6 md:mr-12">
        <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleFilterChange("all")}
            className={cn(
              currentFilter === "all" && "bg-primary/10 text-primary"
            )}
          >
            All Tasks
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleFilterChange("pending")}
            className={cn(
              currentFilter === "pending" && "bg-primary/10 text-primary"
            )}
          >
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleFilterChange("completed")}
            className={cn(
              currentFilter === "completed" && "bg-primary/10 text-primary"
            )}
          >
            Completed
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleSortChange("category")}
            className={cn(
              currentSort === "category" && "bg-primary/10 text-primary"
            )}
          >
            Category
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortChange("date")}
            className={cn(
              currentSort === "date" && "bg-primary/10 text-primary"
            )}
          >
            Due Date
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
