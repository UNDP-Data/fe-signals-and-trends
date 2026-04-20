import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PEXEL_SEARCH_IMG_GET_URL } from '../Constants';
import { extractKeywords } from '../Utils/ExtractKeyWords';

interface Props {
  query: string;
  onImageSelect: (imageUrl: string, file: File) => void;
}

interface PexelsImage {
  id: string;
  src: {
    medium: string;
    original: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
  width: number;
  height: number;
}

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const ImageButton = styled.button`
  border: none;
  background: none;
  padding: 2px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImagePreview = styled.img`
  object-fit: cover;
  transition: box-shadow 0.4s ease-in-out;
  border-radius: 4px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageMetadata = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ImageButton}:hover & {
    opacity: 1;
  }
`;

const PhotographerLink = styled.a`
  color: #fff;
  text-decoration: underline;
  &:hover {
    color: #ccc;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--blue-600);
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem 0;
`;

const PexelsInfoBox = styled.div`
  background-color: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  padding: 12px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const PexelsLink = styled.a`
  color: var(--blue-600);
  text-decoration: underline;
  &:hover {
    color: var(--blue-700);
  }
`;

const PexelsLogo = styled.img`
  height: 24px;
  margin-bottom: 8px;
`;

const SearchInput = styled.input.attrs({
  className: 'undp-input',
})`
  box-sizing: border-box;
  flex-grow: 1;
  height: 3.25rem;
  margin: 0;
  width: 100%;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
`;

const MainButton = styled.button`
  background-color: var(--gray-300);
  padding: var(--spacing-05);
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 1rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--gray-200);
  }
  
  .toggle-indicator {
    margin-left: 8px;
    font-size: 0.75rem;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--blue-600);
  cursor: pointer;
  padding: var(--spacing-02);
  
  &:hover {
    color: var(--blue-700);
  }
`;

export function PexelsImagePicker({ query, onImageSelect }: Props) {
  const [pexelImages, setPexelImages] = useState<PexelsImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noPexelImagesAvailable, setNoPexelImagesAvailable] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  async function urlToFile(url: string, filename: string, mimeType: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  }

  const getPexelImages = async (searchTerm?: string) => {
    const activeQuery = searchTerm || searchQuery || query;
    
    if (!activeQuery) {
      return;
    }
    
    setIsLoading(true);
    const PEXEL_API_KEY = import.meta.env.VITE_PEXEL_API_KEY || process.env.REACT_APP_PEXEL_API_KEY;
    
    try {
      // Extract keywords to get better search results
      const refinedQuery = extractKeywords(activeQuery);
      
      const response = await axios.get(PEXEL_SEARCH_IMG_GET_URL, {
        params: { 
          query: refinedQuery, 
          per_page: 12, 
          page: pageNo,
          // Add orientation parameter to get images that work well as headers
          orientation: 'landscape'
        },
        headers: {
          Authorization: PEXEL_API_KEY,
        },
      });
      
      if (response.data.photos.length === 0) {
        setPageNo(1);
        setNoPexelImagesAvailable(true);
      } else {
        setTotalResults(response.data.total_results || 0);
        setPexelImages(response.data.photos);
        setNoPexelImagesAvailable(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching Pexels images:', err.message);
      } else {
        console.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout for debounce (1.5 seconds)
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        setPageNo(1); // Reset to first page when searching
        getPexelImages(value);
      }, 1500);
    }
  };

  const handleImageSelect = async (image: PexelsImage) => {
    try {
      const file = await urlToFile(
        image.src.medium,
        `${searchQuery || query} pexel-image.jpg`,
        'image/jpeg'
      );
      onImageSelect(image.src.medium, file);
      setIsVisible(false);
    } catch (err) {
      console.error('Error processing selected image:', err);
    }
  };

  const refreshPexelImages = () => {
    setPageNo(prevPage => prevPage + 1);
  };

  const generateOrToggle = () => {
    if (pexelImages.length > 0 || noPexelImagesAvailable) {
      toggleVisibility();
    } else {
      getPexelImages();
    }
  };

  // Initial load and page changes
  useEffect(() => {
    if (searchQuery || query) {
      getPexelImages();
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [pageNo, query]);

  return (
    <div>
      <MainButton
        type='button'
        className='undp-button button-tertiary'
        onClick={generateOrToggle}
      >
        {isLoading ? 'Loading...' : 'Generate Image'}
        {(pexelImages.length > 0 || noPexelImagesAvailable) && (
          <span className="toggle-indicator">{isVisible ? '▲' : '▼'}</span>
        )}
      </MainButton>
      
      {isVisible && (
        <>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search Images..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              disabled={isLoading}
            />
          </SearchContainer>
          
          <PexelsInfoBox>
            <PexelsLogo src="https://images.pexels.com/lib/api/pexels.png" alt="Pexels Logo" />
            <p>
              Images provided by <PexelsLink href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</PexelsLink>. 
              All photos are free to use under the <PexelsLink href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">Pexels License</PexelsLink> and can be used for 
              non-commercial and commercial purposes.
            </p>
            <p>
              <strong>Tips for better results:</strong> Use descriptive, specific titles for your signals to 
              get the most relevant images. The search is based on extracting keywords from your signal title.
            </p>
          </PexelsInfoBox>
          
          {isLoading && (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          )}
          
          {!isLoading && pexelImages.length > 0 && (
            <p className="undp-typography small-font margin-bottom-02">
              Showing results for "{searchQuery || query}". {totalResults} images found.
            </p>
          )}
          
          {!isLoading && (
            <ImageGrid className='generate-img-div'>
              {pexelImages.length > 0 ? (
                pexelImages.map((image, index) => (
                  <ImageButton
                    key={index}
                    type='button'
                    onClick={() => handleImageSelect(image)}
                  >
                    <ImagePreview
                      className='hover-scale-shadow'
                      src={image.src.medium}
                      alt={image.alt || 'Pexels image preview'}
                      height='200px'
                      width='200px'
                    />
                    <ImageMetadata>
                      Photo by <PhotographerLink 
                        href={image.photographer_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // Prevent triggering image selection
                      >
                        {image.photographer}
                      </PhotographerLink>
                      <br />
                      {image.width}×{image.height}px
                    </ImageMetadata>
                  </ImageButton>
                ))
              ) : noPexelImagesAvailable && pageNo === 1 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem', gridColumn: '1 / -1' }}>
                  <p>
                    No related images found. Please change the Signal Title for
                    a better image generation.
                  </p>
                  <p className="undp-typography small-font margin-top-02">
                    Try using simpler, more descriptive terms or generic concepts related to your signal.
                  </p>
                </div>
              ) : null}
            </ImageGrid>
          )}
          
          {pexelImages.length > 0 && !isLoading && (
            <button
              type='button'
              className='undp-button button-tertiary flex margin-bottom-05'
              onClick={refreshPexelImages}
              style={{
                backgroundColor: 'var(--gray-300)',
                padding: 'var(--spacing-05)',
                alignSelf: 'flex-end',
              }}
            >
              Load More Images
            </button>
          )}
        </>
      )}
    </div>
  );
} 
