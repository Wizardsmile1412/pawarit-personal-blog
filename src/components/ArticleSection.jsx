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
  import { blogPosts } from '@/data/blogPosts';

  function BlogCard({post}) {
    return (
        <div className="flex flex-col gap-4">
        <a href="#" className="relative h-[212px] sm:h-[360px]">
          <img className="w-full h-full object-cover rounded-md" src={post.image} alt={post.title}/>
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{post.category}
            </span>
          </div>
          <a href="#" >
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
            {post.title}
            </h2>
          </a>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {post.description}</p>
          <div className="flex items-center text-sm">
            <img className="w-8 h-8 rounded-full mr-2" src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Tomson P." />
            <span>{post.author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>

    );
   }
   

const categories = ["Highlight", "Coffee", "Inspiration", "General"];
function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");

  return (
    <div className="my-20 px-20">

      <h2 className="text-xl font-bold text-gray-900">Latest articles</h2>

      {/* Responsive Container */}
      <div className=" bg-[#EFEEEB] rounded-lg p-4 my-10 flex flex-col space-y-4 sm:h-20 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
        
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

      {/* Blog Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {blogPosts.map((item)=>(
          <BlogCard key={item.id} post={item}/>
        ))}
      </div>
    </div>
  );
}

export default ArticleSection;
