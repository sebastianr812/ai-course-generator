import { db } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getQuestionsFromTranscript } from "@/lib/utils";
import { getTranscript, searchYoutube } from "@/lib/youtube";
import { NextResponse } from "next/server";
import * as z from 'zod';


const bodyObject = z.object({
    chapterId: z.string()
});

export async function POST(req: Request) {
    try {

        const body = await req.json();
        const {
            chapterId
        } = bodyObject.parse(body);

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId
            }
        });

        if (!chapter) {
            return NextResponse.json({
                success: false,
                error: 'chapter not found'
            }, { status: 404 });
        }

        const videoId = await searchYoutube(chapter.youtubeSearchQuery);

        let transcript = await getTranscript(videoId);
        let maxLength = 250;
        transcript = transcript.split(' ').slice(0, maxLength).join(' ');

        const { summary }: { summary: string } = await strict_output(
            `You are an AI capable of summarizing a youtube transcript`,
            `summarize in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic,
            also do not introduce what the summary is about.\n` + transcript,
            {
                summary: 'summary of the transcript in JSON format'
            }
        );

        const questions = await getQuestionsFromTranscript(transcript, chapter.name);

        await db.question.createMany({
            data: questions.map((question) => {
                let options = [question.answer, question.option1, question.option2, question.option3];
                options = options.sort(() => Math.random() * 0.5)
                return {
                    question: question.question,
                    answer: question.answer,
                    options: JSON.stringify(options),
                    chapterId
                }
            })
        });

        await db.chapter.update({
            where: {
                id: chapterId
            },
            data: {
                videoId,
                summary
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        if (e instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: 'invalid data passed'
            }, { status: 400 });
        }
        return NextResponse.json({
            success: false,
            error: 'internal error POST:CHAPTER/GETINFO'
        }, { status: 500 });
    }
}