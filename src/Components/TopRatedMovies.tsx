import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getTop, IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  margin-bottom: 350px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const rowVar = {
  hide: {
    x: window.outerWidth + 3,
  },
  show: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 3,
  },
};

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const infoVar = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const offset = 6;

const boxVar = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: black;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 100;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 40vh;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 24px;
  position: relative;
  left: 200px;
  top: -60px;
`;
const BigPoster = styled.div`
  position: absolute;
  top: 150px;
  left: 20px;
  width: 180px;
  height: 240px;
  background-size: cover;
  background-position: center center;
  box-shadow: 3px 3px 6px rgba(0,0,0,0.5);
`
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: 0px;
  color: ${(props) => props.theme.white.lighter}; ;
`;
const SliderTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 25px 15px;
  h2 {
    font-size: 36px;
    font-weight: bold;
  }
  span {
    font-size: 30px;
    cursor: pointer;
  }
`;

function TopRatedMovies() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/toprate/:movieId");
  const { scrollY } = useScroll();
  const { data: data2, isLoading: isLoading2 } = useQuery<IGetMovieResult>(
    ["movies", "TopRating"],
    getTop
  );
  const [index, set_index] = useState(0);
  const [leaving, set_leaving] = useState(false);
  const toggleLeaving = () => set_leaving((prev) => !prev);
  const increaseIndex = () => {
    if (data2) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data2?.results.length;
      const maxIndex = Math.floor(totalMovies / offset);
      set_index((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/toprate/${movieId}`);
  };
  const onOverlayClicked = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data2?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <>
      {isLoading2 ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderTitle>
              <h2>Top Rated Movies</h2>
              <span onClick={increaseIndex}>&rarr;</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVar}
                initial="hide"
                animate="show"
                exit="exit"
                key={index}
                transition={{ type: "tween", duration: 0.8 }}
              >
                {data2?.results
                  .slice(0)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "toprate"}
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      bgphoto={movie.backdrop_path === null ? 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png' : makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVar}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId + "toprate"}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: clickedMovie.backdrop_path === null ?
                            `linear-gradient(to top, black, transparent), url('https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png')`
                            : `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedMovie.backdrop_path, "w500")})`
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigPoster style={{backgroundImage: clickedMovie.poster_path === null ?
                            `url('https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png')`
                            : `url(${makeImagePath(
                              clickedMovie.poster_path, "w500")})`}}/>
                      <BigOverview>{clickedMovie.overview || "No Description..."}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
export default TopRatedMovies;
