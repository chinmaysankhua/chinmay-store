
import { useEffect, useState } from "react";
import { readData } from "../firebase/database";

function normalizeCatalog(categoriesData, productsData) {
  const categories = Object.entries(categoriesData || {})
    .map(([id, category]) => ({
      ...category,
      id,
    }))
    .filter((category) => category.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  const products = Object.entries(productsData || {})
    .map(([id, product]) => {
      const category = categoryMap.get(product.categoryId);

      return {
        ...product,
        id,
        image:
          product.image ||
          product.imageUrl ||
          product.imageUrls?.[0] ||
          "",
        categorySlug: product.categorySlug || category?.slug || "",
      };
    })
    .filter((product) => product.isActive !== false);

  return { categories, products };
}

export default function useStoreCatalog() {
  const [catalog, setCatalog] = useState({
    categories: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setLoading(true);
      setError("");

      try {
        const [categoriesData, productsData] = await Promise.all([
          readData("categories"),
          readData("products"),
        ]);

        const normalized = normalizeCatalog(
          categoriesData,
          productsData
        );

        if (!cancelled) {
          setCatalog(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load store products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...catalog,
    loading,
    error,
  };
}
