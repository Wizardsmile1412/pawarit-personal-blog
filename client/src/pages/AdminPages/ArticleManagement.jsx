import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit, Trash2, PlusCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/websection/AdminSidebar";

export function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = ["Cat", "Inspiration", "General"];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const limit = 6;

  const getArticles = async (page = 1, category = "") => {
    try {
      const params = {
        page: page,
        limit: limit,
      };

      if (category) {
        params.category = category;
      }

      const response = await axios.get(
        "https://blog-post-project-api.vercel.app/posts",
        { params }
      );

      console.log(response.data);
      setArticles(response.data.posts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    getArticles(1, selectedCategory);
  }, [selectedCategory]);

  //Search for articles with debounce
  const searchArticles = useMemo(
    () =>
      debounce(async (term, page = 1, category = "") => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm && !category) {
          setSearchResults([]);
          setIsSearching(false);
          setSearchCurrentPage(1);
          setSearchTotalPages(1);
          return;
        }

        setIsSearching(true);
        try {
          const params = {
            page: page,
            limit: limit,
          };

          if (trimmedTerm) {
            params.keyword = trimmedTerm;
          }

          if (category) {
            params.category = category;
          }

          const response = await axios.get(
            "https://blog-post-project-api.vercel.app/posts",
            { params }
          );

          setSearchResults(response.data.posts || []);
          setSearchCurrentPage(response.data.currentPage || 1);
          setSearchTotalPages(response.data.totalPages || 1);
        } catch (error) {
          console.error(`Search error: ${error}`);
          setSearchResults([]);
          setSearchCurrentPage(1);
          setSearchTotalPages(1);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchCurrentPage(1); 
    searchArticles(value, 1, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    const actualCategory = category === "all" ? "" : category;
    setSelectedCategory(actualCategory);
    setCurrentPage(1);
    setSearchCurrentPage(1);

    // If there's a search term, perform search with new category
    if (searchTerm.trim()) {
      searchArticles(searchTerm, 1, actualCategory);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (searchTerm.trim()) {
      setSearchCurrentPage(page);
      searchArticles(searchTerm, page, selectedCategory);
    } else {
      setCurrentPage(page);
      getArticles(page, selectedCategory);
    }
  };

  const handlePrevPage = () => {
    const prevPage = searchTerm.trim()
      ? searchCurrentPage - 1
      : currentPage - 1;
    if (prevPage >= 1) {
      handlePageChange(prevPage);
    }
  };

  const handleNextPage = () => {
    const nextPage = searchTerm.trim()
      ? searchCurrentPage + 1
      : currentPage + 1;
    const maxPages = searchTerm.trim() ? searchTotalPages : totalPages;
    if (nextPage <= maxPages) {
      handlePageChange(nextPage);
    }
  };

  // Determine which articles to display and pagination info
  const articlesToDisplay = searchTerm.trim() ? searchResults : articles;
  const displayCurrentPage = searchTerm.trim()
    ? searchCurrentPage
    : currentPage;
  const displayTotalPages = searchTerm.trim() ? searchTotalPages : totalPages;

  console.log(articlesToDisplay);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20 flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Article management
          </h1>
          <button
            onClick={() => navigate("/create-article")}
            className="flex items-center bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 hover:cursor-pointer"
          >
            <PlusCircle size={20} className="mr-2" />
            Create article
          </button>
        </header>

        <div className="px-20 py-10">
          <div className="flex justify-between mb-6">
            <div className="w-1/3 relative">
              <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <div className="relative">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center text-gray-600">
                  Status
                  <ChevronDown size={18} className="ml-2" />
                </button>
              </div>

              <div className="relative">
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-[180px] px-4 py-2 min-h-[42px] text-base bg-white border border-gray-300 rounded-md flex items-center text-gray-600">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Categories</SelectItem>
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

          <div className="bg-white rounded-md shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-4 border-b border-gray-200 text-left text-gray-500 font-medium">
              <div className="col-span-8 px-2">Article title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Table Content */}
            {articlesToDisplay.length > 0 ? (
              articlesToDisplay.map((article, index) => (
                <div
                  key={article.id}
                  className={`grid grid-cols-12 p-4 border-b border-gray-100 items-center ${
                    index % 2 === 0
                      ? "bg-[var(--color-background)]"
                      : "bg-[var(--color-brown-200)]"
                  }`}
                >
                  <div className="col-span-8 font-medium text-gray-800 px-2">
                    {article.title}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {article.category}
                  </div>
                  <div className="col-span-1">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-green-500">
                        {article.status || "Published"}{" "}
                      </span>
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end items-center">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 ml-2 text-gray-400 hover:text-gray-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mr-2"></div>
                    Searching...
                  </div>
                ) : searchTerm.trim() || selectedCategory ? (
                  `No articles found ${
                    searchTerm.trim() ? `for "${searchTerm}"` : ""
                  } ${
                    selectedCategory ? `in category "${selectedCategory}"` : ""
                  }`
                ) : (
                  "No articles available"
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {displayTotalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing page {displayCurrentPage} of {displayTotalPages}
                {selectedCategory && ` in ${selectedCategory} category`}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={displayCurrentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(5, displayTotalPages) },
                    (_, i) => {
                      let pageNum;
                      if (displayTotalPages <= 5) {
                        pageNum = i + 1;
                      } else if (displayCurrentPage <= 3) {
                        pageNum = i + 1;
                      } else if (displayCurrentPage >= displayTotalPages - 2) {
                        pageNum = displayTotalPages - 4 + i;
                      } else {
                        pageNum = displayCurrentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            pageNum === displayCurrentPage
                              ? "bg-black text-white border-black"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={displayCurrentPage === displayTotalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreateArticle() {
  const [articleData, setArticleData] = useState({
    title: "",
    category: "",
    authorName: "Pawarit S.",
    introduction: "",
    content: "",
    thumbnail: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAsDraft = () => {
    console.log("Saving as draft:", articleData);
    // Implement save as draft functionality
  };

  const handleSaveAndPublish = () => {
    console.log("Publishing:", articleData);
    // Implement save and publish functionality
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20 flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800 inline-block">
            Create article
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSaveAsDraft}
              className="flex items-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full shadow-sm hover:bg-gray-50"
            >
              Save as draft
            </button>
            <button
              onClick={handleSaveAndPublish}
              className="flex items-center bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700"
            >
              Save and publish
            </button>
          </div>
        </header>

        <div className="px-20 py-10">
          <div className="mb-8">
            <h2 className="text-gray-600 mb-3">Thumbnail image</h2>
            <div className="flex flex-row gap-6 justify-start w-[780px] items-end">
              <div className="bg-gray-200 border border-gray-200 rounded-md w-120 h-60 flex items-center justify-center mb-2">
                {articleData.thumbnail ? (
                  <img
                    src={URL.createObjectURL(articleData.thumbnail)}
                    alt="Thumbnail preview"
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <button className=" bg-white border border-gray-400 rounded-full h-12 w-65 px-4 py-2 text-gray-700 mb-2 hover:bg-gray-50">
                Upload thumbnail image
              </button>
            </div>
          </div>

          <div className="mb-6 w-[480px]">
            <label htmlFor="category" className="block text-gray-600 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={articleData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Science">Science</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-4 top-3.5 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          <div className="mb-6 w-[480px]">
            <label htmlFor="authorName" className="block text-gray-600 mb-2">
              Author name
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={articleData.authorName}
              className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              readOnly
            />
          </div>

          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-600 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Article title"
              value={articleData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="introduction" className="block text-gray-600 mb-2">
              Introduction (max 120 letters)
            </label>
            <textarea
              id="introduction"
              name="introduction"
              placeholder="Introduction"
              value={articleData.introduction}
              onChange={handleInputChange}
              maxLength={120}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-600 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Content"
              value={articleData.content}
              onChange={handleInputChange}
              rows={10}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // const getCategories = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://blog-post-project-api.vercel.app/categories"
  //     );
  //     console.log(response.data);
  //     setCategories(response.data.categories || []);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  useEffect(() => {
    // getCategories();
    // Mock data for demonstration
    const mockData = [
      { id: 1, name: "Technology" },
      { id: 2, name: "Health" },
      { id: 3, name: "Business" },
      { id: 4, name: "Science" },
    ];
    setCategories(mockData);
  }, []);

  // const handleDeleteCategory = async (id) => {
  //   try {
  //     await axios.delete(`https://blog-post-project-api.vercel.app/categories/${id}`);
  //     getCategories(); // Refresh the categories list
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //   }
  // };

  // const handleEditCategory = (id) => {
  //   navigate(`/edit-category/${id}`);
  // };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20 flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800 inline-block">
            Category management
          </h1>
          <button
            onClick={() => navigate("/create-category")}
            className="flex items-center bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 hover:cursor-pointer"
          >
            <PlusCircle size={20} className="mr-2" />
            Create category
          </button>
        </header>

        <div className="px-20 py-10">
          <div className="w-1/3 relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          <div className="bg-white rounded-md shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-4 border-b border-gray-200 text-left text-gray-500 font-medium">
              <div className="col-span-12 px-2">Category</div>
            </div>

            {/* Table Content */}
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="grid grid-cols-12 p-4 border-b border-gray-100 items-center"
              >
                <div className="col-span-10 font-medium text-gray-800 px-2">
                  {category.name}
                </div>
                <div className="col-span-2 flex justify-end items-center">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    // onClick={() => handleEditCategory(category.id)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="p-1 ml-2 text-gray-400 hover:text-gray-600"
                    // onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No categories found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateCategory() {
  const [categoryName, setCategoryName] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!categoryName.trim()) {
    //   setError("Category name is required");
    //   return;
    // }

    // setIsSubmitting(true);
    // setError("");

    // try {
    //   await axios.post("https://blog-post-project-api.vercel.app/categories", {
    //     name: categoryName.trim()
    //   });

    //   // Navigate back to category management page after successful creation
    //   navigate("/category-management");
    // } catch (error) {
    //   console.error("Error creating category:", error);
    //   setError(error.response?.data?.message || "Failed to create category");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20 flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800 inline-block">
            Create category
          </h1>
          <button
            onClick={handleSubmit}
            // disabled={isSubmitting}
            className="bg-gray-900 text-white px-8 py-2 rounded-full shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </header>

        <div className="px-20 py-10 w-130">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="categoryName"
                className="block text-gray-700 mb-3"
              >
                Category name
              </label>
              <input
                id="categoryName"
                type="text"
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {/* {error && (
                <p className="mt-2 text-red-600 text-sm">{error}</p>
              )} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
