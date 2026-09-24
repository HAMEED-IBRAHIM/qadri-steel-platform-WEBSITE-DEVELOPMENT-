const API_URL = "https://qadri-steel-and-tubes.onrender.com";

export async function runPrediction(data) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed.");
  }

  return await response.json();
}