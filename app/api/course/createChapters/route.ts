import { getAuthSession } from "@/lib/auth";
import { strict_output } from "@/lib/gpt";
import { CreateChaptersValidator } from "@/lib/validators/course";
import { NextResponse } from "next/server";
import * as z from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            units
        } = CreateChaptersValidator.parse(body);

        type outputUnits = {
            title: string;
            chapters: {
                youtube_search_query: string;
                chapter_title: string;
            }[];
        }

        // @ts-ignore
        let output_units: outputUnits = await strict_output(
            `You are an AI capable of curating course content,
            coming up with relevant chapter titles, and finding relevant
            youtube videos for each chapter`,
            new Array(units.length).fill(`
            It is your job to create a course about ${title}. The user has requested to create chapters
            for each of the units. Then, for each chapter, provide a detailed youtube search query that
            can be used to find an informative educational video for each chapter. Each query should give
            an educational informative course in youtube
            `),
            {
                title: 'title of the unit',
                chapters: 'an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object'
            }
        );

        const imageSearchTerm = await strict_output(
            `You are an AI capable of finding the most relevant image for a course`,
            `Please provide a good image search term for the title of a course about ${title}.
            This search term will be fed into the unsplash API, so make sure it is a good search term that
            will return good results`,
            {
                image_search_term: 'a good search term for the title of the course'
            }
        )

        console.log(output_units);
        return NextResponse.json({ output_units, imageSearchTerm });

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed in', { status: 400 });
        }
        return new NextResponse('internal error POST:COURSE/CREATECHAPTERS', { status: 500 });
    }
}