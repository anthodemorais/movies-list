import config from './config';

const baseUrl = `https://api.themoviedb.org/3/movie`

const getMovies = (page, completion) => {
    fetch(`${baseUrl}/popular?api_key=${config.key}&page=${page}`)
    .then((res) => {
        if (res.status === 200) {
            res.json().then(data => {
                let isMax = false
                if (page === data.totalPages) {
                    isMax = true
                }
                completion(false, isMax, page + 1, data.results)
            })
            .catch((error) => {
                console.log(error)
                completion(true)
            })
        }
        else {
            console.log(res)
            completion(true)
        }
    })
    .catch((error) => {
        console.log(error)
        completion(true)
    })
}

const getMovieDetails = (id, completion) => {
    fetch(`${baseUrl}/${id}?api_key=${config.key}`)
    .then((res) => {
        if (res.status === 200) {
            res.json().then(data => {
                completion(false, data)
            })
            .catch((error) => {
                console.log(error)
                completion(true)
            })
        }
        else {
            console.log(res)
            completion(true)
        }
    })
    .catch((error) => {
        console.log(error)
        completion(true)
    })
}

export { getMovies, getMovieDetails }