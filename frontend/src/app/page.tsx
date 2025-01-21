import ApolloWrapper from "./components/ApolloWrapper";
import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <ApolloWrapper>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>
        <ProductList />
      </main>
    </ApolloWrapper>
  );
}
