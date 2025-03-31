export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let jwtToken = localStorage.getItem("jwtToken");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "Authorization": jwtToken ? `Bearer ${jwtToken}` : "",
  }

  console.log("Request headers:", headers); 

  try {
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", 
    });



    if (response.status === 401) {
      console.log("Token expired or invalid. Attempting to refresh token...");

      const refreshedToken = await refreshToken();
      if (refreshedToken) {
        jwtToken = refreshedToken;
        const retryHeaders = {
          ...headers,
          "Authorization": `Bearer ${jwtToken}`,
        };

        console.log("Retry request headers:", retryHeaders); 

        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "include", 
        });

        console.log("Retry response status:", response.status); 
      } else {
     
        console.log("Failed to refresh token. Redirecting to login...");
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}

const refreshToken = async () => {
  try {
    console.log("Attempting to refresh token..."); 

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    console.log("New JWT token received:", data.jwtToken); // Debugging: Log the new JWT token

    localStorage.setItem("jwtToken", data.jwtToken);
    return data.jwtToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
 
    localStorage.removeItem("jwtToken");
    return null; 
  }
}
