/**
 * Maps event categories to their banner image paths.
 * Place your downloaded images in public/images/ with these exact filenames.
 *
 * Expected files:
 *   public/images/category-technology.jpg
 *   public/images/category-design.jpg
 *   public/images/category-business.jpg
 *   public/images/category-community.jpg
 *   public/images/category-career.jpg
 *   public/images/category-entertainment.jpg
 */
export const CATEGORY_IMAGES: Record<string, string> = {
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
