import axios from "axios";

// Set your API base URL
const API_URL = "https://backwise-end-2.onrender.com/api/competitions";
export interface Comp {
  _id: number;
  name: string;
  country: string;
  logo: string;
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
  logo: string
): Promise<Comp> => {
  const response = await axios.post(API_URL, {
    id,
    name,
    country,
    logo
  });
  return response.data;
};

export const deleteCompetitionById = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
