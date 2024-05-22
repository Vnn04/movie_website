const axios = require('axios');

// Định nghĩa các URL của các endpoint API của Flask
const recommendByMovieIDURL = 'http://localhost:5000/recommend_by_movieID';
const recommendByUserIDURL = 'http://localhost:5000/recommend_by_userID';
const add_new_userURL = 'http://localhost:5000/add_new_user';
const update_ratingURL = 'http://localhost:5000/update_rating';
const update_viewURL = 'http://localhost:5000/update_view';
const update_watch_trailerURL = 'http://localhost:5000/update_watch_trailer';
const add_new_movieURL = 'http://localhost:5000/add_new_movie';


// Hàm gửi yêu cầu API đến endpoint recommend_by_movieID của Flask
async function getRecommendationsByMovieID(movieID) {
    try {
        const response = await axios.post(recommendByMovieIDURL, {
            movieID: movieID
        });
        return response.data;
    } catch (error) {
        console.error('Error calling recommend_by_movieID endpoint:', error);
        return null;
    }
}

// Hàm gửi yêu cầu API đến endpoint recommend_by_userID của Flask
async function getRecommendationsByUserID(userID) {
    try {
        const response = await axios.post(recommendByUserIDURL, {
            userID: userID
        });
        return response.data;
    } catch (error) {
        console.error('Error calling recommend_by_userID endpoint:', error);
        return null;
    }
}

async function add_new_user(id, gender, date_of_birth) {
    try {
        const response = await axios.post(add_new_userURL, {
            'id': id,
            'gender': gender,
            'date_of_birth':date_of_birth
        });
        console.log(response.data)
    } catch (error) {
        console.error("Error add new user: ", error);
    }
}

async function update_rating(userID, movieID, rating) {
    try {
        const response = await axios.post(update_ratingURL, {
            'userID': userID,
            'movieID': movieID,
            'rating':rating
        });
        console.log(response.data)
    } catch (error) {
        console.error("Error update rating: ", error);
    }
}

async function update_view(userID, movieID, view) {
    try {
        const response = await axios.post(update_viewURL, {
            'userID': userID,
            'movieID': movieID,
            'view':view
        });
        console.log(response.data)
    } catch (error) {
        console.error("Error update view: ", error);
    }
}

async function update_watch_trailer(userID, movieID, watch) {
    try {
        const response = await axios.post(update_watch_trailerURL, {
            'userID': userID,
            'movieID': movieID,
            'watch':watch
        });
        console.log(response.data)
    } catch (error) {
        console.error("Error update watch trailer: ", error);
    }
}

async function add_new_movie(id, action, adventure, animation, comedy, crime, documentary, drama, family, fantasy, history, horror, music, mystery, romance, science, tv, thriller, war, western) {
    try {
        const response = await axios.post(add_new_movieURL, {
            'id': id, 
            'Action': action, 
            'Adventure': adventure, 
            'Animation': animation, 
            'Comedy': comedy, 
            'Crime': crime, 
            'Documentary': documentary,
            'Drama': drama, 
            'Family': family, 
            'Fantasy': fantasy, 
            'History': history, 
            'Horror':horror, 
            "Music": music, 
            'Mystery': mystery, 
            'Romance': romance, 
            'Science Fiction': science, 
            'TV Movie': tv, 
            'Thriller':thriller, 
            'War': war, 
            "Western": western});
        console.log(response.data)
    } catch (error) {
        console.error("Error update watch trailer: ", error);
    }
}
// Sử dụng các hàm trên 

// const movieID = 11; 
// const userID = 200;
// add_new_user(200, 1, '1991-10-12');

// getRecommendationsByMovieID(movieID)
//     .then(recommendations => {
//         console.log('Recommendations by movie ID:', recommendations);
//         console.log('Recommendation movie [1]', recommendations.result[1]);
//     })

//     .catch(error => {
//         console.error('Error getting recommendations by movie ID:', error);
//     });

// getRecommendationsByUserID(userID)
//     .then(recommendations => {
//         console.log('Recommendations by user ID:', recommendations);
//         console.log('Recommendation movie [1]', recommendations.result[1]);
//     })
//     .catch(error => {
//         console.error('Error getting recommendations by user ID:', error);
//     });


// update_rating(0, 11, 2);
// update_view(0, 11, 100);
// update_watch_trailer(0, 11, 100);

// add_new_movie(124, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1);

module.exports = {
    getRecommendationsByUserID,
    getRecommendationsByMovieID,
    add_new_user,
    update_rating
}