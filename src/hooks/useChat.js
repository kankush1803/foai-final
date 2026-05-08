import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getCached, setCache } from '../utils/cache';

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const MAX_MESSAGES = 30;
const CACHE_KEY = 'chat_messages';

export function useChat(issData, newsData) {
  const [messages, setMessages] = useState(() => {
    return getCached(CACHE_KEY, Infinity) || [];
  });
  const [typing, setTyping] = useState(false);

  // Persist messages
  useEffect(() => {
    setCache(CACHE_KEY, messages);
  }, [messages]);

  const buildContext = useCallback(() => {
    const parts = [];

    // ISS context
    if (issData?.currentPos) {
      parts.push(
        `ISS Current Position: Latitude ${issData.currentPos.latitude.toFixed(4)}, Longitude ${issData.currentPos.longitude.toFixed(4)}`
      );
      parts.push(`ISS Speed: ${issData.speed} km/h`);
      parts.push(`ISS Location: ${issData.location}`);
      parts.push(`Positions tracked: ${issData.positions.length}`);
    }
    if (issData?.astronauts?.length) {
      parts.push(
        `Astronauts in space (${issData.astronautCount}): ${issData.astronauts.map((a) => `${a.name} (${a.craft})`).join(', ')}`
      );
    }

    // News context
    if (newsData?.allArticles) {
      Object.entries(newsData.allArticles).forEach(([category, articles]) => {
        if (articles?.length) {
          parts.push(
            `\nTop ${category} headlines:\n${articles.slice(0, 5).map((a, i) => `${i + 1}. ${a.title} (${a.source?.name || 'Unknown'})`).join('\n')}`
          );
        }
      });
    }

    return parts.join('\n');
  }, [issData, newsData]);

  const sendMessage = useCallback(
    async (userText) => {
      const userMsg = { role: 'user', content: userText, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      setTyping(true);

      try {
        const token = import.meta.env.VITE_AI_TOKEN;
        if (!token) {
          throw new Error('AI token not configured');
        }

        const context = buildContext();
        const systemPrompt = `You are a helpful dashboard assistant. You can ONLY answer questions based on the following real-time dashboard data. If the user asks something outside this data, reply: "I can only answer based on dashboard data."

Dashboard Data:
${context}`;

        const response = await fetch(HF_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: HF_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userText },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
           throw new Error(data.error ? JSON.stringify(data.error) : `HTTP error ${response.status}`);
        }

        const reply =
          data?.choices?.[0]?.message?.content ||
          'No response received.';

        const botMsg = {
          role: 'assistant',
          content: reply.trim(),
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg].slice(-MAX_MESSAGES));
      } catch (err) {
        const errorMsg = {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${err.message}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg].slice(-MAX_MESSAGES));
      } finally {
        setTyping(false);
      }
    },
    [buildContext]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CACHE_KEY);
  }, []);

  return { messages, typing, sendMessage, clearChat };
}
