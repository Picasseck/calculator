A small calculator built with HTML, CSS and javascript

## Goal
Build aclean calculator step by step

## Summary
This PR adds the initial calculator skeleton.

### step 1 - UI skeleton
- Added semantic HTML structure (display + keypad).
- Added minimal CSS to make the layout readable.
- Added a small JS bootstrap to confirm button clicks are wired.

### Step 2 — Digit input
- Added digit input (0–9) and decimal support.
- Added input length limit and basic display updates.

### Step 3 — Operations
- Added operators (+, −, ×, ÷) and equals evaluation.
- Added delete (DEL) and percent (%).
- Added basic error handling (division by zero).

## Step 4 — Keyboard Support (AZERTY)

This step adds keyboard controls to the calculator so it works naturally with:
- AZERTY keyboards (top row keys),
- Numpad digits,
- common operator keys (+ - * /),
- Enter for equals, Backspace for delete, Escape for clear.