import { cn } from '@/lib/utils';
import { Chapter, Course, Unit } from '@prisma/client'
import Link from 'next/link';
import { FC } from 'react'
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';

interface CourseSideBarProps {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[]
        })[];
    };
    currentChapterId: string;
}

const CourseSideBar: FC<CourseSideBarProps> = async ({
    course,
    currentChapterId
}) => {
    return (
        <div className='w-[400px] absolute top-1/2 -translate-y-1/2 p-6 rounded-r-3xl bg-secondary'>
            <h1 className='text-4xl font-bold '>
                {course.name}
            </h1>
            {course.units.map((unit, unitIdx) => (
                <div key={unit.id} className='mt-4'>
                    <h2 className='text-sm uppercase text-secondary-foreground opacity-60'>Unit {unitIdx + 1}</h2>
                    <h2 className='text-2xl font-bold'>{unit.name}</h2>
                    {unit.chapters.map((chapter, chapterIdx) => {
                        return (
                            <div key={chapter.id}>
                                <Link
                                    className={cn('text-secondary-foreground/60', {
                                        'text-green-500 font-bold': currentChapterId === chapter.id
                                    })}
                                    href={`/course/${course.id}/${unitIdx}/${chapterIdx}`}>
                                    {chapter.name}
                                </Link>
                            </div>
                        )
                    })}
                    <Separator className='mt-2 text-gray-500 bg-gray-500' />
                </div>
            ))}
        </div>
    )
}

export default CourseSideBar;