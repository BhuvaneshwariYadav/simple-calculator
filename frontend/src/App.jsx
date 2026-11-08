import React, { useState } from "react";

const MAX_INPUT_DIGITS = 15;
const INCOMPLETE_NUMBER_PATTERN = /^-?\d*\.?\d*$/;
const NUMBER_PATTERN = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;

const operations = [
  { value: "add", label: "Add", symbol: "+" },
  { value: "subtract", label: "Subtract", symbol: "−" },
  { value: "multiply", label: "Multiply", symbol: "×" },
  { value: "divide", label: "Divide", symbol: "÷" },
  { value: "percent", label: "Percent", symbol: "%" },
];

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }).format(value);
}

function getInputError(value) {
  if (!INCOMPLETE_NUMBER_PATTERN.test(value)) {
    return "Enter a number using digits, an optional decimal point, and an optional minus sign.";
  }
  if (value.replace(/\D/g, "").length > MAX_INPUT_DIGITS) {
    return `Numbers can contain at most ${MAX_INPUT_DIGITS} digits. Shorten the number to continue.`;
  }
  return "";
}

export default function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateNumber(value, setValue) {
    const inputError = getInputError(value);
    if (inputError) {
      setError(inputError);
      return;
    }
    setValue(value);
    setError("");
    setResult(null);
  }

  async function calculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (first.trim() === "" || second.trim() === "") {
      setError("Enter both numbers to continue.");
      return;
    }
    if (!NUMBER_PATTERN.test(first) || !NUMBER_PATTERN.test(second)) {
      setError("Enter a complete number in both fields before calculating.");
      return;
    }
    const inputError = getInputError(first) || getInputError(second);
    if (inputError) {
      setError(inputError);
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({ operation, a: first, b: second });
      const response = await fetch(`http://localhost:8080/api/calculate?${query}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setResult(data.result);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Can't reach the Java backend. Make sure it is running on port 8080."
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedOperation = operations.find((item) => item.value === operation);

  return (
    <main className="page">
      <section className="calculator" aria-labelledby="page-title">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">∑</div>
          <span>JAVA × REACT</span>
        </div>

        <header className="heading">
          <p className="eyebrow">A little math, made simple</p>
          <h1 id="page-title">Calculator<span>.</span></h1>
          <p className="subtitle">Choose an operation and let’s work it out.</p>
        </header>

        <form onSubmit={calculate}>
          <label className="field-label" htmlFor="first-number">First number</label>
          <input
            id="first-number"
            type="text"
            inputMode="decimal"
            value={first}
            onChange={(event) => updateNumber(event.target.value, setFirst)}
            placeholder="e.g. 24"
            autoComplete="off"
          />
          <p className="helper-text">
            Each number is limited to {MAX_INPUT_DIGITS} digits; the decimal point and minus sign don’t count.
          </p>

          <fieldset className="operation-field">
            <legend className="field-label">Operation</legend>
            <div className="operation-grid">
              {operations.map((item) => (
                <button
                  className={`operation-button${operation === item.value ? " selected" : ""}`}
                  type="button"
                  key={item.value}
                  aria-pressed={operation === item.value}
                  onClick={() => setOperation(item.value)}
                >
                  <span className="operation-symbol" aria-hidden="true">{item.symbol}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field-label" htmlFor="second-number">Second number</label>
          <input
            id="second-number"
            type="text"
            inputMode="decimal"
            value={second}
            onChange={(event) => updateNumber(event.target.value, setSecond)}
            placeholder="e.g. 6"
            autoComplete="off"
          />
          {operation === "percent" && (
            <p className="helper-text">Calculates the first number as a percentage of the second.</p>
          )}

          <button className="calculate-button" type="submit" disabled={loading}>
            {loading ? "Calculating…" : "Calculate"}
            {!loading && <span aria-hidden="true">↗</span>}
          </button>
        </form>

        {error && <p className="message error" role="alert">{error}</p>}
        {result !== null && (
          <div className="result" aria-live="polite">
            <div>
              <span className="result-label">Your result</span>
              <p className="result-equation">
                {formatNumber(Number(first))} {selectedOperation.symbol} {formatNumber(Number(second))}
              </p>
            </div>
            <output className="result-value">{formatNumber(result)}</output>
          </div>
        )}

        <footer>Calculations are handled by your Java backend.</footer>
      </section>
    </main>
  );
}
