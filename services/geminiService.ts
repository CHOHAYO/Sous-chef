import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedRecipes, DifficultyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 이미지에서 식재료 추출
export const extractIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
  const model = "gemini-2.5-flash"; 

  const prompt = `
    이 사진은 냉장고 내부 또는 식재료 사진입니다.
    사진에 보이는 식재료들을 식별하여 한국어 단어 목록으로 나열해주세요.
    소스류, 음료수, 반찬통 등은 제외하고, 요리에 사용할 수 있는 원재료(채소, 고기, 과일, 계란 등) 위주로 식별해주세요.
    
    응답은 반드시 JSON 포맷의 문자열 배열이어야 합니다.
    예시: ["계란", "양파", "파프리카", "우유"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];

  } catch (error) {
    console.error("Image analysis failed:", error);
    throw new Error("이미지를 분석하는 데 실패했습니다.");
  }
};

// 레시피 생성 (창의적이고 우아한 요리)
export const generateRecipes = async (ingredients: string[], difficulty: DifficultyLevel): Promise<GeneratedRecipes> => {
  const model = "gemini-2.5-flash";
  
  const difficultyDescription = {
    'Prêt-à-Porter': '비교적 간단한 조리법과 쉽게 구할 수 있는 재료로 만들 수 있지만 플레이팅은 우아하고 세련된 요리 (접근성 중시).',
    'Atelier': '약간의 조리 기술과 정성이 필요하며, 재료 본연의 맛을 살리는 공예적인 요리 (밸런스 중시).',
    'Haute Couture': '복잡한 조리 과정, 분자 요리 기법, 또는 매우 섬세한 손기술이 필요한 최상급 난이도의 예술적인 요리 (예술성 중시).'
  };

  const prompt = `
    나는 현재 냉장고에 다음과 같은 재료들을 가지고 있어: ${ingredients.join(", ")}.
    
    이 재료들을 주재료로 사용하여 만들 수 있는, **일상에서 흔히 볼 수 없는 매우 창의적이고 독창적인** 요리 3가지를 추천해줘.
    평범한 가정식(김치찌개, 볶음밥 등)은 제외하고, 셰프의 예술적 감각이 돋보이는 퓨전 요리나 파인다이닝 스타일의 메뉴여야 해.
    
    **요청된 난이도 레벨: ${difficulty}**
    ${difficultyDescription[difficulty]}
    이 난이도 수준에 정확히 부합하는 레시피를 제안해줘.
    
    각 레시피에는 다음이 포함되어야 해:
    - 요리 이름 (호기심을 자극하고 우아한 네이밍)
    - 매력적인 한 줄 설명 (요리의 맛과 분위기를 시적으로 묘사)
    - 조리 시간
    - 난이도 (반드시 '${difficulty}'로 표기)
    - 예상 칼로리
    - 필요한 전체 재료 목록
    - Missing Ingredients (입력된 재료 외에 풍미를 위해 꼭 필요한 핵심 재료)
    - 상세한 단계별 조리법 (전문적인 조리 용어 사용 권장)
    - 플레이팅 팁 (색감의 조화, 여백의 미 등 시각적 아름다움을 위한 조언)
    
    응답은 반드시 JSON 형식이어야 해.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "당신은 세계적인 미슐랭 3스타 레스토랑의 헤드 셰프입니다. 창의적이고 예술적인 요리를 제안하며, 어조는 매우 우아하고 섬세합니다.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "요리의 우아하고 창의적인 이름" },
                description: { type: Type.STRING, description: "요리에 대한 시적이고 매력적인 설명" },
                cookingTime: { type: Type.STRING, description: "조리 시간" },
                difficulty: { type: Type.STRING, enum: ["Prêt-à-Porter", "Atelier", "Haute Couture"] },
                calories: { type: Type.STRING, description: "칼로리" },
                ingredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "전체 재료 목록"
                },
                missingIngredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "추가 필요 재료"
                },
                instructions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "단계별 조리법"
                },
                platingTip: { type: Type.STRING, description: "예술적인 플레이팅 팁" }
              },
              required: ["name", "description", "cookingTime", "difficulty", "calories", "ingredients", "missingIngredients", "instructions", "platingTip"]
            }
          }
        },
        required: ["recipes"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  try {
    return JSON.parse(text) as GeneratedRecipes;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse recipe data");
  }
};

// 요리 이미지 생성
export const generateRecipeImage = async (recipeName: string, description: string): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";

  const prompt = `
    Create a stunning, high-end professional food photography image of a dish named "${recipeName}".
    Dish Description: ${description}.
    
    Style requirements:
    - Michelin-star quality plating.
    - Soft, natural, window-light illumination.
    - Shallow depth of field (bokeh background).
    - Highly detailed textures of the food.
    - Elegant tableware and cutlery.
    - The overall vibe should be luxurious, appetizing, and artistic.
    - Top-down or 45-degree angle view.
    - 4k resolution, hyper-realistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};