**Product API Tests**
This repository contains a set of automated tests for interacting with a Product API. These tests cover the following operations:

**Test Coverage**
Check API Health: Verifies the health of the API.

Get All Products: Fetches and verifies the list of all products.

Create a New Product: Creates a new product and verifies the creation process.

Get Product by ID: Fetches a product by its ID and validates the response.

Update Product: Updates an existing product and validates the update.

Delete Product: Deletes a product and retries the operation in case of a 429 Too Many Requests status.

Get Non-Existing Product: Tests retrieval of a non-existing product and verifies the response status (404 or 400).

**Requirements**
Node.js (version 12 or higher)

npm (or yarn)

**Setup Instructions**
**1. Clone the Repository**
bash
Copy
Edit
git clone https://github.com/your-username/product-api-tests.git
cd product-api-tests
**2. Install Dependencies**
Run the following command to install the necessary dependencies:
bash
Copy
Edit
npm install
**3. Environment Variables**
Ensure that the necessary environment variables for the API (e.g., API URL, authentication tokens) are set. These may need to be specified in a .env file or another configuration file, depending on your environment.

**4. Run the Tests**
To execute the test suite, run:
bash
Copy
Edit
npm test
This will execute all tests in the test folder and report results in the terminal.

CI Configuration (GitHub Actions)
To automate tests on every commit or pull request, a CI configuration using GitHub Actions is included.

The workflow is defined in .github/workflows/test.yml.

You can modify the workflow to fit your requirements.

**GitHub Actions CI Workflow Example**
yaml
Copy
Edit
name: Run API Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
Test Output
When you run the tests, you should see an output similar to the following:

bash
Copy
Edit
> product-api-tests@1.0.0 test /path/to/repo
> jest

PASS  test/products.test.js
  Product API Tests
    ✓ Check API health (xx ms)
    ✓ Get all products (xx ms)
    ✓ Create a new product (xx ms)
    ✓ Get product by ID (xx ms)
    ✓ Update product (xx ms)
    ✓ Delete product (xx ms)
    ✓ Get non-existing product should return 404 or 400 (ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total

**Issues and Bugs**
**1. Rate Limiting**
In the Delete Product test, if the API returns a 429 Too Many Requests status, the test retries the deletion up to 5 times, with a 10-second delay between each attempt.

**2. Product Deletion Cleanup**
The afterAll hook ensures that any created products are deleted to avoid leaving orphaned data in the system.

**Future Improvements**
Add more test cases for additional API endpoints (search products, filter products).

Implement detailed logging for each API call to improve debugging.

License
This project is licensed under the MIT License – see the LICENSE file for details.
