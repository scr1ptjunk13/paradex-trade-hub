# Full‑Stack Assignment: Paradex Trading Interface

## High‑Level Goal

Build a **minimal but functional trading screen** that allows a user to:

1. Connect their EVM wallet (which already has a funded Paradex account)
2. Select a market
3. Enter position size and leverage
4. View available balance
5. Place a trade
6. View active positions

The layout and structure should resemble common perp exchanges (Paradex, Hyperliquid, Lighter, etc.). A rough UI reference is provided below.

![image.png](attachment:fe8180e4-4076-4bf3-9d88-4729c7140434:image.png)

---

## Functional Requirements

### 1. Wallet Connection

- User should be able to connect an **EVM wallet** (MetaMask, Rabby, etc.)
- We can assume the connected wallet will already have a **Paradex account** with funds

---

### 2. Market Selector (Top Left)

- Dropdown should list **available markets** from Paradex
- Example: BTC‑USD, ETH‑USD, etc.

You can ignore market metadata such as: price, volume, open interest, funding or hardcode it.

---

### 3. Market Info Bar (Top)

Show basic market info such as: price, funding rate, volume

These values can be hardcoded. They do **not** need to be live or accurate

---

### 4. Trading Panel (Right Side)

This is the most important section.

You do **not** need advanced features like:

- Limit orders
- Cross / isolated margin selection
- Liquidation price display

We are only evaluating **core functionality**:

### Required Features

1. Enter **position size**
2. Set **leverage** (slider or preset buttons like 1x / 5x / 10x)
3. Display **available balance**
4. Place a **market trade**

### Expectations

- Inputs should be validated
- Show clear errors for:
    - Insufficient balance
    - Invalid size
    - Wallet not connected
- Button states should make sense (disabled vs enabled)

---

### 5. Active Positions Panel (Bottom)

- Display all **active positions** for the connected account
- Fetch this data from the **Paradex API**

Minimal fields are enough. No advanced position management is required.

---

### 6. Things You Should NOT Implement

- ❌ Price charts / graphs
- ❌ Advanced order types
- ❌ Real‑time market data streaming
- ❌ Full exchange feature parity

---

## Technical Expectations

- Frontend structure should be clean and readable
- Use Next.js 14, Tailwind and RainbowKit
- Clear separation of concerns
- Reasonable error handling

---

## What You Will Be Judged On

### 1. Functionality (Most Important)

- Wallet connects successfully
- Uses the connected wallet’s existing Paradex account
- Trades can actually be placed
- Active positions are correctly fetched

This must work end‑to‑end.

---

### 2. Design Instincts

We don’t have designers.

We expect engineers to:

- Have good visual judgment
- Build clean, readable, intuitive UIs
- Avoid clutter and unnecessary complexity

You don’t need polish perfection — but you **do** need taste.

---

### 3. Idiot‑Proof UX

Assume users will do everything wrong:

- Click buttons too early
- Have insufficient balance
- Forget to connect wallet
- Enter nonsense values

We haven’t provided detailed UX flows on purpose.

👉 We want to see how *you* think about:

- Empty states
- Error states
- Loading states
- Guardrails

---

## Submission

Please include:

- A GitHub repository
- Clear README with setup instructions
- BONUS 🎉: host the app!

If something is unclear, make a reasonable assumption and document it.

---

## Good References

1. Paradex API Docs: https://docs.paradex.trade/api/general-information/rate-limits/api
2. Paradex Python SDK: https://docs.paradex.trade/api/general-information/rate-limits/api
3. Paradex JS SDK: https://github.com/tradeparadex/paradex.js

---

## AI Usage

We **highly encourage** the use of AI tools (ChatGPT, Copilot, Cursor, etc.) to help you move faster and be more productive.

That said:

- Be aware of the **design and technical choices** you’re making
- Be prepared to **explain and defend** those choices if asked
- Blindly copying without understanding will be very obvious

We care less about *how* you got there and more about *why* you built things the way you did.

---

## Asking Questions

If you have **any questions, doubts, or ambiguities** during the assignment, feel free to reach out.

- Asking good questions is a **positive signal**
- We’d much rather clarify early than see incorrect assumptions later