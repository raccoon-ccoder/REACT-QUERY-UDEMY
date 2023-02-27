import { useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  if (isLoading) {
    return <h3>waits for comments...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    );
  }
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}

// 모든 쿼리가 같은 comments 쿼리 키를 동일하게 사용한다면 -> 댓글은 항상 같은 댓글만 보여줌
// comments 같이 알려진 쿼리 키가 있을 경우 트리거가 있어야만 리패칭된다 (components unmount, window focus, runnong refetch func, automated refetch, query invalidation after a mutation)
// 클라이언트 데이터가 서버의 데이터와 불일치할 경우 리페칭이 트리거됨

//
