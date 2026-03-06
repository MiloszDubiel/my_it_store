import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

interface FiltersSidebarProps {
  categories?: string[];
  brands?: string[];
}

const FiltersSidebar = ({
  categories = [],
  brands = [],
}: FiltersSidebarProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",") || [],
  );
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");
  const [inStock, setInStock] = useState(searchParams.get("stock") === "1");
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  const [showAllCategories, setShowAllCategories] = useState(false);

  const updateURL = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategories.length)
      params.set("categories", selectedCategories.join(","));
    else params.delete("categories");

    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    else params.delete("brands");

    min ? params.set("min", min) : params.delete("min");
    max ? params.set("max", max) : params.delete("max");

    inStock ? params.set("stock", "1") : params.delete("stock");
    rating ? params.set("rating", rating) : params.delete("rating");

    params.set("page", "1");

    navigate(`/offers?${params.toString()}`);
  };

  const toggleValue = (
    value: string,
    state: string[],
    setter: (v: string[]) => void,
  ) => {
    if (state.includes(value)) {
      setter(state.filter((v) => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  const resetFilters = () => {
    navigate("/offers");
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  const hiddenSelectedCount = categories
    .slice(4)
    .filter((cat) => selectedCategories.includes(cat)).length;

  return (
    <aside className="w-64 bg-white p-5 shadow h-max space-y-6">
      <h2 className="text-lg font-bold">Filtry</h2>

      <div>
        <h3 className="font-semibold mb-2">Kategorie</h3>
        <div className="space-y-1">
          {displayedCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-orange-500"
                checked={selectedCategories.includes(cat)}
                onChange={() =>
                  toggleValue(cat, selectedCategories, setSelectedCategories)
                }
              />
              {cat}
            </label>
          ))}
          {categories.length > 4 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-orange-500 hover:underline text-sm mt-1 flex items-center gap-1"
            >
              {showAllCategories ? "Pokaż mniej" : "Pokaż więcej"}
              {!showAllCategories && hiddenSelectedCount > 0 && (
                <span className="text-xs text-white bg-orange-500 rounded-full px-2 py-0.5">
                  +{hiddenSelectedCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Cena</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Od"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full border rounded px-2 py-1 border-gray-200"
          />
          <input
            type="number"
            placeholder="Do"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full border rounded px-2 py-1 border-gray-200"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Marka</h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-orange-500"
                checked={selectedBrands.includes(brand)}
                onChange={() =>
                  toggleValue(brand, selectedBrands, setSelectedBrands)
                }
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Dostępność</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-orange-500"
            checked={inStock}
            onChange={() => setInStock(!inStock)}
          />
          Tylko dostępne
        </label>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Ocena</h3>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border rounded px-2 py-1 border-gray-200"
        >
          <option value="">Dowolna</option>
          <option value="4">4 i więcej</option>
          <option value="3">3 i więcej</option>
          <option value="2">2 i więcej</option>
        </select>
      </div>

      <button
        onClick={updateURL}
        className="w-full bg-gray-100 hover:bg-orange-100 hover:text-orange-500 transition py-2 rounded"
      >
        Wyszukaj
      </button>

      <button
        onClick={resetFilters}
        className="w-full bg-gray-100 hover:bg-orange-100 hover:text-orange-500 transition py-2 rounded"
      >
        Resetuj filtry
      </button>
    </aside>
  );
};

export default FiltersSidebar;
