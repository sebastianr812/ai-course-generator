import CourseSideBar from '@/components/CourseSideBar';
import MainVideoSummary from '@/components/MainVideoSummary';
import QuizCards from '@/components/QuizCards';
import { db } from '@/lib/db';
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
                </div>
            </div>
        </div>
    )
}

export default page