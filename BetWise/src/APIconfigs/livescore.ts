import axios from "axios";

export interface LiveScore {
  id: number;
  fixture_id: number;
  status: string;
  time: string;
  scores: {
    score: string;
    ht_score: string;
    ft_score: string;
  };
  home: {
    name: string;
    logo: string;
  };
  away: {
    name: string;
    logo: string;
  };
}

// interface LiveScoreResponse {
//   success: boolean;
//   data: {
//     match: LiveScore[];
//   };
// }

const BASE_URL = import.meta.env.VITE_API_URL + "/livescore";

export const fetchLiveScore = async (fixtureId: number): Promise<LiveScore | null> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        fixtureId,
      },
    });

    // Log the response to see the actual structure
    console.log('Live score API response:', response.data);

    // Handle different possible response structures
    if (response.data) {
      // Check if it's the expected structure
      if (response.data.success === true && response.data.data?.match?.length > 0) {
        return response.data.data.match[0];
      }
      // Check if data is directly in response.data
      else if (response.data.data?.match && Array.isArray(response.data.data.match)) {
        return response.data.data.match.length > 0 ? response.data.data.match[0] : null;
      }
      // Check if match data is directly in response.data
      else if (response.data.match && Array.isArray(response.data.match)) {
        return response.data.match.length > 0 ? response.data.match[0] : null;
      }
      // Check if it's a single match object (not array)
      else if (response.data.data?.match && !Array.isArray(response.data.data.match)) {
        return response.data.data.match;
      }
    }

    return null; // No live score available
  } catch (err: any) {
    console.error("Error fetching live score from API:", err.message);
    // Don't throw error, just return null to handle gracefully
    return null;
  }
};

// Helper function to get live scores for multiple fixtures
export const fetchMultipleLiveScores = async (fixtureIds: number[]): Promise<(LiveScore | null)[]> => {
  try {
    const promises = fixtureIds.map(id => fetchLiveScore(id));
    const results = await Promise.allSettled(promises);
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : null
    );
  } catch (err: any) {
    console.error("Error fetching multiple live scores:", err.message);
    throw err;
  }
};