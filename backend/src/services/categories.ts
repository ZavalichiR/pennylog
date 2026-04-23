import { categoriesRepository } from '../repositories/categories.js';

export const categoriesService = {
  getAll() {
    return categoriesRepository.findAll();
  },
};
