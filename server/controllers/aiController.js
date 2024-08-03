import { openai } from "../index.js";
import axios from "axios";

const systemMessage = `You are a knowledgeable and helpful travel assistant. You can discuss general topics, answer travel-related questions, and provide personalized travel suggestions. When discussing travel, always consider the user's budget, available time, priorities, and preferences. Suggest specific locations and provide links to relevant tourist platforms. Advise on the best time to travel for optimal experiences.`;

let conversationHistory = [];

export const generateText = async (req, res) => {
  try {
    const { text, activeChatId, userName, userSecret } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text },
      ],
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": userName,
          "User-Secret": userSecret,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};

export const generateCode = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant coder who responds with only code and no explanations.",
        },
        { role: "user", content: text },
      ],
    });

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};

export const assistCompletion = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
        },
        { role: "user", content: `Finish my thought: ${text}` },
      ],
    });

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};

export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    conversationHistory.push({ role: "user", content: message });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        ...conversationHistory,
      ],
      max_tokens: 300,
    });

    const assistantReply = response.data.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: assistantReply });

    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    res.status(200).json({ reply: assistantReply });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTravelSuggestion = async (req, res) => {
  try {
    const { budget, duration, priorities, fantasies } = req.body;

    const prompt = `Based on the following preferences, suggest a travel destination and provide relevant information:
    Budget: ${budget}
    Duration: ${duration} days
    Priorities: ${priorities}
    Fantasies: ${fantasies}
    
    Please provide:
    1. A suitable destination
    2. Reasons why it matches the preferences
    3. Best time to visit
    4. Top 3 attractions or activities
    5. A link to a relevant tourist platform`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": userName,
          "User-Secret": userSecret,
        },
      }
    );
    const suggestion = response.data.choices[0].message.content;

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
};
