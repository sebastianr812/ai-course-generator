import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { checkSubscription } from "@/lib/subscription";
import { getUnsplashImage } from "@/lib/unsplash";
import { CreateChaptersValidator } from "@/lib/validators/course";
import { NextResponse } from "next/server";
import * as z from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return new NextResponse('unauthorized', { status: 401 });
        }
        const isPro = await checkSubscription();
        if (session.user.credits <= 0 && !isPro) {
            return new NextResponse('no credits left', { status: 402 });
        }
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
        }[]

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
        // @ts-ignore
        const course_image = await getUnsplashImage(imageSearchTerm.image_search_term);

        const course = await db.course.create({
            data: {
                name: title,
                image: course_image
            }
        });

        for (const unit of output_units) {
            const title = unit.title;
            const prismaUnit = await db.unit.create({
                data: {
                    name: title,
                    courseId: course.id,
                }
            });
            await db.chapter.createMany({
                data: unit.chapters.map((chapter) => ({
                    name: chapter.chapter_title,
                    youtubeSearchQuery: chapter.youtube_search_query,
                    unitId: prismaUnit.id
                }))
            });
        }
        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                credits: {
                    decrement: 1
                }
            }
        });
        return NextResponse.json({ course_id: course.id })

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed in', { status: 400 });
        }
        return new NextResponse('internal error POST:COURSE/CREATECHAPTERS', { status: 500 });
    }
}