import { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


const categories = ["Highlight", "Coffee", "Inspiration", "General"];
function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");

  return (
    <div className="py-6 px-20">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Latest articles</h2>

      {/* Responsive Container */}
      <div className=" bg-[#EFEEEB] rounded-lg p-4 flex flex-col space-y-4 sm:h-20 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
        
        {/* Categories - Buttons on Desktop, Dropdown on Mobile */}
        <div className="w-full sm:w-auto">
          <label className="text-gray-500 block sm:hidden">Category</label>
          
          {/* Buttons for Desktop */}
          <div className="hidden sm:flex space-x-4">
            {categories.map((category) => (
              <button
              key={category}
              className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-300 hover:text-gray-900 transition"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>            
            ))}
          </div>

        </div>

        {/* Search Bar (Always on the Right) */}
        <div className="relative w-full sm:w-1/3">
          <Input type="text" placeholder="Search"
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 !focus:outline-none !focus:ring-0 !focus:border-transparent"/>
          <IoSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        {/* Dropdown for Mobile */}
        <Select className="block">
            <SelectTrigger className="w-full sm:hidden bg-white text-gray-400">
                <SelectValue placeholder="Highlight" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Highlight</SelectLabel>
                <SelectItem value="Coffee">Coffee</SelectItem>
                <SelectItem value="Inspiration">Inspiration</SelectItem>
                <SelectItem value="General">General</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        
      </div>
    </div>
  );
}

export default ArticleSection;
