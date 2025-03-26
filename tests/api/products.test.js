const productsPage = require('../../page_objects/productsPage');

describe('Product API Tests', () => {
    let createdProductId;

    test('Check API health', async () => {
        const res = await productsPage.checkHealth();
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('Get all products', async () => {
        const res = await productsPage.getAllProducts();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('Create a new product', async () => {
        const newProduct = { name: 'Test Product', price: 100, stock: 10, category: 'Uncategorized' };
        const res = await productsPage.createProduct(newProduct);

        expect([200, 201]).toContain(res.status);
        expect(res.body).toHaveProperty('product');
        expect(res.body.product).toHaveProperty('id');

        createdProductId = res.body.product.id;
        console.log("Created Product ID:", createdProductId);
    });

    test('Get product by ID', async () => {
        expect(createdProductId).toBeDefined();

        const res = await productsPage.getProductById(createdProductId);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('product');
        expect(res.body.product).toHaveProperty('id', createdProductId);
    });

    test('Update product', async () => {
        expect(createdProductId).toBeDefined();

        const updateData = { name: 'Updated Product', price: 150 };
        const res = await productsPage.updateProduct(createdProductId, updateData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('product');
        expect(res.body.product).toHaveProperty('id', createdProductId);
        expect(res.body.product).toHaveProperty('name', 'Updated Product');
        expect(res.body.product).toHaveProperty('price', 150);
    });

    test('Delete product', async () => {
        expect(createdProductId).toBeDefined();

        let attempts = 0;
        let res;

        while (attempts < 5) {
            res = await productsPage.deleteProduct(createdProductId);

            if (res.status !== 429) break;
            attempts++;
            console.warn(`Received 429, retrying in 10s... (${attempts})`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s before retrying
        }

        expect(res.status).toBe(200);
    }, 60000);

    test('Get non-existing product should return 404 or 400', async () => {
        const res = await productsPage.getProductById('nonexistent-id');
        expect([400, 404]).toContain(res.status);
    });

    afterAll(async () => {
        if (createdProductId) {
            console.log(`Cleaning up product ID: ${createdProductId}`);
            await productsPage.deleteProduct(createdProductId).catch(err =>
                console.warn(`Failed to delete product during cleanup: ${err.message}`)
            );
        }
    });
});
