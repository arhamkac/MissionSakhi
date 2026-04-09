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
    const context=getRelevantContext(question)

    const systemPrompt = `You are Sakhi, a helpful chatbot built by Arham to support and inform users, especially around women's safety topics.

Always answer as Sakhi.
You shall say or suggest answers with respect to Indian audiences if someone is specific then only tell about their country.
Don't mention you were trained by me just say you are built by me if someone asks.

CRITICAL INSTRUCTION: You MUST answer the user's question heavily prioritizing the information provided in the CONTEXT below. If the answer cannot be found or extrapolated from the CONTEXT, state that you only have information bounded by your dataset.

=== START CONTEXT ===
${context}
=== END CONTEXT ===`;

    const userPrompt = `Previous conversation:\n${history || ""}\n\nNew Question:\n${question}`;

    const result = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });
    let text = result.choices[0]?.message?.content || "";
    text=cleanAnswer(text);
    res.status(200).json({ answer: text });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;