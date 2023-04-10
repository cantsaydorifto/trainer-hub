import { useSession } from "next-auth/react";
import { Roboto } from "next/font/google";
import styles from "./forum.module.css";
import { UserImage } from "~/components/Navbar";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Loading from "~/components/Loading/Loading";
import { useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

function getRelativeTime(timeStamp: Date) {
  const now = new Date();
  const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    const secondsAgo = Math.floor(secondsPast);
    return secondsAgo > 1
      ? `${secondsAgo} seconds ago`
      : `${secondsAgo} second ago`;
  }
  if (secondsPast < 3600) {
    const minutesAgo = Math.floor(secondsPast / 60);
    return minutesAgo > 1
      ? `${minutesAgo} minutes ago`
      : `${minutesAgo} minute ago`;
  }
  if (secondsPast <= 86400) {
    const hoursAgo = Math.floor(secondsPast / 3600);
    return hoursAgo > 1 ? `${hoursAgo} hours ago` : `${hoursAgo} hour ago`;
  }
  if (secondsPast <= 2628000) {
    const daysAgo = Math.floor(secondsPast / 86400);
    return daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} da ago`;
  }
  if (secondsPast <= 31536000) {
    const monthsAgo = Math.floor(secondsPast / 2628000);
    return monthsAgo > 1 ? `${monthsAgo} months ago` : `${monthsAgo} month ago`;
  }
  if (secondsPast > 31536000) {
    const yearsAgo = Math.floor(secondsPast / 31536000);
    return yearsAgo > 1 ? `${yearsAgo} years ago` : `${yearsAgo} year ago`;
  }
}

type PostManual = {
  _count: {
    likedBy: number;
  };
  id: string;
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
  likedBy?: {
    userId: string;
  }[];
  content: string;
  date: Date;
};

const Post = ({ content }: { content: PostManual }) => {
  const session = useSession();
  const [loginPrompt, setLoginPrompt] = useState<boolean>(false);
  const [likes, setLikes] = useState({
    count: content._count.likedBy,
    liked: content.likedBy ? !!content.likedBy.length : false,
  });

  const { mutate, isLoading } = api.posts.likePost.useMutation();
  const likeHandler = (postId: string) => {
    if (session.status === "unauthenticated") {
      setLoginPrompt(true);
      setTimeout(() => {
        setLoginPrompt(false);
      }, 3000);
      return;
    }
    mutate(postId);
    setLikes((prev) => {
      return {
        count: prev.count + (prev.liked ? -1 : 1),
        liked: !prev.liked,
      };
    });
  };
  return (
    <motion.div layout className={`${checkStyleClass(styles.postBox)}`}>
      <div>
        <img
          src={
            content.author.image ||
            "https://cdn-icons-png.flaticon.com/512/3899/3899618.png"
          }
        />
        <div className={checkStyleClass(styles.userPost)}>
          <div>
            <span>@{content.author.username}</span>
            <span>&middot;</span>
            <span>{getRelativeTime(content.date)}</span>
          </div>
          <p className={styles.postContent}>{content.content}</p>
        </div>
      </div>
      <div>
        {likes.liked ? (
          <motion.button
            disabled={isLoading}
            onClick={() => likeHandler(content.id)}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            key={"liked"}
          >
            <img src="/assets/liked.png" alt="" />
          </motion.button>
        ) : (
          <motion.button
            disabled={isLoading}
            onClick={() => likeHandler(content.id)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            key={"not-liked"}
          >
            <img src="/assets/not-liked.png" alt="" />
          </motion.button>
        )}
        <span>{likes.count}</span>
        <AnimatePresence>
          {loginPrompt && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              Login!!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CreatePost = ({
  addPostHandler,
}: {
  addPostHandler: (post: RouterOutputs["posts"]["createPost"]) => void;
}) => {
  const session = useSession();
  const [post, setPost] = useState<string>("");
  const { mutate, isLoading } = api.posts.createPost.useMutation({
    onSuccess(data) {
      addPostHandler(data);
      setPost("");
    },
  });
  if (!session.data) return null;
  const createPostHandler = () => {
    mutate({ content: post });
  };
  return (
    <motion.div
      layout
      className={`${checkStyleClass(styles.createPost)} ${checkStyleClass(
        styles.postBox
      )}`}
    >
      <div>
        <UserImage />
        <textarea
          value={post}
          className={
            roboto.className + " " + checkStyleClass(styles.postContent)
          }
          maxLength={250}
          onChange={(event) => setPost(event.target.value)}
          placeholder="Say Something!"
        />
      </div>
      <div>
        <button
          disabled={post.length === 0}
          onClick={() => createPostHandler()}
          style={{
            opacity: post.length === 0 ? 0.8 : 1,
            cursor: post.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          post
        </button>
        {isLoading && <p>adding post...</p>}
      </div>
    </motion.div>
  );
};

const emptyUserObject = {
  username: "Loading...",
  avatar: 0,
};

export default function Forum() {
  const [posts, setPosts] = useState<
    | RouterOutputs["posts"]["getAll"]["posts"]
    | RouterOutputs["posts"]["getAllPublic"]["posts"]
  >([]);
  const session = useSession();
  const router = useRouter();
  const [pageInfo, setPageInfo] = useState({
    totalPosts: 0,
    page: 1,
  });
  const [userInfo, setUserInfo] =
    useState<typeof emptyUserObject>(emptyUserObject);
  const { isLoading: userInfoLoading } = api.posts.getUserInfo.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        if (data.avatar === 0 || data.username === "NO_USERNAME_YET") {
          void router.push("/setup");
          return;
        }
        setUserInfo(data);
      },
      enabled: session.status === "authenticated",
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );
  const { isLoading: isLoadingPublic } = api.posts.getAllPublic.useQuery(
    pageInfo.page,
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      enabled: session.status === "unauthenticated",
      onSuccess: (data) => {
        setPosts(data.posts);
        setPageInfo((prev) => {
          return { ...prev, totalPosts: data.postCount };
        });
      },
    }
  );

  const { isLoading: isLoadingPrivate } = api.posts.getAll.useQuery(
    pageInfo.page,
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      enabled: session.status === "authenticated",
      onSuccess: (data) => {
        setPosts(data.posts);
        setPageInfo((prev) => {
          return { ...prev, totalPosts: data.postCount };
        });
      },
    }
  );

  if (
    session.status === "loading" ||
    (session.status === "authenticated" && isLoadingPrivate) ||
    (session.status === "unauthenticated" && isLoadingPublic) ||
    (session.status === "authenticated" &&
      (userInfoLoading || userInfo.username === "Loading..."))
  ) {
    return <Loading />;
  }
  return (
    <>
      <motion.div
        layout
        className={`${roboto.className} ${checkStyleClass(styles.container)}`}
      >
        <CreatePost
          addPostHandler={(newPost) => setPosts((prev) => [newPost, ...prev])}
        />
        {!!posts && posts.map((el) => <Post key={el.id} content={el} />)}
      </motion.div>
      <div className={`${roboto.className} ${checkStyleClass(styles.page)}`}>
        <button
          disabled={pageInfo.page <= 1}
          style={{
            opacity: pageInfo.page > 1 ? 1 : 0,
            cursor: pageInfo.page > 1 ? "pointer" : "default",
          }}
          onClick={() =>
            setPageInfo((prev) => {
              return {
                ...prev,
                page: prev.page - 1,
              };
            })
          }
        >
          prev
        </button>
        <span>Page : {pageInfo.page}</span>
        <button
          disabled={pageInfo.page > Math.floor(pageInfo.totalPosts / 10)}
          style={{
            opacity:
              pageInfo.page <= Math.floor(pageInfo.totalPosts / 10) ? 1 : 0,
            cursor:
              pageInfo.page <= Math.floor(pageInfo.totalPosts / 10)
                ? "pointer"
                : "default",
          }}
          onClick={() =>
            setPageInfo((prev) => {
              return {
                ...prev,
                page: prev.page + 1,
              };
            })
          }
        >
          next
        </button>
      </div>
    </>
  );
}
