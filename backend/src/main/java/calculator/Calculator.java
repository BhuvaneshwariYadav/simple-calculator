package calculator;

public final class Calculator {
    public static final int MAX_INPUT_DIGITS = 15;

    private Calculator() {
    }

    public static double parseInput(String value) {
        long digitCount = value.chars().filter(Character::isDigit).count();
        if (digitCount > MAX_INPUT_DIGITS) {
            throw new IllegalArgumentException(
                    "Numbers can contain at most " + MAX_INPUT_DIGITS
                            + " digits. Shorten the number to continue.");
        }
        if (!value.matches("-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)")) {
            throw new IllegalArgumentException(
                    "Enter a number using digits, an optional decimal point, and an optional minus sign.");
        }

        double parsed = Double.parseDouble(value);
        if (!Double.isFinite(parsed)) {
            throw new IllegalArgumentException("Values must be finite numbers.");
        }
        return parsed;
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
