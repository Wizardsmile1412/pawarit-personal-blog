import { Link } from "react-router-dom";

function BlogCard({ post }) {
  //Convert date to date format dd month year
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/post/${post.id}`}
        className="relative h-[212px] sm:h-[360px]"
      >
        <img
          className="w-full h-full object-cover rounded-md"
          src={post.image}
          alt={post.title}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
            {post.category}
          </span>
        </div>
        <Link to={`/post/${post.id}`}>
          <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
            {post.title}
          </h2>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center text-sm">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Tomson P."
          />
          <span>{post.author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
