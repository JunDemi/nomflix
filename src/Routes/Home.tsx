import NowPlaying from "../Components/NowPlaying";
import TopRatedMovies from "../Components/TopRatedMovies";
import UpcomingMovies from "../Components/UpcomingMovies";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
`;
function Home() {
  return (
    <Wrapper>
      <NowPlaying />
      <TopRatedMovies />
      <UpcomingMovies />
    </Wrapper>
  );
}
export default Home;
