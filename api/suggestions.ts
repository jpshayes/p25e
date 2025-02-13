import { VercelRequest, VercelResponse } from '@vercel/node';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!req.body || !req.body.text) {
    return res.status(400).json({ error: 'Invalid request, "text" is required' });
  }

  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-001',
      prompt: `autocomplete this word, letter or sentence: ${text}`,
      max_tokens: 100,
      n: 1,
      stop: undefined,
      temperature: 0.15,
    });
    res.status(200).json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
