import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { AnalysisHistoryItem, apiService } from '../../services/api.service';
import { FilterMode, ListItem } from './AnalysisListContainer.types';
import { AnalysisRow } from './components/AnalysisRow';
import { DateDivider } from './components/DateDivider';
import { EmptyState } from './components/EmptyState';
import { FilterToggle } from './components/FilterToggle';
import { LoadingFooter } from './components/LoadingFooter';

const PAGE_SIZE = 2;

export const AnalysisListContainer = () => {
  const [filter, setFilter] = useState<FilterMode>('today');
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filterRef = useRef(filter);
  filterRef.current = filter;

  const fetchPage = useCallback(
    async (currentCursor?: string, isFirstPage = false) => {
      if (isFirstPage) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await apiService.getAnalysisHistory(
          filterRef.current,
          currentCursor,
          PAGE_SIZE
        );

        setItems((prev) =>
          isFirstPage ? response.data : [...prev, ...response.data]
        );
        setCursor(response.pagination.nextCursor ?? undefined);
        setHasMore(response.pagination.hasMore);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load history';
        if (isFirstPage) {
          Alert.alert('Error', message);
        } else {
          Alert.alert('Error', 'Failed to load more items');
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setItems([]);
    setCursor(undefined);
    setHasMore(true);
    fetchPage(undefined, true);
  }, [filter, fetchPage]);

  const handleFilterChange = useCallback((newFilter: FilterMode) => {
    setFilter(newFilter);
  }, []);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading && cursor !== undefined) {
      fetchPage(cursor, false);
    }
  }, [isLoadingMore, hasMore, isLoading, cursor, fetchPage]);

  const handleRefresh = useCallback(() => {
    setItems([]);
    setCursor(undefined);
    setHasMore(true);
    fetchPage(undefined, true);
  }, [fetchPage]);

  const listData = useMemo((): ListItem[] => {
    if (filter === 'today') {
      return items.map((item) => ({ type: 'analysis' as const, data: item }));
    }

    const result: ListItem[] = [];
    let currentDate = '';

    for (const item of items) {
      const itemDate = item.committedAt
        ? new Date(item.committedAt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
        : 'Unknown';

      if (itemDate !== currentDate) {
        currentDate = itemDate;
        result.push({ type: 'dateHeader', date: itemDate });
      }
      result.push({ type: 'analysis', data: item });
    }

    return result;
  }, [items, filter]);

  const keyExtractor = useCallback(
    (item: ListItem, index: number) =>
      item.type === 'dateHeader'
        ? `header-${item.date}-${index}`
        : `analysis-${item.data.id}`,
    []
  );

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'dateHeader') {
      return <DateDivider date={item.date} />;
    }
    return <AnalysisRow item={item.data} />;
  }, []);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <LoadingFooter />;
    }
    return null;
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return <EmptyState filter={filter} />;
  }, [isLoading, filter]);

  return (
    <View style={styles.container}>
      <FilterToggle activeFilter={filter} onFilterChange={handleFilterChange} />
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        contentContainerStyle={
          listData.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
  },
});
