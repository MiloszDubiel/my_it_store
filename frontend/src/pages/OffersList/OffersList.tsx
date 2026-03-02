import Navbar from "../../components/layout/Navbar";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import OfferCard from "../../components/ui/OffersCard";
import Pagination from "../../components/ui/Pagination";
import { useSearchParams } from "react-router-dom";
import FiltersSidebar from "../../components/layout/FiltersSidebar";
const OffersList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchParams] = useSearchParams();

  const allParams = Object.fromEntries(searchParams.entries());

  const { page, ...filters } = allParams;

  const currentPage = Number(page || 1);
  const itemsPerPage = 10;

  const fetchOffers = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/allegro/products",
      );
      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);
  console.log(products[0]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />

      <div className="flex gap-6 max-w-7xl mx-auto p-6">
        <FiltersSidebar
          categories={["Laptopy", "Komputery", "Podzespoły"]}
          brands={["Samsung", "Asus", "MSI", "HP"]}
        />
        <div className="p-6 max-w-6xl mx-auto space-y-4">
          {currentProducts.map((product: any) => (
            <OfferCard key={product} id={product.id} product={product} />
          ))}

          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
};

export default OffersList;
