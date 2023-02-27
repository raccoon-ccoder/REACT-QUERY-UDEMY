import { Posts } from "./Posts";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

// staleTime : 데이터가 만료되기 전까지의 시간 (데이터를 허용하는 최대 나이)
// 기본값은 0 -> 데이터는 항상 만료상태이므로 서버에서 항상 데이터를 가져오게 됨 -> 항상 최신 상태의 데이터 제공
// staleTime : 리패칭시 고려 사항

// 특정 query가 활성화된 것이 없다면 해당 데이터는 cold storage로 이동
// 구성된 cacheTime이 지나면 캐시 데이터 만료
// cacheTime 기본값은 5분
// cacheTime이 관찰하는 시간의 양은 특정 쿼리에 대한 useQuery가 활성화된 후 경과한 시간
// 캐시 만료되면 가비지 컬렉션 실행되며 클라이언트는 데이터를 사용할 수 없음
// 데이터가 캐시에 있는 동안에는 fetching시 사용됨
// 데이터 패칭을 중지하지 않으므로 서버의 최신 데이터로 새로 고침이 가능

// 만료된 데이터가 위험할 수 있는 경우에는, cacheTime = 0으로 설정

// react-query에서 데이터 리패칭 : 만료된 데이터일경우만 실행

// staleTime 3분, cacheTime : 1분일경우
// fresh 3분 유지 -> stale (이게 캐시?) 1분
