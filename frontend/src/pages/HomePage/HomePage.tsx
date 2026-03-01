import { useCallback, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Navbar from "../../components/layout/Navbar";

const HomePage = () => {
  //Takie podejscie ma sens gdy funckja jest wywoływana w evencie

  const [products, setProcuts] = useState([]);

  const fetchOffers = useCallback(async () => {
    try {
      let respones: AxiosResponse<any> = await axios.get(
        "http://localhost:5000/allegro/products",
      );

      setProcuts(respones.data.filter((el: any, index: number) => index < 4));
    } catch (err: any) {
      console.log(err);
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
          {products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-[380px]"
            >
              <div className="relative">
                <img
                  src={product.product_data.images[0]?.url}
                  alt={product.product_data.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  PROMOCJA
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[56px]">
                  {product.product_data.name}
                </h3>

                <div className="mb-0">
                  <span className="text-xl font-bold text-orange-500">
                    {product.price} zł
                  </span>
                </div>

                <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                  Dodaj do koszyka
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;
