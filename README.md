# StyleSynk Bharat (Open Source Engine)

**StyleSynk Bharat** is a lightweight, frontend-first e-commerce aggregator engine designed for the Indian fashion market. 

> **Current Status:** This repository contains the **core application engine** and **UI design system**. The product catalog is currently empty by design to serve as a clean slate for developers and collaborators.

## 🚀 Project Goal
The goal of this project is to build a decentralized, community-driven fashion discovery platform for India ("Bharat"). We have built the chassis—a beautiful, responsive UI with smart filtering logic—and now we are looking for collaborators to help build the engine that powers it.

## 💻 What's Inside?
This repo provides a fully functional **Frontend Architecture** without the data bloat:
-   **Premium UI System**: Glassmorphism design, dark mode, and smooth micro-animations.
-   **Aggregator Logic**: JavaScript-based filtering for Brands, Categories, and Price.
-   **"My Closet" Engine**: A local-storage based wishlist system that works without a backend.
-   **PWA Ready**: Manifest and Service Worker included for mobile installability.

## 🤝 Call for Collaboration
We are looking for contributors! The project is ready for:
1.  **Data Integration**: Connecting to real APIs or building a scraper to populate `products` in `app_final_v10.js`.
2.  **Backend Development**: Migrating the client-side array to a real database (Firebase/Supabase).
3.  **Authentication**: Adding user login so "My Closet" works across devices.

## 🛠️ How to Run
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/yourusername/StyleSynk.git
    ```
2.  **Open `index.html`**:
    Simply open the file in your browser. The UI will load, but the product grids will be empty.
3.  **Add Test Data**:
    Open `assets/js/app_final_v10.js` and add a dummy product to the `products` array to see it appear instantly:
    ```javascript
    const products = [
      {
        id: 1,
        brand: "TEST BRAND",
        name: "Test Dress",
        price: 999,
        image: "https://via.placeholder.com/300"
      }
    ];
    ```
 ## ✍️ Author & Credits

- **Developed by:** Disha Polamarasetti
- **Role:** Data Science Student |HTML, AI & ML Enthusiast
- **Objective**:To build a lightweight, open-source fashion aggregator engine that unifies product discovery and price comparison across India's top clothing brands
- **Contact:**[GitHub](https://github.com/dpolamar-eng) | [LinkedIn Profile](https://www.linkedin.com/in/disha-pol)


## 📄 License
Distributed under the MIT License. This is an open-source initiative.

