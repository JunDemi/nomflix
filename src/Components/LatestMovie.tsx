import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getLatest, getUpcome, IGetMovieResult, ILateMovieResult } from "../api";
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
  transform-origin: center left;
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
  z-index: 100;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
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
  font-size: 36px;
  position: relative;
  top: -85px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
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

function LastestMovie() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/latest/:movieId");
  const { scrollY } = useScroll();
  const { data: data4, isLoading: isLoading4 } = useQuery<ILateMovieResult>(
    ["movies", "LatestMovie"],
    getLatest
  );

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/latest/${movieId}`);
  };
  const onOverlayClicked = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data4?.id === +bigMovieMatch?.params.movieId;
    
  return (
    <>
      {isLoading4 ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderTitle>
              <h2>Latest movie</h2>
              <span></span>
            </SliderTitle>
            <AnimatePresence>
              <Row
                variants={rowVar}
                initial="hide"
                animate="show"
                exit="exit"
                transition={{ type: "tween", duration: 0.8 }}
              >
                    <Box
                      layoutId={data4?.id + "latest"}
                      onClick={() => onBoxClicked(Number(data4?.id))}
                      bgphoto={makeImagePath(String(data4?.poster_path), "w500")}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVar}>
                        <h4>{data4?.title}</h4>
                      </Info>
                    </Box>
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
                  layoutId={bigMovieMatch.params.movieId + "latest"}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            String(data4?.poster_path),
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{String(data4?.title)}</BigTitle>
                      <BigOverview>{String(data4?.overview)}</BigOverview>
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
export default LastestMovie;
