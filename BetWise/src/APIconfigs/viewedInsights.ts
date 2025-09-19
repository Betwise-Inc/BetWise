import axios from "axios";

// Base URL
const API_URL = import.meta.env.VITE_API_URL + "/viewed-insights";

export interface TeamStats {
  name: string;
  win: number;
  draw: number;
  lose: number;
}

export interface Insight {
  home: TeamStats;
  away: TeamStats;
  goals: number;
  both_teams_to_score: boolean;
}

export interface ViewedInsights {
  email: string;
  insights: Insight[];
}

// Get all viewed insights for a specific email
export const getViewedInsightsByEmail = async (email: string): Promise<ViewedInsights> => {
  const response = await axios.get(`${API_URL}/${email.toLowerCase()}`);
  return response.data;
};

// Add a new insight to a user's viewed insights
export const addViewedInsight = async (email: string, insight: Insight): Promise<ViewedInsights> => {
  // Backend expects POST body: { email, insights }
  const response = await axios.post(`${API_URL}`, { email: email.toLowerCase(), insights: insight });
  return response.data;
};

// Delete an insight by index for a specific user
export const deleteViewedInsight = async (email: string, index: number): Promise<{ message: string; user?: ViewedInsights }> => {
  const response = await axios.delete(`${API_URL}/${email.toLowerCase()}/insights/${index}`);
  return response.data;
};
