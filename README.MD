# 📈 Trade Trackr

**Trade Trackr** is a personal trading journal and performance tracker built to help traders review, analyze, and improve their decision-making. Whether you're a momentum trader, swing trader, or scalper, Trade Trackr provides the tools to log trades and reflect on outcomes.

Check out the live demo: **[Trade Trackr](https://a-sarayut.github.io/trade-trackr/)**

![alt text](/utils/trade-trackr-home.png)
![alt text](/utils/trade-trackr-new-trade.png)

---

## ✨ Features

- 🚀 Track trade entries, exits, and PNL
- 📊 View performance statistics (total trade, win rate, total PNL)
- 📝 Add notes to each trade
- 📤 Export trade data in JSON and CSV formats
- 💾 100% client-side: data saved in your browser with **localStorage**

---

## 🛠 Tech Stack

- **Frontend**: Vue.js / Nuxt 3
- **Styling**: Tailwind CSS / Nuxt UI
- **State Management**: Pinia
- **Storage**: `localStorage` (no backend, no database)

---

## 🚀 Getting Started

### Development environment

- Node.js v22.16.0
- Bun 1.2.16

### Installation

```bash
git clone https://github.com/A-Sarayut/trade-trackr.git
cd trade-trackr
cd frontend-nuxt
bun install
bun run dev
```

### Installation (Docker)

```bash
cd trade-trackr
cd frontend-nuxt
docker build -t trade-trackr-dev .     
docker run -p 3000:3000 trade-trackr-dev
```
