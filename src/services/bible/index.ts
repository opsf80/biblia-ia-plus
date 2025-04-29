
import { BIBLE_VERSIONS } from './types';
import { versionService } from './versionService';
import { contentService } from './contentService';
import { searchService } from './searchService';
import { favoritesService } from './favoritesService';

// Re-export types
export * from './types';

// Combine all services into one bible service
export const bibleService = {
  ...versionService,
  ...contentService,
  ...searchService,
  ...favoritesService
};

// Re-export constants
export { BIBLE_VERSIONS };
