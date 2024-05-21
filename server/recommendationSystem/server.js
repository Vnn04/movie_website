const axios = require('axios');

// Định nghĩa các URL của các endpoint API của Flask
const recommendByMovieIDURL = 'http://localhost:5000/recommend_by_movieID';
const recommendByUserIDURL = 'http://localhost:5000/recommend_by_userID';
const add_new_userURL = 'http://localhost:5000/add_new_user';

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

// Sử dụng các hàm trên

const movieID = 11;
const userID = 0;

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

// add_new_user(200, 1, '1991-10-12')

module.exports = {
    getRecommendationsByUserID,
    getRecommendationsByMovieID,
    add_new_user
}