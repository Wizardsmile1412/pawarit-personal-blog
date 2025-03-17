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

  function BlogCard({image, category, title, description, author, date}) {
    return (
      <div className="flex flex-col gap-4">
        <a href="#" className="relative h-[212px] sm:h-[360px]">
          <img className="w-full h-full object-cover rounded-md" src={image} alt={title}/>
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{category}
            </span>
          </div>
          <a href="#" >
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
            {title}
            </h2>
          </a>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {description}</p>
          <div className="flex items-center text-sm">
            <img className="w-8 h-8 rounded-full mr-2" src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Tomson P." />
            <span>{author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{date}</span>
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
      <BlogCard
           image={blogPosts[0].image}
           category={blogPosts[0].category}
           title={blogPosts[0].title}
           description={blogPosts[0].description}
           author={blogPosts[0].author}
           date={blogPosts[0].date}
         />
         <BlogCard
           image={blogPosts[1].image}
           category={blogPosts[1].category}
           title={blogPosts[1].title}
           description={blogPosts[1].description}
           author={blogPosts[1].author}
           date={blogPosts[1].date}
         />
         <BlogCard
           image={blogPosts[2].image}
           category={blogPosts[2].category}
           title={blogPosts[2].title}
           description={blogPosts[2].description}
           author={blogPosts[2].author}
           date={blogPosts[2].date}
         />
         <BlogCard
           image={blogPosts[3].image}
           category={blogPosts[3].category}
           title={blogPosts[3].title}
           description={blogPosts[3].description}
           author={blogPosts[3].author}
           date={blogPosts[3].date}
         />
         <BlogCard
           image={blogPosts[4].image}
           category={blogPosts[4].category}
           title={blogPosts[4].title}
           description={blogPosts[4].description}
           author={blogPosts[4].author}
           date={blogPosts[4].date}
         />
         <BlogCard
           image={blogPosts[5].image}
           category={blogPosts[5].category}
           title={blogPosts[5].title}
           description={blogPosts[5].description}
           author={blogPosts[5].author}
           date={blogPosts[5].date}
         />
      </div>


    </div>
  );
}

export default ArticleSection;
