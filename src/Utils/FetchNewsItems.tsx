import axios, { type CancelToken } from "axios";

export interface NewsArticle {
	id: number | null;
	title: string;
	text: string | null;
	summary: string | null;
	url: string;
	image: string | null;
	publish_date: string | null;
	author: string | null;
	language: string | null;
	source_country: string | null;
	sentiment: number | null;
}

export interface WorldNewsResponse {
	news: NewsArticle[];
	offset: number | null;
	number: number | null;
	available: number | null;
}

export interface SignalSuggestion {
	headline: string;
	url: string;
	description: string;
	relevance: string | null;
	keywords: string[];
	location: string;
	created_unit: string | null;
	score: { sentiment: number } | null;
	connected_trends: number[] | null;
}

const WORLD_NEWS_API_KEY =
	import.meta.env.VITE_WORLD_NEWS_API_KEY ||
	process.env.REACT_APP_WORLD_NEWS_API_KEY;
const API_BASE_URL = "https://api.worldnewsapi.com";

export const searchNews = async (
	query: string,
	language = "en",
	number = 5,
	offset = 0,
	cancelToken?: CancelToken,
): Promise<WorldNewsResponse> => {
	try {
		const response = await axios.get(`${API_BASE_URL}/search-news`, {
			params: {
				text: query,
				language,
				number,
				offset,
			},
			headers: {
				"X-Api-Key": WORLD_NEWS_API_KEY,
			},
			cancelToken,
		});
		return response.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log("Request canceled:", error.message);
		} else {
			console.error("Error fetching news:", error);
		}
		throw error;
	}
};

export const convertToSignals = (
	response: WorldNewsResponse,
): SignalSuggestion[] => {
	const signals: SignalSuggestion[] = [];

	try {
		for (const article of response.news) {
			// Extract keywords from title
			const keywords: string[] = [];
			if (article.source_country) {
				keywords.push(article.source_country.toUpperCase());
			}

			// Add keywords from title
			const titleWords = article.title
				.split(" ")
				.map((word) => word.replace(/[.,!?:;"'-]/g, "").toLowerCase())
				.filter(
					(word) =>
						word.length > 3 &&
						![
							"the",
							"and",
							"for",
							"after",
							"from",
							"with",
							"has",
							"have",
							"that",
							"this",
							"were",
							"what",
						].includes(word),
				);

			keywords.push(...titleWords.slice(0, 2));

			// Create signal suggestion
			const signal: SignalSuggestion = {
				headline: article.title,
				url: article.url,
				description: article.summary || article.text || "",
				relevance: null,
				keywords: [...new Set(keywords)].slice(0, 3), // Remove duplicates and limit to 3
				location: article.source_country
					? article.source_country.toUpperCase()
					: "Global",
				created_unit: null,
				score: article.sentiment ? { sentiment: article.sentiment } : null,
				connected_trends: null,
			};

			signals.push(signal);
		}
	} catch (error) {
		console.error("Error converting to signals:", error);
		throw error;
	}

	return signals;
};

export const autocomplete = async (
	query: string,
	cancelToken?: CancelToken,
): Promise<SignalSuggestion[]> => {
	if (!query || query.length < 2) {
		return [];
	}

	try {
		const response = await searchNews(query, "en", 5, 0, cancelToken);
		return convertToSignals(response);
	} catch (error) {
		if (axios.isCancel(error)) {
			return [];
		}
		console.error("Error in autocomplete:", error);
		return [];
	}
};
