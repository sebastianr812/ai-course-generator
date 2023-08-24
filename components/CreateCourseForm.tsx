'use client';

import { FC } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { useForm } from 'react-hook-form';
import { CreateChaptersRequest, CreateChaptersValidator } from '@/lib/validators/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Plus, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface CreateCourseFormProps {

}

const CreateCourseForm: FC<CreateCourseFormProps> = ({ }) => {

    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<CreateChaptersRequest>({
        resolver: zodResolver(CreateChaptersValidator),
        defaultValues: {
            title: '',
            units: ['', '', '']
        }
    });

    const {
        mutate: createChapters,
        isLoading
    } = useMutation({
        mutationFn: async ({ title, units }: CreateChaptersRequest) => {
            const payload: CreateChaptersRequest = {
                title,
                units
            }
            const { data } = await axios.post('/api/course/createChapters', payload);
            return data;
        }
    })

    function onSubmit(data: CreateChaptersRequest) {
        if (data.units.some(unit => unit === '')) {
            toast({
                title: 'Error',
                description: 'Please fill out all of the units',
                variant: 'destructive'
            });
            return;
        }
        createChapters(data, {
            onSuccess: ({ course_id }) => {
                toast({
                    title: 'Success',
                    description: 'Course created successfully'
                });
                router.push(`/create/${course_id}`);
            },
            onError: (e) => {
                toast({
                    title: 'Error',
                    description: 'Something went wrong',
                    variant: "destructive"
                });
            }
        })
    }

    form.watch();
    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full mt-4'>
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem className='flex flex-col items-start w-full sm:items-center sm:flex-row'>
                                <FormLabel className='flex-[1] text-xl'>
                                    Title
                                </FormLabel>
                                <FormControl className='flex-[6]'>
                                    <Input
                                        placeholder='Enter the main topic of the course'
                                        {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                    <AnimatePresence>
                        {form.watch('units').map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    height: { duration: 0.2 }
                                }}>
                                <FormField
                                    key={index}
                                    name={`units.${index}`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col items-start sm:items-center sm:flex-row'>
                                            <FormLabel className='flex-[1] text-xl'>
                                                Unit {index + 1}
                                            </FormLabel>
                                            <FormControl className='flex-[6]'>
                                                <Input
                                                    placeholder='Enter subtopic of the course'
                                                    {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className='flex items-center justify-center mt-4'>
                        <Separator className='flex-[1]' />
                        <div className='mx-4'>
                            <Button
                                variant='secondary'
                                className='font-semibold'
                                type='button'
                                onClick={() => {
                                    form.setValue('units', [...form.watch('units'), ''])
                                }}>
                                Add Unit
                                <Plus className='w-4 h-4 ml-2 text-green-500' />
                            </Button>

                            <Button
                                variant='secondary'
                                className='font-semibold ml-2'
                                type='button'
                                onClick={() => {
                                    form.setValue('units', form.watch('units').slice(0, -1))
                                }}>
                                Remove Unit
                                <Trash className='w-4 h-4 ml-2 text-red-500' />
                            </Button>
                        </div>
                        <Separator className='flex-[1]' />
                    </div>
                    <Button
                        type="submit"
                        className='w-full mt-6'
                        size='lg'
                        disabled={isLoading}>
                        Lets Go!
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateCourseForm