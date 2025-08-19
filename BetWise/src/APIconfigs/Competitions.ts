import axios from "axios";

// Set your API base URL
const API_URL = import.meta.env.VITE_API_URL + "/competitions";
export interface Comp {
  _id: number;
  name: string;
  country: string;
  logo: string;
  round: string;
}

export const getCompetitions = async (): Promise<Comp[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getcompetitionById = async (id: string): Promise<Comp> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const AddCompetition = async (
  id: number,
  name: string,
  country: string,
  logo: string,
  round: string
): Promise<Comp> => {
  const response = await axios.post(API_URL, {
    id,
    name,
    country,
    logo,
    round,
  });

  return response.data;
};

export const deleteCompetitionById = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateCompetitionRound = async (
  id: number,
  round: string
): Promise<Comp> => {
  const response = await axios.put(`${API_URL}/${id}/round`, {
    round,
  });
  return response.data;
};
