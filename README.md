# Expense Tracker

A simple and easy-to-use Expense and Income Tracker app built with React Native, Expo, and Firebase for managing daily expenses, income, and providing insightful financial reports.

## Features

- **Add expenses:** Users can add their daily expenses with category, amount, and date.
- **Add income:** Users can add their income sources, including salary, side income, etc.
- **Expense and Income tracking:** View a list of all expenses and incomes added.
- **Expense and Income summary:** View financial statistics and reports on weekly, monthly, and yearly bases.
- **Authentication:** Firebase authentication for user accounts.
- **Cloud storage:** Firebase is used for storing user data and syncing across devices.
- **Responsive UI:** Designed to work well on both Android and iOS devices.

## Tech Stack

- **Frontend:**
  - React Native
  - Expo SDK
  - React Navigation
  - React Native Paper
  - Firebase (for authentication and data storage)
  
- **Backend:**
  - Firebase Firestore (for cloud storage)
  - Firebase Authentication (for user login and registration)

## Setup Instructions

Follow these steps to get the project up and running locally.

### 1. Clone the repository

git clone https://github.com/StanchevVeselin/Expense-Tracker.git

2. Install dependencies
Navigate to the project directory and install the necessary packages:

cd expense-tracker
npm install

3. Set up Firebase
Create a Firebase project at Firebase Console.

Enable Firebase Authentication and Firestore in your Firebase project.

Obtain the Firebase config keys from your Firebase console.

5. Run the project
Start the development server:

npm start
The app will open in Expo Go (or the browser for web).

6. Build for production
For building the app for production, use the Expo build commands:

expo build:android
expo build:ios
Usage
-Login or Register: Users can sign in using Firebase Authentication with email/password.

-Add an Expense: Enter the amount, category, and date of the expense.

-Add Income: Enter the amount and source of income (e.g., salary, freelance work).

-View Expenses and Income: Users can see all their expenses and income listed.

-View Statistics: Get weekly, monthly, and yearly financial statistics for both expenses and income.
