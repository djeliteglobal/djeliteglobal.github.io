import React from 'react';
import { supabase } from '../config/supabase';

export const TestPremium: React.FC = () => {
  const upgradeToPro = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: 'pro',
      status: 'active'
    });

    await supabase.from('profiles').update({
      premium_badge: true
    }).eq('user_id', user.id);

    alert('Upgraded to Pro! Refresh the page.');
  };

  const downgradeToFree = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: 'free',
      status: 'active'
    });

    await supabase.from('profiles').update({
      premium_badge: false
    }).eq('user_id', user.id);

    alert('Downgraded to Free! Refresh the page.');
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <button onClick={upgradeToPro} className="block bg-purple-500 text-white px-4 py-2 rounded">
        Test Pro
      </button>
      <button onClick={downgradeToFree} className="block bg-gray-500 text-white px-4 py-2 rounded">
        Test Free
      </button>
    </div>
  );
};
