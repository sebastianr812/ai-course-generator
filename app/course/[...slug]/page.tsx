import CourseSideBar from '@/components/CourseSideBar';
import MainVideoSummary from '@/components/MainVideoSummary';
import QuizCards from '@/components/QuizCards';
import { db } from '@/lib/db';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react'

interface pageProps {
    params: {
        slug: string[]
    }
}

const page: FC<pageProps> = async ({
    params: {
        slug
    }
}) => {
    const [courseId, unitIndexParam, chapterIndexParam] = slug;

    const course = await db.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            units: {
                include: {
                    chapters: {
                        include: {
                            questions: true
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        return redirect('/gallery');
    }
    let unitIndex = parseInt(unitIndexParam);
    let chapterIndex = parseInt(chapterIndexParam);

    const unit = course.units[unitIndex];
    if (!unit) {
        return redirect('/gallery');
    }

    const chapter = unit.chapters[chapterIndex];
    if (!chapter) {
        return redirect('/gallery');
    }

    const nextChapter = unit.chapters[chapterIndex + 1];
    const previousChapter = unit.chapters[chapterIndex - 1];
    return (
        <div >
            <CourseSideBar course={course} currentChapterId={chapter.id} />
            <div>
                <div className='ml-[400px] px-8'>
                    <div className='flex'>
                        <MainVideoSummary
                            chapter={chapter}
                            unit={unit}
                            chapterIndex={chapterIndex}
                            unitIndex={unitIndex} />
                        <QuizCards chapter={chapter} />
                    </div>
                    <div className='flex-[1] h-[1px] mt-4 text-green-500 bg-gray-500' />
                    <div className='flex pb-8'>
                        {previousChapter && (
                            <Link
                                href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}
                                className='flex mt-4 mr-auto w-fit'>
                                <div className='flex items-center'>
                                    <ChevronLeft className='h-6 w-6 mr-1' />
                                    <div className='flex flex-col items-start'>
                                        <span className='text-sm text-secondary-foreground/60'>Previous</span>
                                        <span className='text-xl font-bold'>{previousChapter.name}</span>

                                    </div>
                                </div>
                            </Link>
                        )}
                        {nextChapter && (
                            <Link
                                href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}
                                className='flex mt-4 ml-auto w-fit'>
                                <div className='flex items-center'>
                                    <div className='flex flex-col items-start'>
                                        <span className='text-sm text-secondary-foreground/60'>Next</span>
                                        <span className='text-xl font-bold'>{nextChapter.name}</span>
                                    </div>
                                    <ChevronRight className='w-6 h-6 ml-1' />
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page