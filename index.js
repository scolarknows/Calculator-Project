// index.js — cleaned & refactored
// Minimal Responsive Calculator - keyboard + numpad support, error state, scrolling

/* ---------- Top-level DOM refs & state ---------- */
const buttons = document.querySelectorAll('button');
const display = document.querySelector('.display input');

let isError = false; // global error state

/* ---------- Plan-A grouped maps (readable) ---------- */
const keyMap = {
    digits: {},
    operators: {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        'NumpadAdd': '+',
        'NumpadSubtract': '−',
        'NumpadMultiply': '×',
        'NumpadDivide': '÷'
    },
    equals: {
        'Enter': '=',
        'NumpadEnter': '='
    },
    control: {
        'Backspace': '⌫',
        'Delete': '⌫'
    },
    specials: {
        'Escape': 'C',
        '%': '%',
        '.': '.',
        'Period': '.',
        'NumpadDecimal': '.'
    }
};

/* Populate digits once (0-9 and Numpad0-9) */
for (const num of '0123456789') {
    keyMap.digits[num] = num;
    keyMap.digits['Numpad' + num] = num;
}

/* Create a flattened lookup for fast normalization (Plan B) */
const flatMap = {
    ...keyMap.digits,
    ...keyMap.operators,
    ...keyMap.control,
    ...keyMap.equals,
    ...keyMap.specials
};

/* ---------- Helpers ---------- */

function scrollDisplayToEnd() {
    // ensures the most recent content is visible for long expressions
    // for input[type="text"] horizontal scrolling
    display.scrollLeft = display.scrollWidth;
}

function setDisplay(val) {
    display.value = String(val);
    scrollDisplayToEnd();
}

function findButtonByText(text) {
    // exact match against trimmed button text
    const trimmed = String(text).trim();
    for (const btn of buttons) {
        if (btn.textContent.trim() === trimmed) return btn;
    }
    return null;
}

function clickButtonByText(text, preventDefault = true, event = null) {
    const btn = findButtonByText(text);
    if (!btn) return false;
    btn.click();
    if (preventDefault && event) event.preventDefault();
    return true;
}

function isOperator(ch) {
    return ['+', '−', '×', '÷'].includes(ch);
}

/* ---------- Keyboard handler ---------- */

function handleKeydown(event) {
    const normalized = flatMap[event.key] || flatMap[event.code];
    // if nothing mapped, ignore
    if (!normalized) return;

    // find and click matching button (reuse mouse logic)
    const btn = findButtonByText(normalized);
    if (btn) {
        btn.click();
        event.preventDefault();
    }
}

/* ---------- Button click handler (single source of truth) ---------- */

function handleButtonClick(value) {
    // value is the button's visible text (e.g., '5', '+', 'C', '⌫', '=')
    // Early return if no value
    if (value == null) return;

    // --- Error state recovery ---
    if (isError) {
        // Digits
        if (!isNaN(value) && value !== '') {
            setDisplay(value);
            isError = false;
            return;
        }

        // Decimal
        if (value === '.') {
            setDisplay('0.');
            isError = false;
            return;
        }

        // Backspace / Delete (reset)
        if (value === '⌫') {
            setDisplay('0');
            isError = false;
            return;
        }

        // Clear
        if (value === 'C') {
            setDisplay('0');
            isError = false;
            return;
        }

        // Operators, equals, percentage, etc. are ignored in error state
        return;
    }

    // --- Normal flow ---
    // Clear
    if (value === 'C') {
        if (display.value === '0') return;
        setDisplay('0');
        return;
    }

    // Backspace / Delete
    if (value === '⌫') {
        if (display.value === '0') return;
        const newVal = display.value.slice(0, -1) || '0';
        setDisplay(newVal);
        return;
    }

    // Equals - evaluate
    if (value === '=') {
        const expression = display.value;
        const lastChar = expression[expression.length - 1];

        // Prevent evaluation if expression ends with an operator
        if (isOperator(lastChar)) return;

        try {
            // Replace display glyphs with JS operators
            const fixedExpression = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-');

            const result = eval(fixedExpression);

            if (result === Infinity || result === -Infinity) {
                setDisplay('Cannot divide by zero');
                isError = true;
                return;
            }

            // Round small floating results sensibly
            if (!Number.isInteger(result)) {
                setDisplay(Number(result.toFixed(10)));
                return;
            }

            setDisplay(result);
            return;
        } catch (err) {
            // Generic error (parsing etc.)
            setDisplay('Error');
            isError = true;
            return;
        }
    }

    // Percentage - convert last number to percent
    if (value === '%') {
        const lastNum = display.value.split(/[+\−×÷]/).pop();
        const lastChar = display.value[display.value.length - 1];

        if (isOperator(lastChar) || display.value === '0') return;

        const percentage = lastNum * 0.01;
        const index = display.value.length - lastNum.length;
        const before = display.value.slice(0, index);
        setDisplay(before + percentage);
        return;
    }

    // Decimal
    if (value === '.') {
        const lastNum = display.value.split(/[+\−×÷]/).pop();
        if (lastNum.includes('.')) return;

        const lastChar = display.value[display.value.length - 1];
        if (isOperator(lastChar)) {
            setDisplay(display.value + '0.');
        } else {
            setDisplay(display.value + '.');
        }
        return;
    }

    // Operators
    if (isOperator(value)) {
        // Prevent operators at very start
        if (display.value === '0') return;

        const lastChar = display.value[display.value.length - 1];

        // Replace last operator if present, else append
        if (isOperator(lastChar)) {
            setDisplay(display.value.slice(0, -1) + value);
        } else {
            setDisplay(display.value + value);
        }
        return;
    }

    // Numbers (0-9)
    // If display shows '0' replace it; otherwise append
    if (!isNaN(value)) {
        if (display.value === '0') {
            setDisplay(value);
        } else {
            setDisplay(display.value + value);
        }
        return;
    }

    // Fallback: ignore unknown values
}

/* ---------- Initialization ---------- */

function attachButtonListeners() {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => handleButtonClick(btn.textContent));
    });
}

function attachKeyboardListener() {
    document.addEventListener('keydown', handleKeydown);
}

function init() {
    attachButtonListeners();
    attachKeyboardListener();
    // Ensure display is correct on load
    setDisplay(display.value || '0');
}

init();

/* ---------- End of file ---------- */
