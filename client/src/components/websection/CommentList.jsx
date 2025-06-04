import logo from '../../assets/logo.png'
// Sample comments data (replace avatar URLs and text as needed)
const comments = [
    {
      id: 1,
      name: 'Jacob Lash',
      avatar: '',
      date: '12 September 2024 at 18:30',
      text: 'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.'
    },
    {
      id: 2,
      name: 'Ahri',
      avatar: '',
      date: '12 September 2024 at 18:30',
      text: 'Such a great read! I’ve always wondered why my cat slow blinks at me—now I know it’s her way of showing trust!'
    },
    {
      id: 3,
      name: 'Mimi mama',
      avatar: '',
      date: '12 September 2024 at 18:30',
      text: 'This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!'
    }
  ];

  const CommentList = () => {
    return (
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <img 
                src={comment.avatar || logo} 
                alt={comment.name} 
                className="w-11 h-11 rounded-full object-cover" 
              />
              <div className="flex flex-col">
                <span className="text-[#43403B] font-semibold text-lg sm:text-xl">{comment.name}</span>
                <span className="text-[#75716B] font-medium text-xs sm:text-sm">{comment.date}</span>
              </div>
            </div>
            <p className="text-[#75716B] font-medium text-sm sm:text-base leading-6 sm:leading-7">{comment.text}</p>
            <div className="border-t border-[#DAD6D1]"></div>
          </div>
        ))}
      </div>
    );
  };

  export default CommentList;