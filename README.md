# Paypaxe

**Paypaxe** is a subscription-based financial management system designed to help users manage their expenses, income, and financial goals. The system integrates with Paystack for payment processing and supports various subscription plans, including basic and premium. The application also supports account types like individual, trader, and business accounts, with specific endpoints accessible based on the subscription plan and account type.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Testing](#testing)

## Features

- **User Account Management:** Supports various account types like individual, trader, and business.
- **Subscription Management:** Manage subscription plans (basic and premium), with automatic renewals and payment processing via Paystack.
- **Financial Management:** Users can add and track expenses, income, and financial goals.
- **Paystack Integration:** Seamless payment processing for subscription plans.
- **Notification System:** Notify users when their subscription is about to expire or when a financial goal is nearing its deadline.

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Gateway:** Paystack
- **Testing:** Jest, Supertest
- **Environment Configuration:** dotenv
- **Code Quality:** ESLint, Prettier

## Installation

### Prerequisites

- Node.js (>=14.x)
- MongoDB
- Paystack Account (for payment integration)

### Steps

1. **Clone the Repository:**

   ```bash
    git clone https://github.com/dejmartins/paypaxe.git
    cd paypaxe

2. **Install Dependencies:**

   ```bash
    npm install
   
3. **Set Up Environment Variables:**

    Create a `.env` file in the root directory and add the following environment variables:

   ```bash
    PORT=
    NODE_ENV=
    MONGODB_URI=
    SALT_WORK_FACTOR=
    PUBLIC_KEY=
    PRIVATE_KEY=
    ACCESS_TOKEN_TTL=
    REFRESH_TOKEN_TTL=
    VERIFICATION_TOKEN_TTL=
    PP_API_KEY=
    PP_PK=
    PP_SK=
    EMAIL_USER=
    EMAIL_PASS=
    CLIENT_URL=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    PAYSTACK_INITIALIZE_URL=
    PAYSTACK_SECRET_KEY=
    BASIC_PLAN_FEE=
    PREMIUM_PLAN_FEE=

4. **Start the Application:**

   ```bash
   npm run dev


### Testing

**Paypaxe** includes unit and integration tests.

1. **Run Tests:**

   ```bash
   npm run dev