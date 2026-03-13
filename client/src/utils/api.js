const API_URL = "https://kf987i9u90.execute-api.us-east-1.amazonaws.com/prod";

// TODO update API_URL for production also for to Iron Peak Services apis
export const getAPI = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://iron-peak-services.com", // TODO CHANGE THIS TO CORRECT DOMAIN
    },
    body: JSON.stringify(body),
  });
  return await response;
};

export const postAPI = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://iron-peak-services.com", // TODO CHANGE THIS TO CORRECT DOMAIN
    },
    body: JSON.stringify(body),
  });
  return await response;
};
