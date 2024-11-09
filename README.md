1. Clone the Repository

Start by cloning the project repository to your local machine.

bash
git clone https://github.com/LuluDev1/newP7.git
cd newP7

2. Install Dependencies


Install the necessary dependencies using npm
npm install

3. Set up Railway Database


Go to Railway and log in or sign up for an account.
Create a new project and select a database type (e.g., PostgreSQL).
Once the database is set up, obtain the connection string for your database from the Railway dashboard.
Copy the connection URL from Railway and set it in your .env file.

4. Create .env File

In the root of the project, create a .env file with the following contents:

VITE_POST_URL=your_railway_db_connection_url
Replace your_railway_db_connection_url with the actual connection string from Railway.

5. Run the Development Server

To run the Express server locally, use the following command:

npm run dev
This will start the server on http://localhost:3000