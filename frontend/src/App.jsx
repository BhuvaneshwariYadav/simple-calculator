import React, { useState } from "react";

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

export default function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function calculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (first.trim() === "" || second.trim() === "") {
      setError("Enter both numbers to continue.");
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
            type="number"
            step="any"
            value={first}
            onChange={(event) => setFirst(event.target.value)}
            placeholder="e.g. 24"
            autoComplete="off"
          />

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
            type="number"
            step="any"
            value={second}
            onChange={(event) => setSecond(event.target.value)}
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
