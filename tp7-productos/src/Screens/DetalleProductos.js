import { useParams } from 'react-router-dom';
import axios from 'axios'
import { useContext, useEffect, useState } from 'react';
import '../Styles/DetalleProducto.css'
import {AiOutlineStar} from 'react-icons/ai'
import Button from '../Components/Button';
import { CarritoContext } from '../Context/carritoContext';
import { Link } from 'react-router-dom'

export default function DetalleProductos() {
    const [producto, setProducto] = useState()
    const [isLoading, setLoading] = useState(true)

    const { idProducto } = useParams();

    const ObjetoCarrito = useContext(CarritoContext)

    useEffect(() => {
        axios.get('https://dummyjson.com/products/' + idProducto)
        .then(function (response) {
            const product = response.data
            product.estaEnCarrito = false
            product.cantidad = 0
            setProducto(product) 
        })
        .finally(() => setLoading(false))
    }, [])

    const calcularDescuento = ()  => {
        let precio = producto.price
        let discount = producto.discountPercentage
        const precioConDescuento = (Math.round(precio - (precio * discount/100)))
        return precioConDescuento
    }

    const AgregarAlCarrito = () => {
        if (!producto.estaEnCarrito) {
            let product = producto
            product.cantidad = 1
            product.estaEnCarrito = true
            ObjetoCarrito.setCarrito([...ObjetoCarrito.carrito , product])
        }
        else {
            ObjetoCarrito.setCarrito(ObjetoCarrito.carrito.map((product) => {
                if (product.id === producto.id) {
                    product.cantidad = product.cantidad + 1
                }
                return product
            }))
        }
    }

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(ObjetoCarrito.carrito))
    }, [ObjetoCarrito.carrito])
    return (

        <div className='container'>
            {isLoading ? null : (
                <>
                <div className='box'>
                    <div>
                        <img src={producto.thumbnail} height="400px"alt='god'/>
                    </div>
                    <hr className='verticalLine' />
                    <div className='containerTexto'>
                        <h2>{producto.title}</h2>
                        <h2>{producto.description}</h2>
                        <div className='precios'>
                            <h2 className='precioConDescuento'>{producto.price} $</h2>
                            <h2>&nbsp;{calcularDescuento()}$</h2>
                        </div>
                        <div>
                            <h2>Rating: {producto.rating} <AiOutlineStar /></h2>
                        </div>
                        <h2>Quedan: {producto.stock} Unidades</h2>
                        <div className='botones'>
                            <Button titulo={"Comprar"}></Button>
                            <Button titulo={"Agregar al carrito"} onPress={AgregarAlCarrito}></Button>
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Otras imagenes</h2>
                    <div className='imagenes row-md-3'>
                        {Array.isArray(producto.images) &&
                            producto.images.length > 0 ? (
                            <>
                                <img className='imagen' src={producto.images[0]} width="400px"alt="imagenes"/>
                                <img className='imagen' src={producto.images[1]} width="400px" alt="imagenes"/>
                                <img className='imagen' src={producto.images[2]} width="400px"alt="imagenes"/>
                            </>
                        ) : (
                            <p>No image available</p>
                        )}
                    </div>
                </div>
                </>
            )}
        </div>
    )
}