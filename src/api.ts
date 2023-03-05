const API_KEY = "142ae456a45ebbec61cb344c81f6e49f";
const BASE_PATH = "https://api.themoviedb.org/3";


interface IMoive {
    id: number,
    backdrop_path: string,
    poster_path: string,
    title: string,
    overview: string
}

export interface IGetMovieResult {
    dates: {
        maximum: string,
        minimum: string,
    },
    page: number,
    results: IMoive[],
    total_pages: number,
    total_results: number,
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

//movie/now_playing?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US&page=1