# Assignment Application

## Overview

This React Native application allows users to log in using a PIN and select a symbol from KuCoin's API. Upon successful authentication, users are redirected to a market data page.

## Features

- **Symbol Selection:** Users can select a symbol from KuCoin's API.
- **PIN Authentication:** Users must enter a valid PIN to authenticate.
- **Error Handling:** Displays appropriate messages for errors such as invalid PIN or failed symbol fetching and error messages as needed.
-  **Data Fetching:** Retrieves market data for a selected symbol.
- **Data Processing:** Groups orders by price, calculates average prices and total sizes.
- **Styled UI:** Presents data in a user-friendly format with styling.

## Requirements

- **Node.js** (for backend server)
- **React Native** (for mobile app development)
- **React Native CLI** (for running the React Native app)
- **npm** (for package management)

## Dependencies

- **React Native**: For building the mobile app.
- **axios**: For making HTTP requests.
- **ActivityIndicator**: For showing loading indicators.
- **ScrollView**: For displaying long lists of data.
- **Navigation**: For navigation across the application.
- **DropDownPicker**: For dropdown list picker of market data.


## Setup

### Backend Setup

1. **Clone the backend repository:**

    ```bash
    git clone https://github.com/ctatianto/server.git
    cd your-backend-repository
    ```

2. **Install dependencies:**

    ```bash
    npm install <dependencies>
    ```

3. **Start the backend server:**

    ```bash
    node server,js
    ```

    Ensure the server is running on `http://localhost:3000`.
    
- **Backend URL:** `http://localhost:3000`
- **Authentication Endpoint:** `/api/authenticate`
- **Market Data Endpoint:** `https://api.kucoin.com/api/v1/market/orderbook/level2_100`


### Frontend Setup

1. **Clone the frontend repository:**

    ```bash
    git clone https://github.com/ctatianto/AssignmentTest.git
    cd your-frontend-repository
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the React Native application and run it on iOS simulator:**

    ```bash
    npm start
    npx react-native run-ios
    ```

    This will open Expo in your default web browser. Scan the QR code with the Expo Go app on your mobile device to run the app.

## Application Functionality

### LoginScreen Component

- **Fetch Symbols:** The component fetches symbols from KuCoin's API and populates a dropdown menu.
- **Select Symbol:** Users can choose a symbol from the dropdown.
- **Enter PIN:** Users must enter the PIN `Mys3cureP1n!123` for authentication.
- **Login Handler:** Upon pressing the login button, the app sends a request to the backend server to authenticate the user.

### Backend Authentication

- **Endpoint:** `/api/authenticate`
- **Method:** `POST`
- **Request Body:**

    ```json
    {
      "pin": "string",
      "symbol": "string"
    }
    ```

- **Response:**

    - **Success (HTTP 200):**

        ```json
        {
          "authtoken": "your-auth-token"
        }
        ```

    - **Error (HTTP 401):**

        ```json
        {
          "error": "Invalid PIN"
        }
        ```
## Market Data Component
### Component Details

### Props

- **authtoken**: The authentication token used for API requests.
- **symbol**: The symbol for which market data is requested.

### Functionality

1. **Fetching Data:** The component fetches market data for the provided symbol using the KuCoin API and the given auth token.
2. **Processing Orders:**
    - **`processOrders(orders)`**: Groups orders by price and aggregates sizes.
    - **`calculateAverage(orders)`**: Calculates average prices for bids and asks.
3. **Displaying Data:**
    - **Bids:** Displays grouped bid prices and sizes, average bid price, and total bid size.
    - **Asks:** Displays grouped ask prices and sizes, average ask price, and total ask size.
4. **Error Handling:** Shows an error message if data fetching fails.
## Error Handling

- **Symbol Fetch Error:** Displays an alert if symbols cannot be fetched from KuCoin's API.
- **PIN Authentication Error:** Displays an alert if the PIN entered is incorrect.

## Running the Application

1. **Start the backend server** (ensure it's running on `http://localhost:3000`).
2. **Start the React Native app** using React Native CLI.
3. **Run on iOS Simulator** ``` npx react-native run-ios    ```

## Testing

- **Unit Tests:** Implement and run unit tests for the React Native components and backend API.
- **Integration Tests:** Ensure that the frontend and backend communicate correctly.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## Contact

For any questions or feedback, please contact [chandra.tatianto@gmail.com](mailto:chandra.tatianto@gmail.com).

---

