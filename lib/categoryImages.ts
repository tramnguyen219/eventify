const CATEGORY_IMAGES: Record<string, string> = {
  Technology: "/images/category-technology.jpg",
  Design: "/images/category-design.jpg",
  Business: "/images/category-business.jpg",
  Community: "/images/category-community.jpg",
  Career: "/images/category-career.jpg",
  Entertainment: "/images/category-entertainment.jpg",
};

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? "/images/category-technology.jpg";
}
