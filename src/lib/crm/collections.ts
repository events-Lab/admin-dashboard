"use client";

import type { EventItem, ProductItem } from "@events-lab/shared-components";
import { mockCategories, type CategoryRecord } from "../data/categories";
import { mockAdminEvents } from "../data/events";
import { mockPeople, type PersonRecord } from "../data/people";
import { mockAdminProducts } from "../data/products";
import { createCollectionStore } from "./store";

export const eventsStore = createCollectionStore<EventItem>(
  "admin-crm-events",
  mockAdminEvents,
);

export const productsStore = createCollectionStore<ProductItem>(
  "admin-crm-products",
  mockAdminProducts,
);

export const peopleStore = createCollectionStore<PersonRecord>(
  "admin-crm-people",
  mockPeople,
);

export const categoriesStore = createCollectionStore<CategoryRecord>(
  "admin-crm-categories",
  mockCategories,
);
