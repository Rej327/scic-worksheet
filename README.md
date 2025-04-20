# Sta. Clara Pre-Employment Worksheet Activity Submission

This repository contains my submission for the **Sta. Clara Pre-Employment Worksheet Activity**, specifically under **Section 2: Coding – 2.1.1 Secret Page App** of the Trainee Section. The task involves building a simple authentication-based app with interactive secret pages.

## 🌐 Live Web App

Access the deployed **Secret Page App** here:  
👉 [https://secret-page-app-by-jeff.vercel.app/](https://secret-page-app-by-jeff.vercel.app/)

## 🔐 Evaluation Account

Use the following credentials to explore the features:

-   **Email:** dev@staclara.com.ph
-   **Password:** staclara

> ⚠️ **Note:** This account is for evaluation purposes only. Please use it only for identifying implemented features.

---

## ✅ Features Implemented

### `/` (Root Page)

-   🔐 **Unauthenticated users** land here by default.
-   ✅ Users can **log in** and **register** an account.

### `/` (After Authentication)

-   ✅ Authenticated users can:
    -   Navigate to `secret-page-1`, `secret-page-2`, and `secret-page-3`.
    -   **Log out**
    -   **Delete their own account**

---

### `/secret-page-1`

-   ✅ Authenticated users can view a **secret message**.

---

### `/secret-page-2`

-   ✅ Inherits all features from `secret-page-1`.
-   ✅ Users can **add** their own secret message.
-   ✅ Users can **overwrite** (edit) their secret message.

---

### `/secret-page-3`

-   ✅ Inherits features from both `secret-page-1` and `secret-page-2`.
-   ✅ Users can **CRUD users as friends**
-   ✅ **Friends** can view each other’s secret messages.
-   🔒 Attempting to view messages of **non-friends** results in a **403 Forbidden** error.

---

## 📝 Submission Contents

-   📄 This `README.md`
-   ✅ A working implementation deployed via Vercel

## 📌 Notes

-   Navigation bar is included for ease of access (optional enhancement).
-   The app structure is modular to promote reusability and clarity across secret pages.

---

**Thank you for the opportunity to demonstrate my skills through this activity!**
