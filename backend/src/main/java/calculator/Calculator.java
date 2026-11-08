package calculator;

public final class Calculator {
    private Calculator() {
    }

    public static double calculate(String operation, double first, double second) {
        if (!Double.isFinite(first) || !Double.isFinite(second)) {
            throw new IllegalArgumentException("Values must be finite numbers.");
        }

        double result = switch (operation.toLowerCase()) {
            case "add" -> first + second;
            case "sub", "subtract" -> first - second;
            case "multiply", "mul" -> first * second;
            case "divide", "division", "div" -> {
                if (second == 0) {
                    throw new IllegalArgumentException("Cannot divide by zero.");
                }
                yield first / second;
            }
            case "percent" -> first * second / 100;
            default -> throw new IllegalArgumentException("Unsupported operation.");
        };
        if (!Double.isFinite(result)) {
            throw new IllegalArgumentException("Result is outside the supported numeric range.");
        }
        return result;
    }
}
