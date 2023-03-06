import styled from "styled-components";
import AiringToday from "../Components/AiringToday";
import Popular from "../Components/Popular";
import TopRatedTv from "../Components/TopRatedTv";
import LatestShows from "../Components/LatestShows";

const Wrapper = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
`;
function Tv() {
  return (
    <Wrapper>
      <AiringToday />
      <Popular/>
      <TopRatedTv/>
      <LatestShows/>
    </Wrapper>
  );
}
export default Tv;
