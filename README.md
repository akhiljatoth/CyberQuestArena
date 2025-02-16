# CyberQuestArena

![CyberQuestArena Banner](assets/banner.png)

**CyberQuestArena** is an innovative Capture The Flag (CTF) platform designed for cybersecurity enthusiasts and professionals. It offers a diverse range of challenges, from traditional coding and exploitation tasks to unique puzzles involving songs and movies. The platform leverages the ChatGPT API to dynamically generate questions, ensuring a fresh and engaging experience for users.

## Features

- **Diverse Challenge Categories**: Engage in various challenges, including:
  - Coding
  - Exploitation
  - OSINT
  - Cryptography
  - Forensics
  - Reversing
  - Miscellaneous
  - Music and Movie Trivia

- **Dynamic Question Generation**: Utilizing the ChatGPT API, the platform generates unique questions for each session, providing a varied experience every time.

- **User Authentication & Leaderboards**: Secure sign-up and login functionalities with real-time leaderboards to track and showcase top performers.

- **Admin Panel**: Manage challenges, monitor user activity, and update content seamlessly through an intuitive admin interface.

- **Responsive Design**: A hacker-themed, responsive UI ensures an optimal experience across desktops, tablets, and mobile devices.

## Installation & Setup

To set up the CyberQuestArena locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/akhiljatoth/CyberQuestArena.git
   cd CyberQuestArena
   ```

2. **Install Dependencies**:

   - For the server:

     ```bash
     cd server
     npm install
     ```

   - For the client:

     ```bash
     cd ../client
     npm install
     ```

3. **Configure Environment Variables**:

   - Create a `.env` file in the `server` directory with the following content:

     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     CHATGPT_API_KEY=your_openai_api_key
     ```

   - Replace `your_mongodb_connection_string` and `your_openai_api_key` with your actual MongoDB URI and OpenAI API key, respectively.

4. **Start the Application**:

   - Start the server:

     ```bash
     cd server
     npm start
     ```

   - Start the client:

     ```bash
     cd ../client
     npm start
     ```

   - Open your browser and navigate to `http://localhost:3000` to access CyberQuestArena.

## Usage

Once the application is running:

- **Users** can register, log in, and participate in various challenges. Navigate through different categories, attempt challenges, and view your standings on the leaderboard.

- **Admins** can access the admin panel by navigating to `http://localhost:3000/admin`. From there, you can add, update, or remove challenges, as well as monitor user activities.

## Screenshots

Here are some glimpses of CyberQuestArena:

- **Home Page**:

  ![Home Page](assests\login.png)

- **Challenge Dashboard**:

  ![Challenge Dashboard](assests\banner.png)


## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/your_feature_name
   ```

3. Make your changes and commit them with descriptive messages.

4. Push to your forked repository:

   ```bash
   git push origin feature/your_feature_name
   ```

5. Open a Pull Request detailing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

*Note: Ensure that the images referenced in the screenshots section are placed in the `attached_assets` directory within your repository.*
