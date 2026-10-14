
import { categories, products } from "../data/products";
import { updateData } from "../firebase/database";

export async function seedCatalog(idToken) {
  if (!idToken) {
    throw new Error("Please log in before seeding the catalog.");
  }

  // Convert categories into Firebase objects.
  const categoryData = Object.fromEntries(
    categories.map((category, index) => {
      const id = category.slug;

      const firstProduct = products.find(
        (product) => product.categorySlug === category.slug
      );

      return [
        id,
        {
          ...category,
          imageUrl: firstProduct?.image || "",
          isActive: true,
          sortOrder: index + 1,
        },
      ];
    })
  );

  // Convert products and link each product to its category.
  const productData = Object.fromEntries(
    products.map((product) => {
      const { categorySlug, ...rest } = product;

      return [
        product.id,
        {
          ...rest,
          categoryId: categorySlug,
          isActive: true,
        },
      ];
    })
  );

  // Update these nodes without replacing unrelated database data.
  await updateData("categories", categoryData, idToken);
  await updateData("products", productData, idToken);

  return {
    categories: categories.length,
    products: products.length,
  };
}
