<p align="center">
  <img src="https://staclara.com.ph/wp-content/uploads/2021/08/SCIC-trans-logo-new-FULL.png" alt="Sta. Clara Logo" width="300"/>
</p>

<h1 align="center" style="font-size: 2.5rem;">
  STA. CLARA INTERNATIONAL CORPORATION
</h1>

<h2 align="center" style="font-size: 1.5rem;">
  Pre-Employment Worksheet Activity Submission
</h2>

<p align="center">
  Section 2: Coding – 2.1.1 Secret Page App
</p>

---

This repository contains my submission for the **Sta. Clara International Corporation Pre-Employment Worksheet Activity**, specifically under **Section 2: Coding – 2.1.1 Secret Page App** of the Trainee Section. The task involves building a simple authentication-based app with interactive secret pages.

## 🌐 Live Web App

Access the deployed **Secret Page App** here:  
👉 [https://secret-page-app-by-jeff.vercel.app/](https://secret-page-app-by-jeff.vercel.app/)

## 🔐 Evaluation Account

Use the following credentials to explore the features:

- **Email:** dev@staclara.com.ph  
- **Password:** staclara

> ⚠️ **Note:** This account is for evaluation purposes only. Please use it only for identifying implemented features.

---

## ✅ Features Implemented

### `/` (Root Page)

- 🔐 **Unauthenticated users** land here by default.
- ✅ Users can **log in** and **register** an account.

### `/` (After Authentication)

- ✅ Authenticated users can:
  - Navigate to `secret-page-1`, `secret-page-2`, and `secret-page-3`
  - **Log out**
  - **Delete their own account**

---

### `/secret-page-1`

- ✅ Authenticated users can view a **secret message**.

---

### `/secret-page-2`

- ✅ Inherits all features from `secret-page-1`
- ✅ Users can **add** their own secret message
- ✅ Users can **overwrite** (CRUD) their secret message

---

### `/secret-page-3`

- ✅ Inherits features from both `secret-page-1` and `secret-page-2`
- ✅ Users can **add and manage friends**
- ✅ **Friends** can view each other’s secret messages
- 🔒 Attempting to view messages of **non-friends** results in a **403 Forbidden** error

---

<p align="center"><b>Thank you for the opportunity to demonstrate my skills through this activity!</b></p>
