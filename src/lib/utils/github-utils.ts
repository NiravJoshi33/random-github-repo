import { githubConfig } from '$lib/configs/github';
import type { Repo } from '$lib/types/repo';

export const getTotalCount = async () => {
	if (!githubConfig.apiBaseURL) {
		throw new Error('GitHub API base URL is not defined');
	}

	const url = `${githubConfig.apiBaseURL}?q=stars:>=0&per_page=1`;
	console.log('Fetching total count from:', url);

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 403) {
			return { data: null, error: 'Rate limit exceeded. Please try again later.' };
		}

		const data = await response.json();

		const totalCount = data.total_count;
		if (totalCount) {
			return { data: totalCount, error: null };
		} else {
			return { data: null, error: 'Total count not found in response' };
		}
	} catch (err) {
		return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
	}
};

export const getRandomRepo = async (page: number) => {
	if (!githubConfig.apiBaseURL) {
		throw new Error('GitHub API base URL is not defined');
	}

	const url = `${githubConfig.apiBaseURL}?q=stars:>=0&sort=stars&order=desc&page=${page}&per_page=1`;
	console.log('Fetching random repo from:', url);

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 403) {
			return { data: null, error: 'Rate limit exceeded. Please try again later.' };
		}

		const data: { items: Repo[] } = await response.json();

		if (data.items && data.items.length > 0) {
			return { data: data.items[0], error: null };
		} else {
			return { data: null, error: 'No repositories found' };
		}
	} catch (err) {
		return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
	}
};
