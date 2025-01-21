/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, gql } from "@apollo/client";
import ProductCard from "./ProductCard";
const GET_PRODUCTS = gql`
  query {
    products {
      title
      price
      description
      images
    }
  }
`;

export default function ProductList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const products = data.products;

  const totalProducts = products.length;
  const averagePrice =
    products.reduce((sum: number, product: any) => sum + product.price, 0) /
    totalProducts;
  const mostExpensiveProduct = products.reduce((max: any, product: any) =>
    max.price > product.price ? max : product
  );
  const cheapestProduct = products.reduce((min: any, product: any) =>
    min.price < product.price ? min : product
  );

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg mb-8 text-black">
        <h2 className="text-2xl font-bold mb-4">Métricas</h2>
        <p>Cantidad total de productos: {totalProducts}</p>
        <p>Precio promedio: ${averagePrice.toFixed(2)}</p>
        <p>
          Producto más caro: {mostExpensiveProduct.title} ($
          {mostExpensiveProduct.price})
        </p>
        <p>
          Producto más barato: {cheapestProduct.title} (${cheapestProduct.price}
          )
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
