import axios from 'axios';
import { useEffect, useState } from 'react';
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

export function PexelsImagePicker({ query, onImageSelect }: Props) {
  const [pexelImages, setPexelImages] = useState<PexelsImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noPexelImagesAvailable, setNoPexelImagesAvailable] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  async function urlToFile(url: string, filename: string, mimeType: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  }

  const getPexelImages = async () => {
    if (!query) {
      return;
    }
    
    setIsLoading(true);
    const PEXEL_API_KEY = import.meta.env.VITE_PEXEL_API_KEY || process.env.REACT_APP_PEXEL_API_KEY;
    
    try {
      // Extract keywords to get better search results
      const refinedQuery = extractKeywords(query);
      
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

  const refreshPexelImages = () => {
    setPageNo(prevPage => prevPage + 1);
  };

  const handleImageSelect = async (image: PexelsImage) => {
    try {
      const file = await urlToFile(
        image.src.medium,
        `${query} pexel-image.jpg`,
        'image/jpeg'
      );
      onImageSelect(image.src.medium, file);
      setIsVisible(false);
    } catch (err) {
      console.error('Error processing selected image:', err);
    }
  };

  // Initial load and page changes
  useEffect(() => {
    if (query) {
      getPexelImages();
    }
  }, [pageNo, query]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type='button'
          className='undp-button button-tertiary flex'
          onClick={getPexelImages}
          style={{
            backgroundColor: query ? 'var(--gray-300)' : 'var(--gray-200)',
            padding: 'var(--spacing-05)',
            alignSelf: 'flex-end',
            cursor: query ? 'pointer' : 'not-allowed',
            opacity: query ? '1' : '0.6',
          }}
          disabled={!query || isLoading}
        >
          {isLoading ? 'Loading...' : 'Generate Image'}
        </button>
        
        {pexelImages.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type='button'
              className='undp-button button-tertiary flex'
              onClick={toggleVisibility}
            >
              {isVisible ? '▲ Hide' : '▼ Show'}
            </button>
          </div>
        )}
      </div>
      
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
      
      {isVisible && !isLoading && pexelImages.length > 0 && (
        <p className="undp-typography small-font margin-bottom-02">
          Showing results for "{query}". {totalResults} images found.
        </p>
      )}
      
      {isVisible && !isLoading && (
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
      
      {isVisible && pexelImages.length > 0 && !isLoading && (
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
    </div>
  );
} 