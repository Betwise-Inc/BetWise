import axios from "axios";

export interface Fixture {
  id: number; // unique fixture id
  home_name: string;
  away_name: string;
  time?: string; 
}

interface FixtureResponse {
  success: boolean;
  data: {
    fixtures: Fixture[];
  };
}

const BASE_URL = import.meta.env.VITE_API_URL + "/fixtures";

export const fetchFixtures = async (
  competitionId: number,
  round: string
): Promise<Fixture[]> => {
  try {
    const response = await axios.get<FixtureResponse>(BASE_URL, {
      params: {
        competitionId,
        round,
      },
    });

    if (response.data.success === true) {
      return response.data.data.fixtures;
    } else {
      throw new Error("API responded with failure");
    }
  } catch (err: any) {
    console.error("Error fetching fixtures from API:", err.message);
    throw err;
  }
};
