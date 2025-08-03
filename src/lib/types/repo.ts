export interface Repo {
	id: number;
	name: string;
	full_name: string;
	private: boolean;
	owner: RepoOwner;
	html_url: string;
	description: string;
	stargazers_count: number;
	language: string;
	forks_count: number;
	archived: boolean;
	license: RepoLicense | null;
}

export interface RepoOwner {
	id: number;
	avatar_url: string;
	html_url: string;
	login: string;
}

export interface RepoLicense {
	key: string;
	name: string;
	spdx_id: string;
	url: string;
}
