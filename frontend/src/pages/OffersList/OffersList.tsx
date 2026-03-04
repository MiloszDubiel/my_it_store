import Navbar from "../../components/layout/Navbar";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import OfferCard from "../../components/ui/OffersCard";
import Pagination from "../../components/ui/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import FiltersSidebar from "../../components/layout/FiltersSidebar";

const OffersList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const allParams = Object.fromEntries(searchParams.entries());
  const { page, search, ...filters } = allParams;

  const currentPage = Number(page || 1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating_desc":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [products, sort]);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters);
        if (search) params.set("search", search);
        if (sort) params.set("sort", sort);
        if (currentPage) params.set("page", currentPage.toString());
        const response = await axios.get(
          `http://localhost:5000/allegro/products?${params.toString()}`,
        );
        setProducts(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [JSON.stringify(filters), search, sort, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  sort ? searchParams.set("sort", sort) : searchParams.delete("sort");

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    setSearchParams(params);
    setSort(value);
  };
  return (
    <>
      <Navbar />
      <div className="flex gap-6 max-w-7xl mx-auto p-6">
        <FiltersSidebar
          categories={[
            "Zestawy",
            "Wentylatory",
            "Radiatory",
            "Płyty główne",
            "Procesory",
            "Pozostałe",
            "Pasty i taśmy termoprzewodzące",
            "Panele i czytniki",
            "Pamięć RAM",
            "Ogniwa peltiera",
            "Obudowy",
            "Napędy",
            "Laptopy",
            "Kontrolery komputerowe",
            "Konektory i kable antenowe",
            "Komputery stacjonarne",
            "Karty graficzne",
            "Karty diagnostyczne",
            "Dyski SSD",
            "Dyski HDD",
            "Części",
            "Chłodzenie procesorów",
            "Chłodzenie kart graficznych",
            "Chłodnice",
          ]}
          brands={["Samsung", "Asus", "MSI", "HP"]}
        />

        <div className="w-full flex flex-col gap-6">
          {loading ? (
            <>
              <div className="flex flex-col items-end mb-4">
                <div className="w-full">
                  {searchParams.get("search") && (
                    <h1 className="text-gray-600 mb-2">
                      Wyniki wyszukiwania dla frazy:{" "}
                      <span className="font-semibold text-orange-500">
                        {searchParams.get("search")}
                      </span>
                    </h1>
                  )}
                </div>

                <h3 className="font-semibold mb-2">Sortuj</h3>
                <select
                  disabled
                  className="w-52 border px-2 py-1 focus:border-orange-500 focus:ring focus:ring-orange-200"
                >
                  <option value="">Domyślnie</option>
                  <option value="price_asc">Cena rosnąco</option>
                  <option value="price_desc">Cena malejąco</option>
                  <option value="rating_desc">Najlepsze oceny</option>
                </select>
              </div>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className=" bg-white border hover:shadow-lg transition p-4 flex gap-6 items-start"
                >
                  <div className="w-40 h-32 bg-gray-300 flex-shrink-0 rounded-md" />

                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>{" "}
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>{" "}
                    <div className="space-y-1 mt-1">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mt-2"></div>{" "}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>{" "}
                    <div className="h-10 bg-gray-300 rounded w-32"></div>{" "}
                    <div className="h-6 bg-gray-300 rounded w-6"></div>{" "}
                  </div>
                </div>
              ))}
            </>
          ) : sortedProducts.length > 0 ? (
            <>
              <div className="flex flex-col items-end mb-4">
                <div className="w-full">
                  {searchParams.get("search") && (
                    <h1 className="text-gray-600 mb-2">
                      Wyniki wyszukiwania dla frazy:{" "}
                      <span className="font-semibold text-orange-500">
                        {searchParams.get("search")}
                      </span>
                    </h1>
                  )}
                </div>

                <h3 className="font-semibold mb-2">Sortuj</h3>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-52 border px-2 py-1 focus:border-orange-500 focus:ring focus:ring-orange-200"
                >
                  <option value="">Domyślnie</option>
                  <option value="price_asc">Cena rosnąco</option>
                  <option value="price_desc">Cena malejąco</option>
                  <option value="rating_desc">Najlepsze oceny</option>
                </select>
              </div>

              {currentProducts.map((product: any) => (
                <OfferCard key={product} id={product.id} product={product} />
              ))}
            </>
          ) : (
            <p>Brak produktów spełniających kryteria.</p>
          )}

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", page.toString());
              navigate(`?${params.toString()}`);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OffersList;
