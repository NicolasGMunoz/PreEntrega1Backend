import { Router } from "express";
import ProductManager from '../managers/productManager.js'
import { __dirname } from '../util.js'
import path from 'node:path';


const router = Router();
const productsPath = path.join(__dirname, './files/products.json');
const productManager = new ProductManager(productsPath);

//Endpoint que muestra todos los productos y puede recibir un query param para mostrar menos productos si el cliente lo desea
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const limit = Number(req.query.limit);

    if (limit) {
        let productsLimit = products.slice(0, limit)
        return res.send(productsLimit)
    } else {
        res.send({satus: 'succes', payload: products})
    }
})

//Endpoint que muestra el producto segun el id
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(Number(req.params.pid));
    if (product) {
        res.send({payload: product})
    }else{
        res.status(404).send({ message: 'Producto no encontrado'})
    }
})

//Endpoint que crea un producto 
router.post('/', async (req, res) => {
    const product = req.body;
    await productManager.addProduct(product);
    res.send({ status: 'Success', payload: product });
});

//Endpoint que actualiza un producto
router.put('/:pid', async (req, res) => {
    const id = Number(req.params.pid);
    const product = req.body;
    const tof = await productManager.updateProduct(id, product);
    const productUpdate = await productManager.getProductById(id);
    if(tof){
        res.send({ status: 'succes', payload: productUpdate });
    }else{
        res.status(404).send({ message: 'Producto no encontrado / El codigo de producto ya existe' })
    }
    
});


//Endpoint que elimina un producto
router.delete('/:pid', async (req, res) => {
    const id = Number(req.params.pid);
    const tof = await productManager.deleteProduct(id);

    if(tof){
        res.send({ status: 'Success', payload: `Product N° ${id} deleted` });
    }else{
        res.status(404).send({ message: `Product N° ${id} not Found`})
    }
    
});

export default router;