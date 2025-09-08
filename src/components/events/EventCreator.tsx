import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  venue: z.string().min(1, 'Venue is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(1, 'Duration must be at least 1 hour'),
  budget: z.number().min(50, 'Minimum budget is $50'),
  genres: z.array(z.string()).min(1, 'Select at least one genre'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventCreatorProps {
  onClose: () => void;
  onEventCreated: (event: any) => void;
}

export const EventCreator: React.FC<EventCreatorProps> = ({ onClose, onEventCreated }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { genres: [] }
  });

  const genres = ['House', 'Techno', 'Deep House', 'Trance', 'Progressive', 'Tech House', 'Drum & Bass', 'Hip Hop'];

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(newGenres);
    setValue('genres', newGenres);
  };

  const onSubmit = (data: EventFormData) => {
    const event = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      status: 'open',
      applications: []
    };
    
    onEventCreated(event);
    toast.success('🎉 Event created! DJs can now apply!');
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="bg-[color:var(--surface)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[color:var(--border)]">
          <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">Create Event</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[color:var(--surface-alt)] flex items-center justify-center">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Event Title</label>
            <input
              {...register('title')}
              className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
              placeholder="Summer Rooftop Party"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Venue</label>
              <input
                {...register('venue')}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                placeholder="Sky Lounge NYC"
              />
              {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Budget ($)</label>
              <input
                {...register('budget', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                placeholder="500"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Date</label>
              <input
                {...register('date')}
                type="date"
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Time</label>
              <input
                {...register('time')}
                type="time"
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Duration (hours)</label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="1"
                max="12"
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                placeholder="4"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Music Genres</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {genres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-[color:var(--accent)] text-black'
                      : 'bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            {errors.genres && <p className="text-red-500 text-sm">{errors.genres.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Event Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none resize-none"
              placeholder="Describe your event, vibe, and what you're looking for..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[color:var(--accent)] text-black py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Create Event 🎉
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};