
import { BIBLE_VERSIONS, SIMPLE_TRANSLATIONS } from './types';
import { versionService } from './versionService';
import { contentService } from './contentService';
import { searchService } from './searchService';
import { favoritesService } from './favoritesService';

// Re-export types
export * from './types';

// Re-export all services individually
export { versionService, contentService, searchService, favoritesService };

// Combine all services into one bible service
export const bibleService = {
  ...versionService,
  ...contentService,
  ...searchService,
  ...favoritesService
};

// Re-export constants
export { BIBLE_VERSIONS, SIMPLE_TRANSLATIONS };
