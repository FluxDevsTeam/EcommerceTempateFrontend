import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { IoIosArrowDown } from "react-icons/io";
  
  export function SortDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-3 w-[121px] bg-white text-black border rounded-2xl border-black flex items-center justify-between cursor-pointer">
            <span>Sort by</span>
            <IoIosArrowDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[121px] bg-white border border-black rounded-2xl mt-1">
          <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 rounded-xl">
            Latest
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 rounded-xl">
            Highest price
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 rounded-xl">
            Lowest price
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  