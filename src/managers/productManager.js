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
    addProduct = async (product) => {
        try {

            const products = await this.getProducts();
            if (products.some(p => p.code === product.code)) {
                return `The product code ${product.code} alredy exists`;
            }
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                return "Error to add product, incomplete value";

            }
            //id generator
            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }
            products.push(product);
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
                return false;
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
            const indexProduct = products.findIndex(p => p.id === idProduct);

            if (indexProduct != -1) {
                if (products.some(p => p.code === product.code)) {
                    return false
                }
                else {
                    Object.assign(products[indexProduct], { title: product.title })
                    Object.assign(products[indexProduct], { description: product.description })
                    Object.assign(products[indexProduct], { code: product.code })
                    Object.assign(products[indexProduct], { price: product.price })
                    Object.assign(products[indexProduct], { status: product.status })
                    Object.assign(products[indexProduct], { category: product.category })
                    Object.assign(products[indexProduct], { thumbnail: product.thumbnail })
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                    return true
                }
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
                return false;
            } else {
                products.splice(indexProduct, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return true
            }

        } catch (error) {
            console.log(error);
        }
    }

}

