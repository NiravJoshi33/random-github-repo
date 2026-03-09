import type { Repo } from './repo';

export interface SearchParams {
	query?: string;
	language?: string;
	topic?: string;
	minStars?: number;
	sort?: 'stars' | 'forks' | 'updated' | 'best-match';
	order?: 'asc' | 'desc';
	dateRange?: 'day' | 'week' | 'month' | 'year';
	page?: number;
	perPage?: number;
}

export interface SearchResult {
	repos: Repo[];
	totalCount: number;
	error: string | null;
}
