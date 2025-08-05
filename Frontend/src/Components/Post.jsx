function Post() {
  const posts = [
    {
      _id: "p_002",
      title: "Abuse In Family",
      content: "Yesterday when I went to one of my close relative's house and was just playing with my sisters the uncle there did something bad to me",
      image: "https://picsum.photos/id/1011/800/500",
      upvotes: 100,
      downvotes: 10,
      comments: [
        {
          _id: "c_101",
          user: "anonymous_diksha",
          content: "Similar incident happened to me but I couldn't tell anybody because he was my mamu only :(",
        },
        {
          _id: "c_102",
          user: "anonymous_user1",
          content: "At least I am lucky in this case. Nobody in my family is this abusive.",
        }
      ]
    },
    {
      _id: "post_001",
      title: "Unsafe Experience in a Cab",
      content: "Last night, my cab driver took a strange route and refused to stop when I asked. I was really scared.",
      image: "https://picsum.photos/id/1035/800/500",
      upvotes: 54,
      downvotes: 2,
      comments: [
        {
          _id: "c_001",
          user: "HopefulHeart",
          content: "That sounds terrifying. Please report this to the cab service and stay safe.",
        }
      ]
    },
    {
      _id: "post_003",
      title: "Walking Alone at Night",
      content: "I always feel on edge walking alone at night. I keep checking over my shoulder every few seconds.",
      image: "https://picsum.photos/id/1015/800/500",
      upvotes: 89,
      downvotes: 3,
      comments: [
        {
          _id: "c_004",
          user: "StreetSafe",
          content: "I carry a personal safety alarm just in case. Might help you too.",
        },
        {
          _id: "c_005",
          user: "latewalker22",
          content: "Same here. I avoid routes with poor lighting and always share my live location.",
        },
        {
          _id: "c_006",
          user: "Anonymous_Warrior",
          content: "It’s exhausting how common this fear is. Stay strong—we deserve to feel safe.",
        },
        {
          _id: "c_007",
          user: "SecureSteps",
          content: "Try using safety apps that alert your contacts if something happens. They’re helpful.",
        }
      ]
    },
    {
      _id: "post_004",
      title: "Harassed at Workplace",
      content: "My colleague keeps making inappropriate comments and jokes. I’ve reported him once but no strict action was taken.",
      image: "https://picsum.photos/id/1025/800/500",
      upvotes: 72,
      downvotes: 5,
      comments: [
        {
          _id: "c_005",
          user: "silent_warrior",
          content: "You are brave for speaking up. Don’t let it slide—HR should take action.",
        },
        {
          _id: "c_006",
          user: "truth_sharer",
          content: "Same happened to me, I had to escalate to higher authorities. Don’t stop fighting.",
        }
      ]
    },
    {
      _id: "post_005",
      title: "Street Harassment Experience",
      content: "While walking to my tuition class, a group of men followed me and shouted at me. I was terrified.",
      image: "https://picsum.photos/id/1021/800/500",
      upvotes: 95,
      downvotes: 4,
      comments: [
        {
          _id: "c_007",
          user: "no_more_silence",
          content: "That’s horrible. Please carry pepper spray and avoid walking alone when possible.",
        },
        {
          _id: "c_008",
          user: "supportive_sister",
          content: "Happens way too often. You're not alone. Share with someone you trust.",
        }
      ]
    }
  ];


  return (
    <div className="grid gap-12 max-w-5xl mx-auto mt-10">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-[#7D37A5]/90 rounded-2xl shadow-lg p-6 space-y-4 backdrop-blur-md text-white"
        >
          <h2 className="text-3xl font-bold text-[#FAD2CF]">{post.title}</h2>
          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-cover rounded-xl shadow-md"
          />
          <p className="text-[#FAF3F0] text-lg leading-relaxed">{post.content}</p>

          {/* Reactions */}
          <div className="flex gap-6 items-center text-sm text-[#E8DFF5] mt-2">
            <button>👍 {post.upvotes}</button>
            <button>👎 {post.downvotes}</button>
          </div>

          {/* Comments */}
          <div className="mt-4">
            <h3 className="font-semibold text-xl text-[#E8DFF5] mb-2">Comments</h3>
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-[#5E548E] p-3 rounded-xl text-sm text-[#FAD2CF] shadow-sm"
                >
                  <p>
                    <span className="font-semibold text-white">@{comment.user}:</span>{" "}
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Post;
