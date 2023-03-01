import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    hasNextPage,
    fetchNextPage,
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage, allPage) => lastPage.next || undefined,
    }
  );

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error : {error.toString()}</div>;
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
        {data.pages.map((page) =>
          page.results.map((species) => (
            <Species
              key={species.name}
              name={species.name}
              language={species.language}
              averageLifespan={species.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
