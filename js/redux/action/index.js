import { onThemeChange, onShowCustomThemeView, onThemeInit } from './theme';
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular';
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending';
import { onLoadFavoriteData } from './favorite';
import { onLoadLanguage } from './language';
import { onSearch, onLoadMoreSearch, onSearchCancel } from './search';

/**
 * action聚合
 */
export default {
  onThemeChange,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadLanguage,
  onShowCustomThemeView,
  onThemeInit,
  onSearch,
  onLoadMoreSearch,
  onSearchCancel,
};
