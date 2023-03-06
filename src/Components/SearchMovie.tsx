import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";

const API_KEY = "142ae456a45ebbec61cb344c81f6e49f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMoiveSearch {
    id: number,
    backdrop_path: string,
    poster_path: string,
    title: string,
    overview: string
}

interface IGetMovieSearch {
    dates?: {
        maximum: string,
        minimum: string,
    },
    page: number,
    results: IMoiveSearch[],
    total_pages: number,
    total_results: number,
}

//https://api.themoviedb.org/3/search/movie?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US&query=keyword&page=1&include_adult=false

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 auto;
  margin-bottom: 5px;
  width: 80%;
`;
const Box = styled(motion.div) <{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
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
const Result = styled.div`
    width: 80%;
    height: 250px;
    display: flex;
    align-items: left;
    justify-content: center;
    margin: 0 auto;
    flex-direction: column;
    h1{
        font-size: 30px;
        margin-bottom: 20px;
        font-weight: bold;
    }
`;

function SearchMovie() {
    const history = useHistory();
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const bigMovieMatch = useRouteMatch<{ movieId: string }>(`/search/movie/:movieId`);
    const { scrollY } = useScroll();
    function getMovieSearch() {
        return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then(
            (response) => response.json()
        );
    }

    const { data: data1, isLoading: isLoading1 } = useQuery<IGetMovieSearch>(
        ["movies", "searchMovie"],
        getMovieSearch
    );
    const onBoxClicked = (movieId: number) => {
        history.push(`/search/movie/${movieId}?keyword=${keyword}`);
    };
    const onOverlayClicked = () => history.push(`/search?keyword=${keyword}`);
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data1?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
    return (
        <>
            <Result>
                <h1>Search "{keyword}"</h1>
            </Result>
            {isLoading1 ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <AnimatePresence initial={false}>
                        <Row
                            variants={rowVar}
                            initial="hide"
                            animate="show"
                            exit="exit"
                            transition={{ type: "tween", duration: 0.8 }}
                        >
                            {data1?.results.map((movie) => (
                                <Box
                                    layoutId={movie.id + "searchMovie"}
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
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClicked}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId + "searchMovie"}
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
                                            <BigPoster style={{
                                                backgroundImage: clickedMovie.poster_path === null ?
                                                    `url('https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png')`
                                                    : `url(${makeImagePath(
                                                        clickedMovie.poster_path, "w500")})`
                                            }} />
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
export default SearchMovie;
