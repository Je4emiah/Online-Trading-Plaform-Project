# 🔄 Trady [Prototype Phase]

_Trady_ is an agile, cross-platform peer-to-peer online trading hub designed around automated communication efficiency. 

Traditional online marketplaces suffer from chaotic, unstructured communication channels that result in slow response times or dropped sales. Trady resolves this issue by pairing an organized commodity listing board with a **dynamic multi-channel messaging pipeline**. Buyers can review, customize, and launch pre-formatted transaction templates directly into a verified seller's preferred communication app with a single click.

---

## 🛠️ Current Implemented Features

*   **Flask & SQLite Dynamic Feed:** A functional Python backend that loops through an embedded SQLite relational database (`trady.db`) and dynamically injects real-time values into the frontend view, eliminating hardcoded HTML attributes.
*   **Structured Listing Cards:** Clear, color-coded separation of **WTS (Want to Sell)** and **WTB (Want to Buy)** listings displaying custom descriptions, pricing, and live user availability status elements.
*   **Live Message Preview Box:** An interactive `textarea` component inside the deal dashboard. When a buyer clicks **⚡ Deal**, the platform generates a baseline message with custom item variables. The buyer can edit this message freely, and JavaScript updates all connection links in real time as they type.
*   **Verified Direct Messaging (Sandbox Mode):** Single-click custom deep links that pass the live, user-edited message payloads directly into external applications:
    *   **WhatsApp:** Dynamic `wa.me` API integration.
    *   **Telegram:** Custom text-hook profile routing.
    *   **Email:** System native `mailto:` connection string parsing.
