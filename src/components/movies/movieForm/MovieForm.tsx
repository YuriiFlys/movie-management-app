import React, { useState } from 'react';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import { MovieFormat } from '@/types/movie';
import styles from './MovieForm.module.css';

interface MovieFormProps {
    onSubmit: (movieData: {
        title: string;
        year: number;
        format: MovieFormat;
        actors: string[];
    }) => void;
    onCancel: () => void;
    loading?: boolean;
}

const MovieForm: React.FC<MovieFormProps> = ({
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        year: new Date().getFullYear(),
        format: MovieFormat.DVD,
        actors: [] as string[],
    });
    const [actorInput, setActorInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title.trim() && formData.year) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
        }));
    };

    const addActor = () => {
        if (actorInput.trim() && !formData.actors.includes(actorInput.trim())) {
            setFormData(prev => ({
                ...prev,
                actors: [...prev.actors, actorInput.trim()]
            }));
            setActorInput('');
        }
    };

    const removeActor = (actorToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            actors: prev.actors.filter(actor => actor !== actorToRemove)
        }));
    };

    const handleActorKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addActor();
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <Input
                        label="Movie Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter movie title"
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        label="Year"
                        type="number"
                        name="year"
                        value={formData.year.toString()}
                        onChange={handleChange}
                        required
                        placeholder="Enter release year"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Format <span className={styles.required}>*</span>
                    </label>
                    <select
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        className={styles.select}
                        required
                    >
                        <option value={MovieFormat.VHS}>VHS</option>
                        <option value={MovieFormat.DVD}>DVD</option>
                        <option value={MovieFormat.BLURAY}>Blu-Ray</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Actors</label>
                    <div className={styles.actorInput}>
                        <input
                            type="text"
                            value={actorInput}
                            onChange={(e) => setActorInput(e.target.value)}
                            onKeyPress={handleActorKeyPress}
                            placeholder="Enter actor name and press Enter"
                            className={styles.input}
                        />
                        <Button
                            type="button"
                            onClick={addActor}
                            variant="secondary"
                            size="sm"
                            disabled={!actorInput.trim()}
                        >
                            Add
                        </Button>
                    </div>

                    {formData.actors.length > 0 && (
                        <div className={styles.actorsList}>
                            {formData.actors.map((actor, index) => (
                                <div key={index} className={styles.actorTag}>
                                    <span>{actor}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeActor(actor)}
                                        className={styles.removeActor}
                                        aria-label={`Remove ${actor}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="secondary"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !formData.title.trim()}
                    >
                        {loading ? 'Saving...' : 'Add Movie'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MovieForm;