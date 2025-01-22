import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-d4da911974e14a91964e88053147bc1d",
});

export const deepseek = async ({
  role,
  content,
}: {
  role: "system" | "user" | "assistant";
  content: string;
}) => {
  switch (role) {
    case "system":
      try {
        const response = await openai.chat.completions.create({
          messages: [{ role: "system", content: content }],
          model: "deepseek-chat",
        });
        return response.choices[0].message.content;
      } catch (error) {
        console.log(error);
        return null;
      }
    case "user":
      try {
        const response = await openai.chat.completions.create({
          messages: [{ role: "user", content: content }],
          model: "deepseek-chat",
        });
        console.log(response);
        console.log(response.choices[0].message);
        console.log(response.choices[0].message.content);
        return response.choices[0].message.content;
      } catch (error) {
        console.log(error);
        return null;
      }
    case "assistant":
      try {
        const response = await openai.chat.completions.create({
          messages: [{ role: "assistant", content: content }],
          model: "deepseek-chat",
        });
        return response.choices[0].message.content;
      } catch (error) {
        console.log(error);
        return null;
      }
    default:
      return null;
  }
};
