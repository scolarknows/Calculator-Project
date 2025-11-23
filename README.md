# 📱 **Minimal Responsive Calculator**

A clean, modern calculator built with **vanilla HTML, CSS, and JavaScript** — designed to be fully responsive, keyboard-friendly, numpad-compatible, and highly polished for real-world usage. Features include smart operator normalization, error-state recovery, long-expression auto-scrolling, and careful input validation.

This project is intentionally minimal, readable, and crafted to showcase strong frontend engineering fundamentals.

---

# 🚀 Live Demo

**▶ https://YOUR_GITHUB_USERNAME.github.io/minimal-responsive-calculator/**  
*(replace YOUR_GITHUB_USERNAME after deploying via GitHub Pages)*

---

# ✨ Features

### 🔢 Core Calculator Functions
- Add, subtract, multiply, divide  
- Decimal support with correct placement rules  
- Percentage (%) operator  
- Backspace (⌫) and clear (C)  
- Accurate evaluation of long expressions  
- Smart prevention of invalid cases (like trailing operators)

### ⌨️ Full Keyboard + Numpad Support
- Top-row digits (0–9)  
- Numpad digits (`Numpad0–Numpad9`)  
- Operators from both keyboard and numpad  
- Decimal from `.` / `Period` / `NumpadDecimal`  
- Backspace/Delete → `⌫`  
- `Esc` → Clear  
- `Enter` / `NumpadEnter` → Equals  

Powered by a clean, flattened `keyMap` that normalizes keys using:

```js
const normalizedKey = flatMap[event.key] || flatMap[event.code];
```

### 🧠 Smart Error State (Divide-by-Zero Recovery)

When a user divides by zero:

- Display shows: **“Cannot divide by zero”**
- Calculator enters a controlled **error mode**
- Only digits, decimal, backspace, and clear are allowed  
- Operators and equals are ignored  
- The first valid input exits error state cleanly  

### 🖼 UI / UX Enhancements
- Responsive layout (mobile to desktop)
- Display auto-scrolls to the end for long expressions
- Clean button transitions & consistent spacing  
- Unified click + keyboard behavior  
- No external libraries — pure vanilla JS  

---

# ⌨️ Keyboard Controls

| Action | Keys |
|-------|------|
| Digit | `0–9`, `Numpad0–Numpad9` |
| Add | `+`, `NumpadAdd` |
| Subtract | `-`, `NumpadSubtract` |
| Multiply | `*`, `NumpadMultiply` |
| Divide | `/`, `NumpadDivide` |
| Decimal | `.`, `Period`, `NumpadDecimal` |
| Percentage | `%` |
| Equals | `Enter`, `NumpadEnter` |
| Backspace | `Backspace`, `Delete` |
| Clear | `Esc` |

---

# 🧪 Testing Scenarios

### Digits & Operators
- `1234567890`  
- `12+34-56×78÷9`  
- Long expressions auto-scroll

### Error Handling
- `5 ÷ 0 =` → error message  
- Digit after error → resets  
- Operator after error → ignored  

### Edge Cases
- Prevent multiple decimals  
- No leading operator  
- No trailing operator  
- Backspace recovers correctly  

---

# 🛠 Project Structure

```
calculator/
│
├── index.html
├── index.css
├── index.js
│
├── README.md
└── assets/
       ├── screenshot-light.png
       └── screenshot-dark.png (optional)
```

---

# 🧩 Code Architecture

### Grouped Maps (Plan A)
Keys are organized into categories:

```js
keyMap = {
  digits: {},
  operators: {},
  equals: {},
  control: {},
  specials: {}
}
```

### Dynamic Digit Population

```js
for (const num of "0123456789") {
  keyMap.digits[num] = num;
  keyMap.digits["Numpad" + num] = num;
}
```

### Flattened Lookup Table (Plan B)

```js
const flatMap = {
  ...keyMap.digits,
  ...keyMap.operators,
  ...keyMap.control,
  ...keyMap.equals,
  ...keyMap.specials
}
```

### Unified Keyboard & Click Pipeline
Every keyboard press becomes a button click:

```js
button.click();
```

### Controlled Error Mode
Divide-by-zero sets:

```js
isError = true;
```

Error mode allows only:

- digits  
- decimal  
- backspace  
- clear  

Operators, equals, %, etc. are ignored.

---

# 🚀 Running Locally

Clone:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/minimal-responsive-calculator.git
```

Open:

```
index.html
```

No build step required.

---

# 🌐 Deploying (GitHub Pages)

1. Push code to GitHub  
2. Go to **Settings → Pages**  
3. Source: `main` → `/ (root)`  
4. Save  

Your site will appear at:

```
https://YOUR_GITHUB_USERNAME.github.io/minimal-responsive-calculator/
```

---

# 📝 License

MIT License — free to use, modify, and share.

---

# 🎉 Future Enhancements (Optional)

- Dark mode toggle  
- Memory buttons (M+, M-, MR)  
- Calculation history slide panel  
- Animated keypress feedback  
- Replace `eval` with a custom expression parser  

