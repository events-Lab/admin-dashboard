export type CategoryStatus = "active" | "archived";

export type CategoryRecord = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  images?: string[];
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export const mockCategories: CategoryRecord[] = [
  {
    id: "cat-rackets",
    name: "Rackets",
    description: "Padel rackets for control, power, and beginner play.",
    imageUrl: "https://picsum.photos/seed/padel-racket/800/1000",
    images: [
      "https://picsum.photos/seed/padel-racket/800/1000",
      "https://picsum.photos/seed/padel-control/800/1000",
    ],
    status: "active",
    createdAt: "2026-06-01",
    updatedAt: "2026-11-08",
  },
  {
    id: "cat-balls",
    name: "Balls",
    description: "Match and training balls sold by the pack.",
    imageUrl: "https://picsum.photos/seed/padel-balls/800/1000",
    images: [
      "https://picsum.photos/seed/padel-balls/800/1000",
      "https://picsum.photos/seed/padel-balls-pack/800/1000",
    ],
    status: "active",
    createdAt: "2026-06-01",
    updatedAt: "2026-11-08",
  },
  {
    id: "cat-grips",
    name: "Grips",
    description: "Overgrips and replacement grips.",
    imageUrl: "https://picsum.photos/seed/padel-grips/800/1000",
    images: [
      "https://picsum.photos/seed/padel-grips/800/1000",
      "https://picsum.photos/seed/padel-overgrip/800/1000",
    ],
    status: "active",
    createdAt: "2026-06-01",
    updatedAt: "2026-11-02",
  },
  {
    id: "cat-bags",
    name: "Bags",
    description: "Racket bags and court carry gear.",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    ],
    status: "active",
    createdAt: "2026-07-12",
    updatedAt: "2026-10-20",
  },
  {
    id: "cat-apparel",
    name: "Apparel",
    description: "Club shirts, caps, and match-day clothing.",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    ],
    status: "active",
    createdAt: "2026-08-04",
    updatedAt: "2026-11-07",
  },
];

export function getCategory(id: string): CategoryRecord | undefined {
  return mockCategories.find((category) => category.id === id);
}
