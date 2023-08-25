'use client';

import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';

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

    const addChapterIdToSet = useCallback(() => {
        setCompletedChapters((prev) => {
            const newSet = new Set(prev);
            newSet.add(chapter.id);
            return newSet;
        });
    }, [chapter.id, setCompletedChapters]);

    React.useImperativeHandle(ref, () => ({
        async triggerLoad() {
            if (chapter.videoId) {
                addChapterIdToSet();
                return;
            }
            getChapterInfo(undefined, {
                onSuccess: () => {
                    setSuccess(true);
                    addChapterIdToSet();
                },
                onError: (error) => {
                    console.error(error);
                    setSuccess(false);
                    toast({
                        title: 'Error',
                        description: 'There was a problem loading your chapter',
                        variant: 'destructive'
                    });
                    addChapterIdToSet();
                }
            })
        }
    }));

    useEffect(() => {
        if (chapter.videoId) {
            setSuccess(true);
            addChapterIdToSet();
        }
    }, [chapter, addChapterIdToSet])

    return (
        <div key={chapter.id} className={cn('px-4 py-2 mt-2 rounded flex justify-between',
            success === null && 'bg-secondary',
            success === false && 'bg-red-500',
            success === true && 'bg-green-500')}>
            <h5>{chapter.name}</h5>
            {isLoading && <Loader2 className='animate-spin' />}
        </div>
    )
}
)

ChapterCard.displayName = 'ChapterCard'

export default ChapterCard