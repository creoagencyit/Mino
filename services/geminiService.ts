import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key is obtained from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWindowDesign = async (
  imageBase64: string,
  colorName: string,
  texturePrompt: string
): Promise<string> => {
  try {
    // Strip the data URL prefix if present to get just the base64 string
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const prompt = `
      You are a specialized visualization assistant for 'Magnetic Window Covers'.
      
      Task:
      1. Analyze the provided image of a window.
      2. Identify the **moving sashes (ante)** and the **fixed outer frame (telaio)** attached to the wall.
      3. Simulate applying a **custom magnetic cover** ONLY to the moving sashes (ante).
      4. **DO NOT** apply the cover to the fixed outer frame (telaio). The outer frame must remain in its original color (usually white or neutral).
      
      The cover design parameters are:
      - **Base Tone/Color**: ${colorName}
      - **Surface Design/Texture**: ${texturePrompt}
      
      Instructions for "Surface Design":
      - If the design is a material (like wood, PVC), make it look realistic.
      - If the design is an **Artistic Pattern** (like Giotto, Fresco, Mosaic), apply it as a **high-quality graphic print** wrapped onto the sash profiles.
      
      IMPORTANT CONSTRAINTS: 
      - **Apply cover ONLY to the sashes (ante)**.
      - **Keep the fixed frame (telaio) ORIGINAL**.
      - **Keep the glass transparent**. Do NOT cover the view through the window.
      - **Keep the handle visible** (either metallic or color-matched, but distinct).
      - Maintain original lighting and perspective.
      - The result must look like a physical product applied specifically to the opening parts of the window.
      
      Output: A high-resolution photorealistic image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, standard for canvas exports or uploads
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Check specific response structure for Gemini 2.5 Flash Image which might return image in parts
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating design:", error);
    throw error;
  }
};