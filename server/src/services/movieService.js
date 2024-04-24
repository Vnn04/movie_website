import db from "../models/index";

let getAllMovies = () => {
    return new Promise(async(resolve, reject)=> {
        try {
            let movies = await db.Movie.findAll({
                order: [
                    ['release_date','DESC']
                ]
            });
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllMovies
}