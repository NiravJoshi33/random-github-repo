import { type Repo } from '$lib/types/repo';

const KEY = 'savedRepos';

export const getSavedReposFromLocalStorage = (): Repo[] => {
	if (typeof window === 'undefined') {
		return [];
	}

	try {
		const items = window.localStorage.getItem(KEY);
		return items ? JSON.parse(items) : [];
	} catch (err) {
		console.error('Error parsing saved repos from local storage: ', err);
		return [];
	}
};

export const saveRepoToLocalStorage = (repos: Repo[]) => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.setItem(KEY, JSON.stringify(repos));
	} catch (err) {
		console.error('Error saving repos to local storage: ', err);
	}
};
