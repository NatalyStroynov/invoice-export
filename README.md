# Invoice Export

This project is a full-stack application for submitting invoices and generating PDF exports.  
It consists of an Angular frontend and a Node.js (Express) backend.

## Features

- Invoice form submission
- Signature pad support
- PDF generation and download
- REST API for invoice data

## Technologies

- Angular 17
- Node.js + Express
- Material UI
- Jasmine + Karma (unit tests)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```sh
npm install
```

### Running the Application

To start both the Angular frontend and Node.js backend together:

```sh
npm run dev
```

- Angular app runs on [http://localhost:4200](http://localhost:4200)
- Express server runs on [http://localhost:3000](http://localhost:3000)

### Running Tests

```sh
npm test
```

## Project Structure

- `/src` — Angular frontend
- `/server.js` — Express backend
- `/package.json` — Project configuration and scripts

## API Endpoints

- `POST /api/invoice` — Submit invoice data
- `GET /api/invoice/:id/pdf` — Download invoice PDF

## License

MIT
