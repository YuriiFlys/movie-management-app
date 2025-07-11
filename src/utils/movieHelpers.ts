import { ApiMovie, Movie, MovieFormData } from "@/types/movie";

export const convertApiMovieToMovie = (apiMovie: ApiMovie): Movie => {
    let actors: string[] = [];

    if (Array.isArray(apiMovie.actors)) {
        actors = apiMovie.actors.map(actor => {
            if (typeof actor === 'string') {
                return actor;
            } else if (actor && typeof actor === 'object' && 'name' in actor) {
                return actor.name;
            }
            return 'Unknown Actor';
        });
    }

    return {
        id: apiMovie.id.toString(),
        title: apiMovie.title,
        year: typeof apiMovie.year === 'string' ? parseInt(apiMovie.year, 10) : apiMovie.year,
        format: apiMovie.format as Movie['format'],
        actors: actors,
        createdAt: apiMovie.createdAt,
        updatedAt: apiMovie.updatedAt,
    };
};

export const convertMovieToApiFormat = (movie: Partial<MovieFormData>) => {
    if (!movie.title || !movie.year || !movie.format) {
        throw new Error('Missing required movie fields: title, year, format');
    }

    return {
        title: movie.title,
        year: movie.year,
        format: movie.format,
        actors: movie.actors || [],
    };
};