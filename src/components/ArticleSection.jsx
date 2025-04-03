import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import BlogCard from "./BlogCard";

const categories = ["Highlight", "Cat", "Inspiration", "General"];
function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setLoading] = useState(false);

  async function getArticles(page, category) {
    setLoading(true);
    try {
      const categoryParam = category === "Highlight" ? "" : category;

      const response = await axios.get(
        "https://blog-post-project-api.vercel.app/posts",
        {
          params: {
            page: page,
            limit: 6,
            category: categoryParam,
          },
        }
      );

      // If it's the first page, replace all posts
      // Otherwise, append the new posts to the existing ones
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      }

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(`Fetching error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Reset to page 1 whenever category changes
    setCurrentPage(1);
    setPosts([]);
    getArticles(1, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // Only fetch if we're not on page 1 (which is already handled by the category change)
    if (currentPage > 1) {
      getArticles(currentPage, selectedCategory);
    }
  }, [currentPage]);

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="my-20 px-20">
      <h2 className="text-xl font-bold text-gray-900">Latest articles</h2>

      {/* Responsive Container */}
      <div className=" bg-[#EFEEEB] rounded-lg p-4 my-10 flex flex-col space-y-4 sm:h-22 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
        {/* Categories - Buttons on Desktop, Dropdown on Mobile */}
        <div className="w-full sm:w-auto">
          <label className="text-gray-500 block sm:hidden">Category</label>

          {/* Buttons for Desktop */}
          <div className="hidden sm:flex space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                disabled={selectedCategory === category}
                className={`px-4 py-2 rounded-lg text-gray-500 transition ${
                  selectedCategory === category
                    ? "bg-gray-300 text-gray-900"
                    : "hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar (Always on the Right) */}
        <div className="relative w-full sm:w-1/3">
          <Input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 !focus:outline-none !focus:ring-0 !focus:border-transparent"
          />
          <IoSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        {/* Dropdown for Mobile */}
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="block"
        >
          <SelectTrigger className="w-full sm:hidden bg-white text-gray-500">
            <SelectValue placeholder="Highlight" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {posts.length === 0 && !isLoading ? (
          <p className="text-gray-500 text-center col-span-2 text-2xl">
            No articles found in this category.
          </p>
        ) : (
          posts.map((item, index) => <BlogCard key={index} post={item} />)
        )}
      </div>

      {currentPage < totalPages && (
        <div className="flex flex-row justify-center mt-9 mb-4">
          <button
            className="text-2xl h-15 w-40 min-w-40 hover:underline hover:cursor-pointer"
            onClick={handleViewMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ArticleSection;
