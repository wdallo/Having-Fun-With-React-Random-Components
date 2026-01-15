import { useState, useEffect } from "react";
import "./CurrencyConverter.css";

// Cache for exchange rates (move outside the component to persist across renders)
const exchangeRateCache = new Map();

const CurrencyConverter = () => {
  // State variables for managing input and output currencies, amount, and results
  const [inputCurrency, setInputCurrency] = useState("USD"); // Default input currency
  const [outputCurrency, setOutputCurrency] = useState("EUR"); // Default output currency
  const [amount, setAmount] = useState(0); // Amount to be converted
  const [convertedAmount, setConvertedAmount] = useState(null); // Result of the conversion
  const [error, setError] = useState(""); // Error message state
  const [exchangeRates, setExchangeRates] = useState({}); // Exchange rates for the selected input currency
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  // List of supported currencies
  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "INR",
  ];

  // Fetch exchange rates and cache them
  useEffect(() => {
    const fetchExchangeRates = async () => {
      // Check if exchange rates for the selected input currency are already cached
      if (exchangeRateCache.has(inputCurrency)) {
        setExchangeRates(exchangeRateCache.get(inputCurrency)); // Use cached rates
        return;
      }

      setIsLoading(true); // Set loading state to true while fetching data
      try {
        // Fetch exchange rates from the API
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${inputCurrency}`
        );
        const data = await response.json();
        if (data && data.rates) {
          setExchangeRates(data.rates); // Update exchange rates state
          exchangeRateCache.set(inputCurrency, data.rates); // Cache the fetched rates
          setError(""); // Clear any previous error
        } else {
          setError("Failed to fetch exchange rates."); // Handle invalid API response
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error); // Log the error
        setError("Failed to fetch exchange rates. Please try again later."); // Display user-friendly error
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchExchangeRates(); // Call the function whenever the input currency changes
  }, [inputCurrency]);

  // Handle the conversion logic
  const handleConvertButton = () => {
    // Validate the amount
    if (amount <= 0) {
      setError("Please enter a valid amount greater than zero."); // Display error for invalid amount
      return;
    }

    // Check if the exchange rate for the output currency is available
    if (exchangeRates[outputCurrency]) {
      const rate = exchangeRates[outputCurrency]; // Get the exchange rate
      setConvertedAmount((amount * rate).toFixed(2)); // Calculate and set the converted amount
      setError(""); // Clear any previous error
    } else {
      setError("Conversion rate not available for the selected currency."); // Handle missing exchange rate
    }
  };

  return (
    <div className="currency-converter-container">
      <h2>Currency Converter</h2>
      {/* Input currency dropdown */}
      <div>
        <label>
          From:
          <select
            value={inputCurrency}
            onChange={(e) => setInputCurrency(e.target.value)}
            aria-label="Select input currency"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Output currency dropdown */}
      <div>
        <label>
          To:
          <select
            value={outputCurrency}
            onChange={(e) => setOutputCurrency(e.target.value)}
            aria-label="Select output currency"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Amount input field */}
      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount"
            aria-label="Enter amount"
          />
        </label>
      </div>
      {/* Convert button */}
      <button onClick={handleConvertButton} disabled={isLoading || amount <= 0}>
        {isLoading ? "Loading..." : "Convert"}
      </button>
      {/* Error message */}
      {error && (
        <div className="error" aria-live="polite">
          {error}
        </div>
      )}
      {/* Converted amount result */}
      {convertedAmount !== null && (
        <div className="result" aria-live="polite">
          <strong>Converted Amount: </strong>
          {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
