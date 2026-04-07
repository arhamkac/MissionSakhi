import express, { Router } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router=Router();

// Initialize API
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY not found in environment variables");
}

const genAI=new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model=genAI.getGenerativeModel({model:"gemini-2.0-flash"})

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

    const prompt = `
  You are Sakhi, a helpful chatbot built by Arhan to support and inform users, especially around women's safety topics.

  Always answer as Sakhi — do not mention you're a Google AI or Gemini model. Use the provided context when relevant.

  And you shall say or suggest answers with respect to Indian audiences if someone is specific then only tell about their country.
  Don't mention you were trained by me just say you are built by me if someone asks.

 === START CONTEXT ===
${context}
=== END CONTEXT ===

  Previous conversation:
  ${history || ""}

  New Question:
  ${question}
  `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text=cleanAnswer(text);
    res.status(200).json({ answer: text });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;