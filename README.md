# Market Data Form

This project is a React application that provides a form for submitting market data inputs to a specified API endpoint. 

## Project Structure

```
market-data-form
├── src
│   ├── App.tsx                # Main entry point of the application
│   ├── components
│   │   └── MarketDataForm.tsx # Component for the market data form
│   ├── api
│   │   └── postMarketData.ts  # Function to handle API requests
│   └── types
│       └── MarketDataInput.ts  # TypeScript interface for market data input
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd market-data-form
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the application:
   ```
   npm start
   ```

## Usage

The application allows users to input market data properties such as provider code, instrument code, and market data category. Upon submission, the data is sent to the API endpoint for processing.

## API Endpoint

The form submits data to the following endpoint:
```
POST https://mrm-dev-mrm-cpc-market-data-jobs.cfapps.sap.hana.ondemand.com/instrumentCode
```

### Headers

The request includes the following headers:
- Content-Type: application/json
- Authorization: Bearer {{access_token_mrm_canary_cpc_internal}}

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.# FinalSemProject
