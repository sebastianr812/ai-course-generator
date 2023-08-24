import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { strict_output } from "./gpt"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getQuestionsFromTranscript(transcript: string, courseTitle: string) {

  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  }
  const questions: Question[] = await strict_output(
    `You are a helpful AI that is able to generate multiple choice questions and answers.
    The length of each answer should not be more than 15 words.`,
    new Array(5).fill(
      `You are to generate a random hard multiple choice question about the ${courseTitle} with context
      of the following transpcript:\n${transcript}`
    ),
    {
      question: 'question',
      answer: 'answer with max legnth of 15 words',
      option1: 'option1 with max length of 15 words',
      option2: 'option2 max length of 15 words',
      option3: 'option3 max length of 15 words'
    }
  );

  return questions;
}