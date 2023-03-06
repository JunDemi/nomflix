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
    dates?: {
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

export function getTop() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/movie/top_rated?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US&page=1
export function getUpcome() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/movie/upcoming?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US&page=1
export interface ILateMovieResult {
    backdrop_path: string,
    id: number,
    overview: string,
    poster_path: string,
    title: string
}
export function getLatest() {
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/movie/latest?api_key=142ae456a45ebbec61cb344c81f6e49f

interface ITv {
    id: number,
    backdrop_path: string,
    poster_path: string,
    name: string,
    overview: string
}

export interface IGetTvResult {
    page: number,
    results: ITv[],
    total_pages: number,
    total_results: number,
}

export function getAiring() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/tv/airing_today?api_key=142ae456a45ebbec61cb344c81f6e49f
export function getPopular() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/tv/popular?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US&page=1
export function getTopTv() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/tv/top_rated?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US&page=1
export interface ILateTvResult {
    backdrop_path: string,
    id: number,
    overview: string,
    poster_path: string,
    name: string
}
export function getLatestTv() {
    return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//https://api.themoviedb.org/3/tv/latest?api_key=142ae456a45ebbec61cb344c81f6e49f&language=en-US