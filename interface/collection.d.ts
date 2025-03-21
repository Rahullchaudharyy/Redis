export interface Collection<Item> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Item[];
}
