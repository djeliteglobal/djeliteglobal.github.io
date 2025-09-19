import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from '../constants/platform';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface DJHirePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  djProfile: {
    id: string;
    dj_name: string;
    bio?: string;
    location?: string;
    experience_level?: string;
    rate?: number;
  };
}

interface HireFormData {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  durationHours: number;
  specialRequests: string;
}

const DJHireForm: React.FC<{ 
  djProfile: DJHirePaymentProps['djProfile']; 
  onSuccess: () => void;
}> = ({ djProfile, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<HireFormData>({
    eventName: '',
    eventDate: '',
    eventLocation: '',
    durationHours: 4,
    specialRequests: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationHours' ? parseInt(value) || 0 : value
    }));
  };

  const calculateTotal = () => {
    const baseRate = djProfile.rate || 100; // Default rate if not specified
    return baseRate * formData.durationHours;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent for DJ hire
      const response = await fetch('/.netlify/functions/create-dj-hire-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: currentUser.email, // Using email as identifier since User type doesn't have id
          djId: djProfile.id,
          eventName: formData.eventName,
          eventDate: formData.eventDate,
          eventLocation: formData.eventLocation,
          durationHours: formData.durationHours,
          rate: calculateTotal(),
          specialRequests: formData.specialRequests
        })
      });

      const { clientSecret, hireId, error: apiError } = await response.json();

      if (apiError) {
        setError(apiError);
        setLoading(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: currentUser.email || 'guest@example.com',
            name: currentUser.name || 'Guest User'
          }
        }
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
            Event Name *
          </label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-[color:var(--border)] rounded-lg bg-[color:var(--surface)] text-[color:var(--text-primary)]"
            placeholder="Birthday Party, Wedding, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
            Event Date & Time *
          </label>
          <input
            type="datetime-local"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-[color:var(--border)] rounded-lg bg-[color:var(--surface)] text-[color:var(--text-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
            Event Location *
          </label>
          <input
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-[color:var(--border)] rounded-lg bg-[color:var(--surface)] text-[color:var(--text-primary)]"
            placeholder="Venue name and address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
            Duration (hours) *
          </label>
          <select
            name="durationHours"
            value={formData.durationHours}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-[color:var(--border)] rounded-lg bg-[color:var(--surface)] text-[color:var(--text-primary)]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
              <option key={hours} value={hours}>{hours} {hours === 1 ? 'hour' : 'hours'}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
          Special Requests
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-3 border border-[color:var(--border)] rounded-lg bg-[color:var(--surface)] text-[color:var(--text-primary)]"
          placeholder="Any specific requirements or requests..."
        />
      </div>

      <div className="bg-[color:var(--surface-alt)] p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[color:var(--text-secondary)]">DJ Rate:</span>
          <span className="text-[color:var(--text-primary)]">${djProfile.rate || 100}/hour</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[color:var(--text-secondary)]">Duration:</span>
          <span className="text-[color:var(--text-primary)]">{formData.durationHours} hours</span>
        </div>
        <div className="border-t border-[color:var(--border)] pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-[color:var(--text-primary)]">Total:</span>
            <span className="text-2xl font-bold text-[color:var(--accent)]">${calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div className="bg-[color:var(--surface)] p-4 rounded-lg border border-[color:var(--border)]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': { color: '#6b7280' }
              }
            }
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[color:var(--accent)] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[color:var(--accent-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : `Pay $${calculateTotal()} - Book ${djProfile.dj_name}`}
      </button>
    </form>
  );
};

export const DJHirePayment: React.FC<DJHirePaymentProps> = ({ isOpen, onClose, djProfile }) => {
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      onClose();
      setSuccess(false);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[color:var(--text-primary)]">
            Book {djProfile.dj_name}
          </h2>
          <button
            onClick={onClose}
            className="text-[color:var(--muted)] hover:text-[color:var(--text-primary)] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-[color:var(--accent)] mb-2">Booking Successful!</h3>
            <p className="text-[color:var(--text-secondary)]">
              Your booking request for {djProfile.dj_name} has been sent. You'll receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-[color:var(--surface-alt)] rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{djProfile.dj_name}</h3>
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    {djProfile.location && `${djProfile.location} • `}
                    {djProfile.experience_level && `${djProfile.experience_level} • `}
                    ${djProfile.rate ? `$${djProfile.rate}/hour` : 'Rate upon request'}
                  </p>
                </div>
              </div>
              {djProfile.bio && (
                <p className="text-sm text-[color:var(--text-secondary)]">{djProfile.bio}</p>
              )}
            </div>

            <Elements stripe={stripePromise}>
              <DJHireForm djProfile={djProfile} onSuccess={handleSuccess} />
            </Elements>
          </>
        )}
      </div>
    </div>
  );
};