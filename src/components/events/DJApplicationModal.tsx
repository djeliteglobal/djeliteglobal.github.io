import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const applicationSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
  experience: z.string().min(1, 'Experience level is required'),
  equipment: z.string().min(1, 'Equipment info is required'),
  rate: z.number().min(50, 'Minimum rate is $50')
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface DJApplicationModalProps {
  event: any;
  onClose: () => void;
  onApplicationSubmitted: (application: any) => void;
}

export const DJApplicationModal: React.FC<DJApplicationModalProps> = ({ event, onClose, onApplicationSubmitted }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema)
  });

  const onSubmit = (data: ApplicationFormData) => {
    const application = {
      id: Date.now().toString(),
      eventId: event.id,
      djName: 'Current User', // TODO: Get from auth context
      ...data,
      status: 'pending',
      appliedAt: new Date()
    };
    
    onApplicationSubmitted(application);
    toast.success('🎧 Application submitted! Venue will review soon.');
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="bg-[color:var(--surface)] rounded-2xl w-full max-w-lg shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[color:var(--border)]">
          <h2 className="text-xl font-bold text-[color:var(--text-primary)]">Apply to DJ</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[color:var(--surface-alt)] flex items-center justify-center">✕</button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-[color:var(--surface-alt)] rounded-lg">
            <h3 className="font-semibold text-[color:var(--text-primary)]">{event.title}</h3>
            <p className="text-sm text-[color:var(--text-secondary)]">{event.venue} • {event.date} • ${event.budget}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Why you're perfect for this event</label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none resize-none"
                placeholder="Tell them about your style, experience with similar events..."
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Experience Level</label>
                <select
                  {...register('experience')}
                  className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                  <option value="professional">Professional (10+ years)</option>
                </select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Your Rate ($)</label>
                <input
                  {...register('rate', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                  placeholder="400"
                />
                {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Equipment You'll Bring</label>
              <input
                {...register('equipment')}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                placeholder="Pioneer CDJ-3000, DJM-900NXS2, Laptop with Serato"
              />
              {errors.equipment && <p className="text-red-500 text-sm mt-1">{errors.equipment.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[color:var(--surface-alt)] text-[color:var(--text-primary)] py-3 rounded-xl font-semibold hover:bg-[color:var(--border)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[color:var(--accent)] text-black py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Submit Application 🎧
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};