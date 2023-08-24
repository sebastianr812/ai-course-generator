'use client';

import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react'
import { useToast } from './ui/use-toast';

interface ChapterCardProps {
    chapter: Chapter;
    chapterIndex: number;
    completedChapters: Set<String>;
    setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
}

export type ChapterCardHandler = {
    triggerLoad: () => void;

}

const ChapterCard = React.forwardRef<ChapterCardHandler, ChapterCardProps>(({
    chapter,
    chapterIndex,
    setCompletedChapters,
    completedChapters
}, ref) => {

    const { toast } = useToast();
    const [success, setSuccess] = useState<boolean | null>(null);
    const {
        mutate: getChapterInfo,
        isLoading
    } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post('/api/chapter/getInfo', {
                chapterId: chapter.id
            });
            return data;
        }
    });


    React.useImperativeHandle(ref, () => ({
        async triggerLoad() {
            if (chapter.videoId) {

            }
            getChapterInfo(undefined, {
                onSuccess: () => {
                    setSuccess(true);
                },
                onError: (error) => {
                    console.error(error);
                    setSuccess(false);
                    toast({
                        title: 'Error',
                        description: 'There was a problem loading your chapter',
                        variant: 'destructive'
                    })
                }
            })
        }
    }));

    const addChapterIdToSet = useCallback(() => {
        const newSet = new Set(completedChapters);
        newSet.add(chapter.id)
        setCompletedChapters(newSet);
    }, [completedChapters, chapter.id, setCompletedChapters]);

    return (
        <div key={chapter.id} className={cn('px-4 py-2 mt-2 rounded flex justify-between',
            success === null && 'bg-secondary',
            success === false && 'bg-red-500',
            success === true && 'bg-green-500')}>
            <h5>{chapter.name}</h5>

        </div>
    )
}
)

ChapterCard.displayName = 'ChapterCard'

export default ChapterCard