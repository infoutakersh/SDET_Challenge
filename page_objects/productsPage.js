const request = require('supertest');
require('dotenv').config();

class ProductsPage {
    constructor() {
        this.baseUrl = process.env.BASE_URL;
        this.apiToken = process.env.API_TOKEN;

        console.log("Base URL:", this.baseUrl);
        console.log("API Token:", this.apiToken);
    }

    async getAllProducts() {
        const response = await request(this.baseUrl)
            .get('/api/products')
            .set('Authorization', `Bearer ${this.apiToken}`);

        console.log("Get All Products Response:", response.status, response.body);
        return response;
    }

    async getProductById(id) {
        const response = await request(this.baseUrl)
            .get(`/api/products/${id}`)
            .set('Authorization', `Bearer ${this.apiToken}`);

        console.log(`Get Product by ID (${id}) Response:`, response.status, response.body);
        return response;
    }

    async createProduct(productData) {
        const response = await request(this.baseUrl)
            .post('/api/products')
            .set('Authorization', `Bearer ${this.apiToken}`)
            .send(productData);

        console.log("Create Product Response:", response.status, response.body);
        return response;
    }

    async updateProduct(id, productData) {
        const response = await request(this.baseUrl)
            .put(`/api/products/${id}`)
            .set('Authorization', `Bearer ${this.apiToken}`)
            .send(productData);

        console.log(`Update Product (${id}) Response:`, response.status, response.body);
        return response;
    }

    async deleteProduct(id) {
        let attempts = 0;
        let waitTime = 2000;

        while (attempts < 5) {
            const response = await request(this.baseUrl)
                .delete(`/api/products/${id}`)
                .set('Authorization', `Bearer ${this.apiToken}`);

            console.log(`Delete Product (${id}) Response:`, response.status, response.body);

            if (response.status !== 429) return response;

            attempts++;
            console.warn(`Received 429, retrying in ${waitTime / 1000}s... (${attempts})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            waitTime *= 2;
        }

        throw new Error("Delete request failed after multiple attempts");
    }


    async checkHealth() {
        const response = await request(this.baseUrl).get('/health');
        console.log("API Health Check Response:", response.status, response.body);
        return response;
    }
}

module.exports = new ProductsPage();
