# Healme

Healme is a mobile application designed to assist users in identifying and managing skin diseases using advanced technological solutions. The app offers a range of features for efficient wound care and skin disease detection.

## Tech Stack

### Backend
- **ExpressJs**: A web application framework for Node.js used for building the server-side logic of the app.
- **NodeJs**: A JavaScript runtime environment that executes the app's server-side code.

### Database
- **MongoDB Atlas**: A cloud-based NoSQL database that stores user data, predictions, and other relevant information.

### Cloud Services
- **Compute Engine**: A service provided by cloud platforms (like Google Cloud) to run virtual machines that handle the application's backend processing.
- **Cloud Storage**: Used for storing large files and data, such as images uploaded by users for skin disease detection.

### Security and Networking
- **IAM Policy**: Identity and Access Management policies that control access to the app's resources.
- **VPC Networks**: Virtual Private Cloud networks that provide isolated networking environments for the app's components.

## Features

### User Management
- **Sign Up**: Allows new users to create an account.
- **Login**: Enables existing users to access their accounts.
- **Update Password**: Provides users with the ability to change their passwords.
- **Get Profile**: Retrieves user profile information.
- **Update Profile**: Allows users to update their profile details.

### Predictions Management
- **Get All Predictions**: Fetches a list of all skin disease predictions made by the user.
- **Create a Prediction**: Allows users to submit a new skin image for disease prediction.
- **Get a Single Prediction**: Retrieves details of a specific prediction.
- **Delete Prediction Result**: Enables users to remove a prediction result from their account.

### Additional Features
- **Get Nearby (Gmaps API)**: Uses the Google Maps API to find nearby medical facilities or dermatologists based on the user's location.

## API Documentation

Detailed API documentation can be accessed [here](https://documenter.getpostman.com/view/22724606/2sA3Qwbpj6). This documentation provides comprehensive information on the endpoints, request formats, and response structures for interacting with Healme's backend services.
