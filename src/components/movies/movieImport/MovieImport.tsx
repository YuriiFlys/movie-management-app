import React, { useState, useRef } from 'react';
import Button from '@/components/common/button/Button';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import { MovieFormat } from '@/types/movie';
import styles from './MovieImport.module.css';

interface ParsedMovie {
    title: string;
    year: number;
    format: MovieFormat;
    actors: string[];
}

interface MovieImportProps {
    onImport: (file: File) => Promise<void>;
    loading?: boolean;
}

const MovieImport: React.FC<MovieImportProps> = ({
    onImport,
    loading = false,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parseResults, setParseResults] = useState<{
        movies: ParsedMovie[];
        errors: string[];
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseMovieFile = (content: string): { movies: ParsedMovie[]; errors: string[] } => {
        const blocks = content
            .split(/\r?\n\s*\r?\n/)
            .map(block => block.trim())
            .filter(block => block.length > 0);

        const movies: ParsedMovie[] = [];
        const errors: string[] = [];

        blocks.forEach((block, index) => {
            const lines = block.split('\n').map(line => line.trim());

            const titleLine = lines.find(line => line.startsWith('Title:'));
            const yearLine = lines.find(line => line.startsWith('Release Year:'));
            const formatLine = lines.find(line => line.startsWith('Format:'));
            const starsLine = lines.find(line => line.startsWith('Stars:'));

            if (!titleLine || !yearLine || !formatLine) {
                errors.push(`Block ${index + 1}: Missing required fields`);
                return;
            }

            try {
                const title = titleLine.replace(/^Title:\s*/, '').trim();
                const year = parseInt(yearLine.replace(/^Release Year:\s*/, '').trim(), 10);
                const formatStr = formatLine.replace(/^Format:\s*/, '').trim();
                const actorsStr = starsLine ? starsLine.replace(/^Stars:\s*/, '').trim() : '';

                let format: MovieFormat;
                switch (formatStr.toLowerCase()) {
                    case 'vhs':
                        format = MovieFormat.VHS;
                        break;
                    case 'dvd':
                        format = MovieFormat.DVD;
                        break;
                    case 'blu-ray':
                    case 'bluray':
                    case 'blue-ray':
                        format = MovieFormat.BLURAY;
                        break;
                    default:
                        errors.push(`Block ${index + 1}: Invalid format "${formatStr}". Supported: VHS, DVD, Blu-Ray`);
                        return;
                }

                if (year < 1800 || year > new Date().getFullYear() + 5) {
                    errors.push(`Block ${index + 1}: Invalid year ${year}`);
                    return;
                }

                const actors = actorsStr
                    ? actorsStr.split(',').map(actor => actor.trim()).filter(Boolean)
                    : [];

                movies.push({ title, year, format, actors });

            } catch (e) {
                errors.push(`Block ${index + 1}: Error parsing - ${e}`);
            }
        });

        return { movies, errors };
    };


    const handleFileSelect = async (selectedFile: File) => {
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.txt')) {
            alert('Please select a .txt file');
            return;
        }

        setFile(selectedFile);
        setIsProcessing(true);

        try {
            const content = await selectedFile.text();
            const results = parseMovieFile(content);
            setParseResults(results);
        } catch (error) {
            alert('Error reading file: ' + error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleImport = async () => {
        if (file) {
            await onImport(file);
            setFile(null);
            setParseResults(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleReset = () => {
        setFile(null);
        setParseResults(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Import Movies from File</h3>
                <p className={styles.description}>
                    Upload a .txt file with movie data. Each movie should follow this format:<br />
                    <code>
                        Title: Movie Title<br />
                        Release Year: YYYY<br />
                        Format: FORMAT<br />
                        Stars: Actor 1, Actor 2
                    </code>
                </p>
            </div>

            {!file && (
                <div
                    className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className={styles.dropContent}>
                        <div className={styles.uploadIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p className={styles.dropText}>
                            <strong>Click to browse</strong> or drag and drop your .txt file here
                        </p>
                        <p className={styles.dropSubtext}>
                            Only .txt files are supported
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileInputChange}
                        className={styles.hiddenInput}
                    />
                </div>
            )}

            {isProcessing && (
                <div className={styles.processing}>
                    <LoadingSpinner message="Processing file..." size="sm" />
                </div>
            )}

            {parseResults && (
                <div className={styles.results}>
                    <div className={styles.resultsSummary}>
                        <h4 className={styles.resultsTitle}>Parse Results</h4>
                        <div className={styles.stats}>
                            <span className={styles.successStat}>
                                ✓ {parseResults.movies.length} movies found
                            </span>
                            {parseResults.errors.length > 0 && (
                                <span className={styles.errorStat}>
                                    ⚠ {parseResults.errors.length} errors
                                </span>
                            )}
                        </div>
                    </div>

                    {parseResults.errors.length > 0 && (
                        <div className={styles.errors}>
                            <h5 className={styles.errorsTitle}>Errors:</h5>
                            <ul className={styles.errorsList}>
                                {parseResults.errors.map((error, index) => (
                                    <li key={index} className={styles.errorItem}>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {parseResults.movies.length > 0 && (
                        <div className={styles.preview}>
                            <h5 className={styles.previewTitle}>Preview (first 3 movies):</h5>
                            <div className={styles.moviesList}>
                                {parseResults.movies.slice(0, 3).map((movie, index) => (
                                    <div key={index} className={styles.movieItem}>
                                        <div className={styles.movieInfo}>
                                            <strong>{movie.title}</strong> ({movie.year}) - {movie.format}
                                        </div>
                                        {movie.actors.length > 0 && (
                                            <div className={styles.movieActors}>
                                                Actors: {movie.actors.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {parseResults.movies.length > 3 && (
                                    <div className={styles.moreMovies}>
                                        ... and {parseResults.movies.length - 3} more movies
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button
                            variant="secondary"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Choose Different File
                        </Button>
                        {parseResults.movies.length > 0 && (
                            <Button
                                variant="primary"
                                onClick={handleImport}
                                disabled={loading}
                            >
                                {loading ? 'Importing...' : `Import ${parseResults.movies.length} Movies`}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieImport;