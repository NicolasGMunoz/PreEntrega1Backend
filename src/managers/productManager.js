import fs from 'fs';

//I create ProductManager class and necessary methods
export default class ProductManager {

    constructor(path) {
        this.path = path;
    }

    //method of return products json
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    //method of create product and push to JSON
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Error to add product, incomplete value");
                return;
            }

            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            const products = await this.getProducts();

            //existing code condition
            const indexCode = products.some(product => product.code === code)
            if (indexCode) {
                console.log(`The product code ${product.code} alredy exists`);
            } else {
                //id generator
                if (products.length === 0) {
                    product.id = 1;
                } else {
                    product.id = products[products.length - 1].id + 1;
                }
                products.push(product);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return product;
        } catch (error) {
            console.log(error);
        }
    }


    //method of return products of JSON by id
    getProductById = async (idProduct) => {
        try {
            const products = await this.getProducts();
            const indexProduct = products.findIndex(product => product.id === idProduct);
            if (indexProduct === -1) {
                return `ID ${idProduct} NOT FOUND `;
            } else {
                return products[indexProduct];
            }
        } catch (error) {
            console.log(error);
        }
    }

    //method of update product in JSON
    updateProduct = async (idProduct, product) => {
        try {
            const products = await this.getProducts();
            const indexProduct = products.findIndex(product => product.id === idProduct);

            if (indexProduct === -1) {
                return console.log(`ID ${idProduct} NOT FOUND `);
            } else {

                Object.assign(products[indexProduct], { title: product.title })
                Object.assign(products[indexProduct], { description: product.description })
                Object.assign(products[indexProduct], { code: product.code })
                Object.assign(products[indexProduct], { price: product.price })
                Object.assign(products[indexProduct], { stock: product.stock })
                Object.assign(products[indexProduct], { category: product.category })
                Object.assign(products[indexProduct], { thumbnail: product.thumbnail })
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                console.log('Update Product successful');
                await this.getProductById(idProduct)
                return 

            }
        } catch (error) {
            console.log(error);
        }
    }

    //method of delete product in array
    deleteProduct = async (idProduct) => {
        try {
            const products = await this.getProducts();
            const indexProduct = products.findIndex(product => product.id === idProduct);

            if (indexProduct === -1) {
                return console.log(`ID ${idProduct} NOT FOUND `);
            } else {
                products.splice(indexProduct, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return console.log(`The product ${idProduct} was deleted successfully`);
            }

        } catch (error) {
            console.log(error);
        }
    }

}

