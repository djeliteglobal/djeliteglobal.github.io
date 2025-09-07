import React, { useState } from 'react';
import { Button } from './platform';

export const ProfileSetup: React.FC = () => {
    const [formData, setFormData] = useState({
        dj_name: '',
        bio: '',
        age: '',
        location: '',
        genres: [] as string[],
        images: [] as string[]
    });

    const availableGenres = ['Techno', 'House', 'Deep House', 'Trance', 'Dubstep', 'UK Garage', 'Disco', 'Funk', 'EDM', 'Industrial'];

    const handleGenreToggle = (genre: string) => {
        setFormData(prev => ({
            ...prev,
            genres: prev.genres.includes(genre) 
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // const response = await fetch('/api/profiles/create', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            console.log('Profile created:', formData);
            alert('Profile created successfully!');
        } catch (error) {
            console.error('Failed to create profile:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create Your DJ Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">DJ Name</label>
                    <input
                        type="text"
                        value={formData.dj_name}
                        onChange={(e) => setFormData(prev => ({...prev, dj_name: e.target.value}))}
                        className="w-full p-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                        className="w-full p-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] h-24"
                        placeholder="Tell other DJs about yourself..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Age</label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
                            className="w-full p-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                            className="w-full p-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Genres</label>
                    <div className="flex flex-wrap gap-2">
                        {availableGenres.map(genre => (
                            <button
                                key={genre}
                                type="button"
                                onClick={() => handleGenreToggle(genre)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                    formData.genres.includes(genre)
                                        ? 'bg-[color:var(--accent)] text-black'
                                        : 'bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--accent)]'
                                }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Create Profile
                </Button>
            </form>
        </div>
    );
};