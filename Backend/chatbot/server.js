import express, { Router } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Groq from "groq-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router=Router();

// Initialize API
if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY not found in environment variables");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Load knowledge base from CSV file
const csvPath = path.join(__dirname, "womens_chatbot_dataset.csv");
let knowledge = "";
try {
  knowledge = fs.readFileSync(csvPath, "utf-8");
} catch (error) {
  console.error(`ERROR: Could not read CSV file at ${csvPath}:`, error.message);
  knowledge = "";
}
const rows=knowledge.split('\n').filter(row => row.trim())

import stringSimilarity from 'string-similarity';

function getRelevantContext(question) {
  const matches = rows.map(row => ({
    row,
    score: stringSimilarity.compareTwoStrings(question.toLowerCase(), row.toLowerCase())
  }));
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 10).map(m => m.row).join("\n");
}



function cleanAnswer(raw) {
  return raw
    .replace(/\*\*\*/g, '\n')
    .replace(/\*\*/g, '\n')
    .replace(/\*/g, '\n')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .trim();
}


router.route('/ask').post(async (req, res) => {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const context = getRelevantContext(question);

    const systemPrompt = `You are Sakhi, a warm, knowledgeable AI companion built by Arham specifically for women. You specialise in:
- Women's safety (at home, in public, online, while traveling)
- Mental health and emotional support
- Legal rights and protections for women in India (and internationally when asked)
- Health, hygiene, and reproductive wellbeing
- Self-defense tips and personal safety strategies
- Workplace rights, harassment, and equality
- Relationships, boundaries, and consent
- Feminism, gender equity, and empowerment topics

Your personality: warm, non-judgmental, empowering, and clear. You always take women's concerns seriously and never minimise or victim-blame.

GUIDELINES:
- Answer from your own broad knowledge. You have extensive knowledge on all topics above.
- If the CONTEXT BLOCK below contains relevant information, incorporate it to enrich your answer.
- Do NOT refuse or say "my dataset doesn't cover this" for standard women's safety or wellbeing questions — use your general knowledge.
- If someone is in immediate danger: always mention calling 112 (India emergency) or 181 (women's helpline India). Adjust for their country if specified.
- Speak from an Indian cultural context by default unless the user specifies otherwise.
- Format responses clearly: use **bold** for key points, bullet lists for steps.
- Do not mention being trained on a dataset. If asked who made you, say: "I was built by Arham to support women."

SUPPLEMENTARY CONTEXT (use if relevant):
${context}`;

    const userPrompt = `${history ? `Previous conversation:\n${history}\n\n` : ""}Question: ${question}`;

    const result = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
    });

    const text = result.choices[0]?.message?.content?.trim() || "";
    res.status(200).json({ answer: text });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;