export const githubConfig = {
	apiBaseURL: 'https://api.github.com/search/repositories',
	defaultMinStars: 10000,
	defaultPerPage: 12,
	popularTopics: [
		{
			label: 'AI / ML',
			icon: 'lucide:brain',
			query: 'topic:artificial-intelligence OR topic:machine-learning OR topic:deep-learning'
		},
		{
			label: 'Web Dev',
			icon: 'lucide:globe',
			query: 'topic:javascript OR topic:typescript OR topic:react OR topic:svelte OR topic:nextjs'
		},
		{
			label: 'DevOps',
			icon: 'lucide:container',
			query: 'topic:docker OR topic:kubernetes OR topic:terraform OR topic:ci-cd'
		},
		{
			label: 'Data',
			icon: 'lucide:database',
			query: 'topic:data-science OR topic:data-engineering OR topic:analytics'
		},
		{
			label: 'Security',
			icon: 'lucide:shield',
			query: 'topic:cybersecurity OR topic:security OR topic:ethical-hacking'
		},
		{
			label: 'Mobile',
			icon: 'lucide:smartphone',
			query: 'topic:android OR topic:ios OR topic:react-native OR topic:flutter'
		},
		{
			label: 'CLI Tools',
			icon: 'lucide:terminal',
			query: 'topic:cli OR topic:command-line OR topic:terminal'
		},
		{
			label: 'Open Source',
			icon: 'lucide:heart',
			query: 'topic:open-source OR topic:hacktoberfest OR topic:good-first-issue'
		}
	],
	popularLanguages: [
		'JavaScript',
		'TypeScript',
		'Python',
		'Rust',
		'Go',
		'Java',
		'C++',
		'Swift',
		'Kotlin',
		'Ruby',
		'PHP',
		'C#'
	]
};

export const getAuthHeaders = (): Record<string, string> => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('github_token') : null;
	const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
	if (token) headers['Authorization'] = `token ${token}`;
	return headers;
};
