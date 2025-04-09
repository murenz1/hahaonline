# Finance Management System

A comprehensive finance management system built with Node.js, Express, TypeScript, and Prisma.

## Features

- Financial Dashboard with key metrics and overview
- Invoice Management
- Expense Tracking
- Budget Planning
- Tax Management
- Financial Reports Generation
- Payment Processing

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **File Generation**: PDF, Excel, CSV
- **Testing**: Jest

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finance-management-system.git
cd finance-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database credentials and other settings.

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Financial Dashboard
- `GET /api/finance/dashboard` - Get financial overview

### Invoice Management
- `GET /api/finance/invoices` - Get all invoices
- `POST /api/finance/invoices` - Create a new invoice
- `PUT /api/finance/invoices/:id` - Update an invoice
- `DELETE /api/finance/invoices/:id` - Delete an invoice

### Expense Management
- `GET /api/finance/expenses` - Get all expenses
- `POST /api/finance/expenses` - Create a new expense
- `PUT /api/finance/expenses/:id` - Update an expense
- `DELETE /api/finance/expenses/:id` - Delete an expense

### Budget Management
- `GET /api/finance/budgets` - Get all budgets
- `POST /api/finance/budgets` - Create a new budget
- `PUT /api/finance/budgets/:id` - Update a budget
- `DELETE /api/finance/budgets/:id` - Delete a budget

### Tax Management
- `GET /api/finance/taxes` - Get all tax records
- `POST /api/finance/taxes` - Create a new tax record
- `PUT /api/finance/taxes/:id` - Update a tax record
- `DELETE /api/finance/taxes/:id` - Delete a tax record

### Financial Reports
- `GET /api/finance/reports` - Get all reports
- `POST /api/finance/reports/generate` - Generate a new report

### Payment Processing
- `GET /api/finance/payments` - Get all payments
- `POST /api/finance/payments` - Create a new payment
- `PUT /api/finance/payments/:id` - Update a payment
- `DELETE /api/finance/payments/:id` - Delete a payment
- `POST /api/finance/payments/:id/process` - Process a payment
- `POST /api/finance/payments/:id/refund` - Refund a payment

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 