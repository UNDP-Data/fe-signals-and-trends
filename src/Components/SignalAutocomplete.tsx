import { Select, Spin } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import axios, { type CancelTokenSource } from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NewSignalDataType, SignalDataType } from "../Types";
import { autocomplete } from "../Utils/FetchNewsItems";

export interface SignalSuggestion {
	headline: string;
	url: string;
	description: string;
	keywords: string[];
	location: string;
	score: { sentiment: number } | null;
	image?: string | null;
}

interface Props {
	value?: string;
	onChange?: (value: string) => void;
	onSuggestionSelect?: (suggestion: SignalSuggestion) => void;
	signalData?: SignalDataType | NewSignalDataType;
}

interface CustomOptionType extends DefaultOptionType {
	suggestion: SignalSuggestion;
}

const DEBOUNCE_DELAY = 2000; // 2 seconds debounce delay

export function SignalAutocomplete({
	value,
	onChange,
	onSuggestionSelect,
}: Props) {
	const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
		SignalSuggestion[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const cancelTokenRef = useRef<CancelTokenSource | null>(null);

	// Cleanup function to cancel pending requests
	useEffect(() => {
		return () => {
			if (cancelTokenRef.current) {
				cancelTokenRef.current.cancel("Component unmounted");
			}
		};
	}, []);

	const debouncedSearch = useCallback(
		debounce(async (searchText: string) => {
			if (searchText.length >= 2) {
				setIsLoading(true);
				try {
					// Cancel previous request if it exists
					if (cancelTokenRef.current) {
						cancelTokenRef.current.cancel("New search initiated");
					}

					// Create new cancel token
					cancelTokenRef.current = axios.CancelToken.source();

					const suggestions = await autocomplete(
						searchText,
						cancelTokenRef.current.token,
					);
					setAutocompleteSuggestions(suggestions);
				} catch (error) {
					if (!axios.isCancel(error)) {
						console.error("Error fetching suggestions:", error);
						setAutocompleteSuggestions([]);
					}
				} finally {
					setIsLoading(false);
				}
			} else {
				setAutocompleteSuggestions([]);
			}
		}, DEBOUNCE_DELAY),
		[],
	);

	const handleSearch = (newValue: string) => {
		onChange?.(newValue);
		debouncedSearch(newValue);
	};

	const handleSelect = (
		value: string,
		option?: CustomOptionType | CustomOptionType[],
	) => {
		if (!Array.isArray(option)) {
			if(option)
			onSuggestionSelect?.(option.suggestion);
		}
	};

	return (
		<Select<string, CustomOptionType>
			className="undp-select"
			showSearch
			value={value}
			placeholder="Enter signal title (max 100 characters)"
			defaultActiveFirstOption={false}
			showArrow={false}
			filterOption={false}
			onSearch={handleSearch}
			onChange={handleSelect}
			notFoundContent={isLoading ? <Spin size="small" /> : null}
			options={autocompleteSuggestions.map((suggestion) => ({
				value: suggestion.headline,
				label: (
					<div
						style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
					>
						{suggestion.image && (
							<img
								src={suggestion.image}
								alt=""
								style={{
									width: "60px",
									height: "60px",
									objectFit: "cover",
									borderRadius: "4px",
								}}
							/>
						)}
						<div>
							<div className="suggestion-title">{suggestion.headline}</div>
							<div className="suggestion-description">
								{suggestion.description}
							</div>
						</div>
					</div>
				),
				suggestion,
			}))}
			style={{ width: "100%" }}
		/>
	);
}
