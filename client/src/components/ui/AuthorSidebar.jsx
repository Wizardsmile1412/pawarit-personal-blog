import logo from '../../assets/logo.png'

function AuthorSidebar({post}) {
  if (!post || !post.author) return null; // Prevent rendering if data isn't ready
  return (
    /* Author Sidebar */
    <div className="w-full md:w-72 h-fit sticky top-6 mt-6">
    <div className="bg-[#EFEEEB] p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          <img src={post.image || logo} alt="Author picture" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Author</p>
          <h3 className="font-semibold text-gray-700">{post.author}</h3>
        </div>
      </div>
      <hr className="border-gray-300 mb-5" />
      <p className="text-gray-600">
        I am a pet enthusiast and freelance writer who specializes in animal behavior and care. 
        With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
        
        When I'm not writing, I spend time volunteering at my local animal shelter, helping cats 
        find loving homes.
      </p>
    </div>
  </div>
  );
}

export default AuthorSidebar;