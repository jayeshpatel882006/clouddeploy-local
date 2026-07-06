export const checkHealth = async (port = 3000) => {
  try {
    const response = await fetch(`http://localhost:${port}/health`);

    if (!response.ok) {
      throw new Error("Health endpoint returned a non-success status.");
    }

    const data = await response.json();

    return {
      success: true,
      status: "HEALTHY",
      response: data,
    };
  } catch (error) {
    throw new Error(`Health check failed.\n${error.message}`);
  }
};
