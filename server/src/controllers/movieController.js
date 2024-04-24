let {getAllMovies} = require("../services/movieService");
let handleGetAllMovie = async(req, res) => {
    let movies = await getAllMovies();
    return res.render("index.ejs", {listMovies:movies});
}

let handleGetSeries = (req, res) => {
    return res.render("utils/series.ejs");
}
module.exports = {
    handleGetAllMovie,
    handleGetSeries
}