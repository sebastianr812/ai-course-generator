'use client';

import { Chapter, Course, Unit } from '@prisma/client'
import React, { FC, useMemo, useState } from 'react'
import ChapterCard, { ChapterCardHandler } from './ChapterCard';
import { Button, buttonVariants } from './ui/button';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ConfirmChaptersProps {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[]
        })[]
    };
}

const ConfirmChapters: FC<ConfirmChaptersProps> = ({
    course
}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [completedChapters, setCompletedChapters] = useState<Set<String>>(new Set());
    const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};

    const totalChaptersCount = useMemo(() => {
        return course.units.reduce((acc, curr) =>
            acc + curr.chapters.length, 0)
    }, []);

    course.units.forEach((unit) => {
        unit.chapters.forEach((chapter) => {

            chapterRefs[chapter.id] = React.useRef(null);
        })
    })

    return (
        <div className='w-full mt-4'>
            {course.units.map((unit, index) => (
                <div
                    key={unit.id}
                    className='mt-5'>
                    <h2 className='text-sm uppercase text-secondary-foreground/60'>
                        Unit {index + 1}
                    </h2>
                    <h3 className='text-2xl font-bold'>{unit.name}</h3>
                    <div className='mt-3'>
                        {unit.chapters.map((chapter, idx) => (
                            <ChapterCard
                                ref={chapterRefs[chapter.id]}
                                completedChapters={completedChapters}
                                setCompletedChapters={setCompletedChapters}
                                chapter={chapter}
                                key={chapter.id}
                                chapterIndex={idx} />
                        ))}
                    </div>
                </div>
            ))}

            <div className='flex items-center justify-center mt-4'>
                <Separator className='flex-[1]' />
                <div className='flex items-center mx-4'>
                    <Link href='/create' className={buttonVariants({
                        variant: 'secondary'
                    })}>
                        <ChevronLeft className='w-4 h-4 mr-2' strokeWidth={4} />
                        Back
                    </Link>

                    <Button
                        disabled={loading}
                        onClick={() => {
                            setLoading(true);
                            Object.values(chapterRefs).forEach((ref) => {
                                ref.current?.triggerLoad();
                            })
                        }}
                        type='button'
                        className='ml-4 font-semibold'>
                        Generate
                        <ChevronRight className='w-4 h-4 ml-2' strokeWidth={4} />
                    </Button>
                </div>
                <Separator className='flex-[1]' />
            </div>
        </div>
    )
}

export default ConfirmChapters