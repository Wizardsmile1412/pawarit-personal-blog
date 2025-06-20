import { useState, useEffect, useMemo, useRef } from "react";
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
import axiosInstance from "@/api/axiosInstance";
import BlogCard from "./BlogCard";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setLoading] = useState(false);

  // New states for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [categories, setCategories] = useState(["Highlight"]);

  async function fetchCategories() {
    try {
      const response = await axiosInstance.get("/posts/categories");
      const databaseCategories =
        response.data.map((category) => category.name) || [];
      setCategories(["Highlight", ...databaseCategories]);
    } catch (error) {
      console.error(`Error fetching categories: ${error}`);
    }
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  async function getArticles(page, category) {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: 6,
      };

      if (category && category !== "Highlight") {
        params.category = category;
      }

      const response = await axiosInstance.get("/posts", { params });


      const responseData = response.data;
      const postsArray = responseData.posts || [];

      if (page === 1) {
        setPosts(postsArray);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...postsArray]);
      }

      setTotalPages(responseData.totalPages || 0);
    } catch (error) {
      console.error(`Fetching error: ${error}`);
      if (page === 1) {
        setPosts([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Search for articles with debounce
  const searchArticles = useMemo(
    () =>
      debounce(async (term) => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);
        try {
          const response = await axiosInstance.get("/posts", {
            params: {
              keyword: trimmedTerm,
              limit: 10,
            },
          });
          setSearchResults(response.data.posts || []);
        } catch (error) {
          console.error(`Search error: ${error}`);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    searchArticles(value);
  };

  // Handle clicking on a search result
  const handleResultClick = (postId) => {
    setShowDropdown(false);
    setSearchTerm("");
    navigate(`/post/${postId}`);
  };

  useEffect(() => {
    setCurrentPage(1);
    setPosts([]);
    getArticles(1, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // Only fetch if we're not on page 1 (which is already handled by the category change)
    if (currentPage > 1) {
      getArticles(currentPage, selectedCategory);
    }
  }, [currentPage, selectedCategory]);

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="w-full sm:px-30 sm:flex sm:flex-col sm:gap-12 sm:mb-25">
      <div className="flex flex-col sm:gap-8">
        <h2 className="heading-3 !text-[var(--color-brown-600)] p-4 sm:p-0">
          Latest articles
        </h2>
        {/* Responsive Container */}
        <div className=" bg-[var(--color-brown-200)] rounded-lg p-4 flex flex-col sm:h-22 sm:flex-row sm:justify-between sm:items-center sm:py-4 sm:px-6">
          {/* Categories - Buttons on Desktop, Dropdown on Mobile */}
          <div className="w-full sm:w-auto">
            {/* Buttons for Desktop */}
            <div className="hidden sm:flex space-x-2">
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-90 ">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm && setShowDropdown(true)}
              className="w-full h-[48px] !text-[var(--color-brown-400)] px-4 py-2 rounded-lg bg-white border border-brown-300 !focus:outline-none !focus:ring-0 !focus:border-transparent"
            />
            <IoSearch className="absolute w-5 h-5 right-4 top-4 text-[var(--color-brown-400)]" />

            {/* Autocomplete Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {isSearching ? (
                  <div className="px-4 py-2 text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((post) => (
                    <div
                      key={post.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(post.id)}
                    >
                      {post.title}
                    </div>
                  ))
                ) : searchTerm ? (
                  <div className="px-4 py-2 text-gray-500">
                    No results found
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Dropdown for Mobile */}
          <div className="w-full flex flex-col gap-1 mt-4 sm:hidden">
            <p className="body-1 !text-[var(--color-brown-400)] sm:hidden">
              Category
            </p>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="block"
            >
              <SelectTrigger className="w-full !h-12 py-3 pr-3 pl-4 border border-[var-(--color-brown-300)] sm:hidden bg-white !text-[var(--color-brown-400)]">
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
        </div>
      </div>

      {/* Blog Card */}
      <div className="grid grid-cols-1 gap-12 pt-6 pb-20 px-4 md:grid-cols-2 md:p-0">
        {posts.length === 0 && !isLoading ? (
          <p className="text-[var(--color-gray-600)] text-center col-span-2 text-2xl my-5">
            No articles found in this category.
          </p>
        ) : (
          posts.map((item, index) => <BlogCard key={index} post={item} />)
        )}
        {/* ViewMore Mobile*/}
        {currentPage < totalPages && (
          <div className="flex flex-row justify-center mt-9 mb-4 md:hidden">
            <button
              className="body-1 !text-[var(--color-brown-600)] h-15 w-40 min-w-40 hover:underline hover:cursor-pointer"
              onClick={handleViewMore}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View More"}
            </button>
          </div>
        )}
      </div>
      {/* ViewMore Desktop*/}
      {currentPage < totalPages && (
        <div className="hidden md:flex flex-row justify-center mt-10">
          <button
            className="body-1 !text-[var(--color-brown-600)] h-15 w-40 min-w-40 hover:underline hover:cursor-pointer"
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
