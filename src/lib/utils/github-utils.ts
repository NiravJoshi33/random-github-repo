import { githubConfig, getAuthHeaders } from '$lib/configs/github';
import type { SearchParams, SearchResult } from '$lib/types/search';

// Simple in-memory cache with 2-minute TTL
const cache = new Map<string, { data: SearchResult; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000;

const getCached = (key: string): SearchResult | null => {
	const entry = cache.get(key);
	if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
		return entry.data;
	}
	cache.delete(key);
	return null;
};

const setCache = (key: string, data: SearchResult) => {
	cache.set(key, { data, timestamp: Date.now() });
};

const getDateThreshold = (range: string): string => {
	const now = new Date();
	switch (range) {
		case 'day':
			now.setDate(now.getDate() - 1);
			break;
		case 'week':
			now.setDate(now.getDate() - 7);
			break;
		case 'month':
			now.setMonth(now.getMonth() - 1);
			break;
		case 'year':
			now.setFullYear(now.getFullYear() - 1);
			break;
	}
	return now.toISOString().split('T')[0];
};

export const searchRepos = async (params: SearchParams): Promise<SearchResult> => {
	const {
		query = '',
		language,
		topic,
		minStars = 0,
		sort = 'stars',
		order = 'desc',
		dateRange,
		page = 1,
		perPage = githubConfig.defaultPerPage
	} = params;

	// Build the q parameter
	const queryParts: string[] = [];

	if (query) queryParts.push(query);
	if (language) queryParts.push(`language:${language}`);
	if (topic) queryParts.push(`topic:${topic}`);
	if (minStars > 0) queryParts.push(`stars:>=${minStars}`);
	if (dateRange) queryParts.push(`created:>=${getDateThreshold(dateRange)}`);

	// Default to showing repos with at least some stars if no query
	if (queryParts.length === 0) queryParts.push('stars:>=100');

	const q = queryParts.join(' ');
	const sortParam = sort === 'best-match' ? '' : `&sort=${sort}`;
	const url = `${githubConfig.apiBaseURL}?q=${encodeURIComponent(q)}${sortParam}&order=${order}&page=${page}&per_page=${perPage}`;

	// Check cache
	const cached = getCached(url);
	if (cached) return cached;

	try {
		const response = await fetch(url, { headers: getAuthHeaders() });

		if (response.status === 403) {
			return { repos: [], totalCount: 0, error: 'Rate limit exceeded. Please try again later.' };
		}

		if (!response.ok) {
			return { repos: [], totalCount: 0, error: `GitHub API error: ${response.status}` };
		}

		const data = await response.json();
		const result: SearchResult = {
			repos: data.items || [],
			totalCount: data.total_count || 0,
			error: null
		};

		setCache(url, result);
		return result;
	} catch (err) {
		return {
			repos: [],
			totalCount: 0,
			error: err instanceof Error ? err.message : 'Unknown error'
		};
	}
};

// Keep backward compatibility for existing home page
export const getTotalCount = async (minStars: number) => {
	const result = await searchRepos({ minStars, perPage: 1 });
	if (result.error) return { data: null, error: result.error };
	return { data: result.totalCount, error: null };
};

export const getRandomRepo = async (page: number, minStars: number) => {
	const result = await searchRepos({ minStars, page, perPage: 1 });
	if (result.error) return { data: null, error: result.error };
	if (result.repos.length > 0) return { data: result.repos[0], error: null };
	return { data: null, error: 'No repositories found' };
};

export const getRateLimitStatus = async () => {
	try {
		const response = await fetch('https://api.github.com/rate_limit', {
			headers: getAuthHeaders()
		});
		const data = await response.json();
		return {
			remaining: data.resources?.search?.remaining ?? 0,
			limit: data.resources?.search?.limit ?? 10,
			resetAt: new Date((data.resources?.search?.reset ?? 0) * 1000)
		};
	} catch {
		return { remaining: 0, limit: 10, resetAt: new Date() };
	}
};
