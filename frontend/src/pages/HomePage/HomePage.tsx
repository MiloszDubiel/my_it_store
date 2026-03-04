import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const HomePage = () => {
  const { addToCart, toogleShowCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const createSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const fetchOffers = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/allegro/products",
      );
      setProducts(response.data.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <>
      <Navbar />
      <section className="bg-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Aktualne Oferty</h1>
        <p className="text-lg">Najlepsze promocje w My IT Store</p>
      </section>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white  shadow-md overflow-hidden flex flex-col h-[380px] animate-pulse"
              >
                <div className="bg-gray-300 h-48 w-full object-cover" />
                <div className="p-4 flex flex-col flex-1">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/3 mb-2 mt-auto"></div>
                  <div className="h-10 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
            ))}

          {!loading &&
            products.map((product) => (
              <Link
                key={product.id}
                to={`/offers/${createSlug(product.product_data.name)}/${product.external_id}`}
              >
                <div className="bg-white  shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-[380px]">
                  <div className="relative flex justify-center">
                    <img
                      src={
                        product.product_data.images[0]?.url || "/no-image.png"
                      }
                      alt={product.product_data.name}
                      className="h-48 object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      PROMOCJA
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[56px] hover:underline hover:text-orange-600">
                      {product.product_data.name}
                    </h3>

                    <div className="mb-2">
                      <span className="text-xl font-bold text-orange-500">
                        {product.price} zł
                      </span>
                    </div>

                    <div className="text-gray-500 text-sm mb-2">
                      {product.stock} szt. dostępnych
                    </div>

                    <button
                      className="mt-auto w-full bg-orange-500 text-white py-2  hover:bg-orange-600 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                        toogleShowCart(true);
                      }}
                    >
                      Dodaj do koszyka
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;
