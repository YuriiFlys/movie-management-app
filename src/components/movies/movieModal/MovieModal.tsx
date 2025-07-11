import React from 'react';
import Modal from '@/components/common/modal/Modal';
import MovieDetails from '../movieDetails/MovieDetails';

interface MovieModalProps {
    isOpen: boolean;
    movieId: string | null;
    onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({
    isOpen,
    movieId,
    onClose,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Movie Details"
            size="lg"
        >
            {movieId && (
                <MovieDetails
                    movieId={movieId}
                    onClose={onClose}
                />
            )}
        </Modal>
    );
};

export default MovieModal;