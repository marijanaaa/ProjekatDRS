import { useState, useCallback } from "react";

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  
  const sendRequest = useCallback(async (requestConfig) => {
   
    setIsLoading(true);
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method || "GET",
      headers: requestConfig.headers || {},
      body: requestConfig.body || null,
    });


    
    let data = await response.json();
    
    if (!response.ok) {
      
      data = {
        ...data,
        hasError: true,
        message: data.message !== null ? data.message : "Server error",
        hasConflict: data.message === "Conflict",
      };
    }

    setIsLoading(false);
    return data;
  }, []);

  return {
    isLoading: isLoading,
    sendRequest: sendRequest,
  };
}

export default useHttp;
