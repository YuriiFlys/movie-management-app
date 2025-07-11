import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/common/input/Input';
import { MovieFormat } from '@/types/movie';
import { useDebounce } from '@/hooks/useDebounce';
import { usePrevious } from '@/hooks/usePrevious';
import styles from './MovieSearch.module.css';

type SearchType = 'title' | 'actor' | 'general';

interface SearchFilters {
    searchQuery?: string;
    searchType?: SearchType;
    format?: MovieFormat | '';
}

interface MovieSearchProps {
    onSearch: (filters: SearchFilters) => void;
    onClear: () => void;
    loading?: boolean;
}

const MovieSearch: React.FC<MovieSearchProps> = ({
    onSearch,
    onClear,
    loading = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('general');
    const [format, setFormat] = useState<MovieFormat | ''>('');
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const debouncedQuery = useDebounce(searchQuery.trim(), 400);
    const debouncedFormat = useDebounce(format, 400);
    const debouncedType = useDebounce(searchType, 400);

    const prevFilters = usePrevious({ debouncedQuery, debouncedFormat, debouncedType });

    const hasActiveFilters = !!debouncedQuery || !!debouncedFormat;

    const handleSearch = useCallback(() => {
        const filters: SearchFilters = {};
        if (debouncedQuery) {
            filters.searchQuery = debouncedQuery;
            filters.searchType = debouncedType;
        }
        if (debouncedFormat) {
            filters.format = debouncedFormat;
        }

        if (Object.keys(filters).length > 0) {
            onSearch(filters);
        }
    }, [debouncedQuery, debouncedFormat, debouncedType, onSearch]);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const current = { debouncedQuery, debouncedFormat, debouncedType };
        if (
            prevFilters &&
            JSON.stringify(current) === JSON.stringify(prevFilters)
        ) {
            return;
        }

        const isAllEmpty = !debouncedQuery && !debouncedFormat;
        if (isAllEmpty) {
            onClear();
        } else {
            handleSearch();
        }
    }, [debouncedQuery, debouncedFormat, debouncedType, prevFilters, handleSearch, onClear, isFirstRender]);

    const getPlaceholderText = (type: SearchType): string => {
        switch (type) {
            case 'title':
                return 'Search by movie title...';
            case 'actor':
                return 'Search by actor name...';
            default:
                return 'Search movies (title, actor, etc.)...';
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className={styles.form}>
                <div className={styles.quickSearch}>
                    <div className={styles.searchTypeGroup}>
                        <label className={styles.searchTypeLabel}>Search by:</label>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as SearchType)}
                            className={styles.searchTypeSelect}
                            disabled={loading}
                        >
                            <option value="general">All fields</option>
                            <option value="title">Movie title</option>
                            <option value="actor">Actor name</option>
                        </select>
                    </div>

                    <div className={styles.searchInputGroup}>
                        <Input
                            label=""
                            type="text"
                            name="searchQuery"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getPlaceholderText(searchType)}
                            className={styles.searchInput}
                        />
                    </div>

                </div>

                {hasActiveFilters && (
                    <div className={styles.activeFilters}>
                        <span className={styles.activeFiltersLabel}>Active filters:</span>
                        <div className={styles.filterTags}>
                            {debouncedQuery && (
                                <span className={styles.filterTag}>
                                    <span className={styles.filterTagType}>
                                        {debouncedType === 'general' ? 'Search' :
                                            debouncedType === 'title' ? 'Title' : 'Actor'}:
                                    </span>
                                    "{debouncedQuery}"
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className={styles.removeFilter}
                                        disabled={loading}
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {debouncedFormat && (
                                <span className={styles.filterTag}>
                                    Format: {debouncedFormat}
                                    <button
                                        type="button"
                                        onClick={() => setFormat('')}
                                        className={styles.removeFilter}
                                        disabled={loading}
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MovieSearch;
