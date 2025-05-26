import React, { useEffect, useState } from 'react';

interface PostI {
  id: string;
  title: string;
  body: string;
  userId: string;
  userName?: string;
}

interface UserI {
  id: string;
  firstName: string;
  lastName: string;
}

const BASE_URL_POSTS = 'https://dummyjson.com/posts';
const BASE_URL_USERS = 'https://dummyjson.com/users';

const Post: React.FC<PostI> = (props) => {
  const { title, body, userName } = props;

  return (
    <div style={{ border: '1px solid #000', padding: '10px', margin: '10px' }}>
      <h4>{userName} said:</h4>
      <div>{title}</div>
      <span>{body}</span>
    </div>
  );
};

const PostsComponent: React.FC = () => {
  const [posts, setPosts] = useState<PostI[]>([
    {
      id: 'Post1',
      title: 'First Post',
      body: 'Body of the post',
      userId: 'User1',
      userName: 'Viktor Sheverdin',
    },
  ]);
  const [errors, setErrors] = useState<null | string>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        setIsPending(true);
        const postsResponse = await fetch(BASE_URL_POSTS);

        // can have multiple posts from a single user
        const postsData = await postsResponse.json();

        // get unique IDs
        const userIds: string[] = Array.from(
          new Set(postsData.posts.map((post: PostI) => post.userId))
        );

        // get promises for all users to save time on requests
        const usersPromises = userIds.map((userId) => {
          return fetch(`${BASE_URL_USERS}/${userId}`).then((res) => res.json());
        });

        const usersData = await Promise.all(usersPromises);
        console.log(usersData);

        // create a map since order is important
        const userMap = new Map<string, string>();
        usersData.forEach((user: UserI) => {
          userMap.set(user.id, `${user.firstName} ${user.lastName}`);
        });

        const combinedPostData = postsData.posts.map((post: PostI) => {
          return { ...post, userName: userMap.get(post.userId) };
        });

        setPosts(combinedPostData);

        setErrors(null);
      } catch {
        setErrors('Errors fetching data');
      } finally {
        setIsPending(false);
      }
    };

    fetchPostsAndUsers();
  }, []);

  if (errors) return <div>{errors}</div>;

  return (
    <div>
      <h1>Post Component</h1>
      <div
        style={{
          maxHeight: '300px',
          overflow: 'auto',
          border: '1px solid #000',
        }}
      >
        {isPending ? (
          <div>Getting posts...</div>
        ) : (
          posts.map((post) => {
            return (
              <Post
                key={post.id}
                {...post}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default PostsComponent;
