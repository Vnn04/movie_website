# 🎬 Movie Website

![Background](background.png)

Welcome to the **Movie Website** project! Dive into a world where you can watch movie trailers, provided you have a subscription, and enjoy personalized movie recommendations. Our recommendation system uses gradient episodic memory model to ensure real-time updates and the most relevant suggestions.

## 🌟 Features
- **Exclusive Trailer Access:** Only subscribed users can enjoy our movie trailers.
- **Smart Recommendations:** Our system delivers personalized movie recommendations using advanced machine learning techniques.

## Contributors
- [Trần Kim Dũng](https://github.com/DUNGTK2004) - 22022633
- [Phạm Anh Quân](https://github.com/hquan3404) - 22022625
- [Hồ Cảnh Quyền](https://github.com/quyencanh203) - 22022629
- [Nguyễn Văn Thân](https://github.com/vnn04) - 22022596

## 📚 Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Prerequisites
Make sure you have the following installed:
- Docker
- Miniconda
- Nodejs

### Steps

1. **Clone the Repository**
    ```sh
    git clone https://github.com/Vnn04/movie_website.git
    cd movie_website
    ```

2. **Set Up the Server**
    - Navigate to the `server` directory:
        ```sh
        cd server
        ```
    - Run the server using Docker Compose:
        ```sh
        docker-compose up
        ```

3. **Set Up the Recommendation System**
    - Navigate to the `recommendationSystem` directory:
        ```sh
        cd ../recommendationSystem
        ```
    - Create a new Conda environment and activate it:
        ```sh
        conda create --name mlops-env python=3.12
        conda activate mlops-env
        ```
    - Install the required libraries:
        ```sh
        pip install -r requirement.txt
        ```
    - Run the application:
        ```sh
        python app.py
        ```

4. **Finalize the Server Setup**
    - First, in folder server add file .env and paste content in file .env.example into it, fill the missing infomation. with MAIL_USERNAME= your_email (Your email has 2-layer security)  MAIL_PASSWORD= your_password(app passwrod or your password of your email), MAIL_FROM_ADDRESS= your_email (Your email has 2-layer security), SECRET_API_GG_IMG_KEY= your_api_google_image_key. 
    - Navigate back to the `server` directory:
        ```sh
        cd ../server
        ```
    - Install the necessary Node.js packages:
        ```sh
        npm install
        ```
    - Start the server:
        ```sh
        npm start
        ```
    - Open your browser and go to `http://localhost:8080` to view the application.

## 📖 Usage
Once installed, launch the application by navigating to `http://localhost:8080`. Users can sign up, subscribe, and start watching exclusive movie trailers. Our recommendation system will tailor suggestions to each user's preferences based on their viewing history.

## 🛠️ Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** Mysql
- **Recommendation:** Python, Gradient Episodic Memory
- **Containerization:** Docker
- **Environment Management:** Conda

## 🤝 Contributing
We welcome contributions from the community! If you have ideas to enhance the Movie Website, follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push the changes to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request for review.

Please ensure your contributions adhere to our coding standards and include necessary tests.

## 📜 License
This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.

---

Thank you for choosing Movie Website! We hope you enjoy an exceptional, personalized movie trailer experience.
