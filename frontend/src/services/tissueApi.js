const API_URL = "https://qadri-steel-and-tubes.onrender.com";

export async function getTissueRecommendation(tissue) {
  const response = await fetch(`${API_URL}/tissue/${tissue}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tissue recommendation");
  }

  return await response.json();
}