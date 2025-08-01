import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config()

const app=express();
app.use(cors());
app.use(express.json());

const genAI=new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model=genAI.getGenerativeModel({model:"gemini-2.0-flash"})

const knowledge=fs.readFileSync("female_support_dataset.csv","utf-8")
const rows=knowledge.split('\n')

function getRelevantContext(question) {
  const keywords = question.toLowerCase().split(" ");
  const matched = rows.filter(row =>
    keywords.some(kw => row.toLowerCase().includes(kw))
  );
  return matched.slice(0, 10).join("\n");
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


app.post('/ask', async (req, res) => {
  const { question, history } = req.body;

  const context=getRelevantContext(question)

  const prompt = `
  You are Sakhi, a helpful chatbot built by Arhan to support and inform users, especially around women's safety topics.

  Always answer as Sakhi — do not mention you're a Google AI or Gemini model. Use the provided context when relevant.

  And you shall say or suggest answers with respect to Indian audiences if someone is specific then only tell about their country.

  Use the following context if it's relevant:
   ${context}

  Previous conversation:
  ${history}

  New Question:
  ${question}
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text=cleanAnswer(text);
    res.status(200).json({ answer: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(3001,()=>{
    console.log("Server running on port 3001")
})