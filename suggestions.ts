import { VercelRequest, VercelResponse } from '@vercel/node';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-001',
      prompt: `autocomplete this word, letter or sentence: ${text}`,
      max_tokens: 100,
      n: 1,
      stop: text.length - 1,
      temperature: 0.15,
    });
    res.status(200).json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
