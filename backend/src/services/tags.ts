import { tagsRepository } from '../repositories/tags.js';

export const tagsService = {
  getAll() { return tagsRepository.findAll(); },
  create(data: { name: string; color: string }) { return tagsRepository.create(data); },
  delete(id: number) { tagsRepository.delete(id); },
};
