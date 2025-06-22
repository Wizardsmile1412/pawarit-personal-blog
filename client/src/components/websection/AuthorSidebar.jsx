import logo from '../../assets/logo.png'

function AuthorSidebar({author}) {
  if (!author) return null; // Prevent rendering if data isn't ready
  return (
    /* Author Sidebar */
    <div className="w-full md:w-72 h-fit sticky top-6 mt-6">
    <div className="bg-[#EFEEEB] p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          <img src={author.profile_pic || logo} alt="Author picture" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Author</p>
          <h3 className="font-semibold text-gray-700">{author.name}</h3>
        </div>
      </div>
      <hr className="border-gray-300 mb-5" />
      <p className="text-gray-600">
        {author.bio}
      </p>
    </div>
  </div>
  );
}

export default AuthorSidebar;