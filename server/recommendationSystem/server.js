const axios = require('axios');

// Định nghĩa các URL của các endpoint API của Flask
const recommendByMovieIDURL = 'http://localhost:5000/recommend_by_movieID';
const recommendByUserIDURL = 'http://localhost:5000/recommend_by_userID';

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

// Sử dụng các hàm trên

const movieID = 693134;
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

module.exports = {
    getRecommendationsByUserID
}
