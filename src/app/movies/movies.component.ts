import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../core/services/movie.service';
import { Movie } from '../shared/models/movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  movies: Movie[];
  genreID: number;
  
  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      p => {
        this.genreID = +p.get('id');
        console.log(this.genreID);
        // make a call to movie service to get movie details
        this.movieService.getMoviesByGenre(this.genreID).subscribe((m) => {
          this.movies = m;
        });
    });
  }

}
