import { NewSignalDataType } from "../Types";
import { SignalBasicType } from "../Types";

export function normalizeSignalData(raw: any): Partial<SignalBasicType & NewSignalDataType> {
    const sdgs = raw.sdg
      ? Array.isArray(raw.sdg)
        ? raw.sdg
        : [raw.sdg]
      : raw.sdgs || [];
    const signatureSecondary = raw.signature_secondary
      ? Array.isArray(raw.signature_secondary)
        ? raw.signature_secondary
        : [raw.signature_secondary]
      : [];
    const steepSecondary = raw.steep_secondary
      ? Array.isArray(raw.steep_secondary)
        ? raw.steep_secondary
        : [raw.steep_secondary]
      : [];
    const secondaryLocation = raw.secondary_location
      ? Array.isArray(raw.secondary_location)
        ? raw.secondary_location
        : [raw.secondary_location]
      : [];
  
    return {
      url: raw.url,
      headline: raw.headline || raw.title || '',
      description: raw.description || raw.text || '',
      keywords: raw.keywords || [],
      location: raw.location || (raw.source_country ? raw.source_country.toUpperCase() : ''),
      secondary_location: secondaryLocation,
      relevance: raw.relevance || '',
      sdgs,
      signature_primary: raw.signature_primary || '',
      signature_secondary: signatureSecondary,
      steep_primary: raw.steep_primary || '',
      steep_secondary: steepSecondary,
      score: raw.score || '',
      // Add any other fields as needed
    };
  } 