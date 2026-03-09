import type { Repo } from '$lib/types/repo';

const formatStars = (count: number): string => {
	if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
	if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
	return count.toString();
};

const getHashtags = (repo: Repo): string => {
	const tags = ['#opensource'];
	if (repo.language) tags.push(`#${repo.language.replace(/[^a-zA-Z0-9]/g, '')}`);
	if (repo.topics?.length) {
		const topicTags = repo.topics
			.slice(0, 2)
			.map((t) => `#${t.replace(/-/g, '')}`)
			.filter((t) => !tags.includes(t));
		tags.push(...topicTags);
	}
	return tags.join(' ');
};

export const generateXPost = (repo: Repo): string => {
	const desc = repo.description
		? repo.description.length > 100
			? repo.description.slice(0, 97) + '...'
			: repo.description
		: 'Check out this repo!';

	const stars = formatStars(repo.stargazers_count);
	const hashtags = getHashtags(repo);

	return `🔥 ${repo.full_name} — ${desc}

⭐ ${stars} stars | 🍴 ${formatStars(repo.forks_count)} forks

${repo.html_url}

${hashtags}`;
};

export const generateLinkedInPost = (repo: Repo): string => {
	const desc = repo.description || 'An interesting open source project worth checking out.';
	const stars = formatStars(repo.stargazers_count);
	const hashtags = getHashtags(repo);

	return `🚀 Found an incredible open source project worth sharing!

${repo.full_name} — ${desc}

📊 Key stats:
⭐ ${stars} stars
🍴 ${formatStars(repo.forks_count)} forks
${repo.language ? `💻 Built with ${repo.language}` : ''}

Whether you're looking to learn, contribute, or build on top of existing work — this is worth bookmarking.

🔗 ${repo.html_url}

${hashtags} #github #developers`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Fallback for older browsers
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const success = document.execCommand('copy');
		document.body.removeChild(textarea);
		return success;
	}
};

export const getXShareUrl = (text: string): string => {
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};

export const getLinkedInShareUrl = (repoUrl: string): string => {
	return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(repoUrl)}`;
};
