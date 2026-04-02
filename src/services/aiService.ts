import apiClient from "./apiClient";

export interface AiGenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
}

export const aiService = {
  generate: async (prompt: string): Promise<AiGenerationResult> => {
    const res = await apiClient.post<AiGenerationResult>("/ai/generate", {
      prompt,
    });
    return res.data;
  },
};
