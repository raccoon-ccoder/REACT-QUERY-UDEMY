import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page${pageNum}`
  );
  return response.json();
}
// isFetching > isLoading
// isFetching - async query function hasn't yet resolved
// isLoading - no cached data, plus isFetcing

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        // (1)
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  const { data, isLoading, isError, error, isFetching } = useQuery(
    // (2)
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 1000 * 2,
      keepPreviousData: true,
    }
  );
  if (isLoading) return <h3>Loading ...</h3>;
  // if (isFetching) return <h3>Fetcing in progress...</h3>;
  // isLoading -> isFetching일 경우, 페이지를 이동하면 캐시 데이터 유무에 상관없이 항상 보여진다
  // Prefetch 전까지만 해당 문구가 보여짐
  // 즉, nextPage 데이터를 포함한 캐시를 미리 가져오기 전까지 표시가 된다
  // 다르게 말하면 화면에 표시할 것이 아무것도 없을 경우에만 (캐시 데이터도 없을 경우에만) 로딩 인디케이터를 제공해야 하기에 isLoading을 사용하는 것이 맞음
  // 현재는 prefetching을 해 다음 페이지의 데이터를 미리 캐시에 가지고 있기 때문이다
  if (isError)
    return (
      <>
        <h3>someting went wrong...</h3>
        <p>{error.toString()}</p>
      </>
    );
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((page) => page - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= 10}
          onClick={() => {
            setCurrentPage((page) => page + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

// Prefetch : 데이터를 캐시에 추가하며 구성할 수 있긴 하지만 기본값은 stale state
// 즉, 데이터를 사용하고자 할 때 만료 상태에서 데이터를 가져온다
// 데이터를 다시 가져오는 중에 캐시에 있는 데이터를 이용해 앱에 나타남 (물론 캐시가 만료되지 않았다는 가정하에)
// 만약 사용자가 cacheTime보다 한 페이지에 오래 머무른다면 Next page 클릭시 캐시가 만료되어 아무 것도 남아있지 않기 떄문에 로딩 인디케이터 나타남

// 다수의 사용자가 통계적으로 특정 탭을 누를 확률이 높다면 prefetching을 사용하는 것이 좋음
// 즉, 목적은 캐시된 데이터를 표시하면서 배경에선 데이터의 업데이트 여부를 조용히 서버에 확인하는 것이다!

// isFetching : async 쿼리 함수가 해결되지 않았을 경우 -> true => 아직 데이터를 가져오는 중
// isLoading : isFetching이 참 && 쿼리에 대해 캐시된 데이터가 없는 상태
// isLoading === true ? isFetcing = true
// isFetching 안에 isLoading이 있음

// 만약 페이지가 현재 3-> 4페이지일 경우, useQuery(2)에선 캐시에 4페이지 데이터가 있는지 확인
// (1)을 통해 4페이지 데이터를 프리패치했기에 존재하지만, staleTime을 0으로 설정했기에 자동으로 만료(stale) 상태 적용
// 따라서 (2)의 fetchPost가 실행됨
// 만약 다른 데이터를 반환한다면 데이터가 업데이트된다
// 따라서 페이지에 새로운 데이터가 출력 (그전까진 캐시 데이터 출력)
