# Qadri Steel & Tubes - Platform Changelog

## [2026-09-24 & 2026-09-26] - Major Feature Updates & Role-Based Access Control

### ✨ New Features
*   **Explore QS Tab**: Added a brand new, premium "Explore QS" tab designed to impress users and company leadership. It showcases Qadri Steel's landmark projects (Metro Rail, Warehousing), industrial applications, and quality standards (ISO 9001:2015, 100% Tested).
*   **GST Billing Invoice System**: Created a highly customized, pixel-perfect digital billing system matching the physical Qadri Steel invoice format.
    *   Includes exact placement of QST logo, Tamil typography ("காத்ரி ஸ்டீல் & டியூப்ஸ"), and GSTIN.
    *   Features auto-calculating columns (Quantity × Rate = Amount).
    *   Handles weight extraction (e.g., automatically calculates amount based on weight if specified in particulars like `60x40x2mm (370kg)`).
    *   Auto-calculates CGST (9%), SGST (9%), IGST, and Grand Total.
    *   Includes a dedicated "Print / Save PDF" feature that formats the invoice cleanly for physical printing.

### 🔐 Role-Based Access Control (RBAC) & Security
*   **Strict Manager vs. User Segregation**: Hardened the UI to ensure regular users cannot perform administrative actions.
*   **Product Catalog**:
    *   Regular users can only view products.
    *   Managers (Staff) have exclusive access to "+ Add Product", "Edit", and "Delete" buttons.
    *   Fully integrated with the live Supabase backend for persistent CRUD operations.
*   **Orders Management**:
    *   Users can view order status but cannot modify data.
    *   Deleted the "Trash" icon and "+ Add New Order" button for standard users.
*   **Auth State Fix**: Resolved an issue where a user's browser would cache "Manager" status. The app now strictly resets the role to `viewer` on logout and upon Google/Email login, ensuring manager privileges don't leak to standard users.
*   **Sidebar Visibility**: Unlocked the `Quotations` and `Stock Register` tabs in the sidebar so they are now visible to all users (previously restricted to managers only). Note: Actions within Stock Register remain manager-only.

### 🛠️ Backend & Infrastructure Fixes
*   **Stock Register API Fix**: Resolved an HTTP 500 error on the `/api/stock-register` endpoint. Fixed a Python scoping issue where the `psycopg2` database driver was not imported globally, causing the endpoint to crash in production.
*   **Authentication Routing Fix**: Resolved a "Not Found" error during Google Login by correcting a double `/auth` prefix (`/auth/auth/login` -> `/auth/login`) in the FastAPI router configuration.
*   **Database Reliability**: Disabled `init_db` execution on FastAPI startup to prevent issues with Supabase SSL connection poolers crashing the Render instance.

### 📱 UI / UX Improvements
*   **Mobile Responsiveness**: Implemented CSS media queries and a mobile hamburger menu to ensure the platform fits perfectly on phone screens without needing to switch to "Desktop Mode".
*   **Build Pipeline**: Fixed a critical Vercel build failure caused by a missing `Explore.jsx` file during deployment.
