import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit{

  public hero?:Hero;

  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router){}


  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe((params)=> 
        this.heroesService.getHeroById(params['id'])
        .subscribe(hero=> {
            if(!hero) return this.router.navigate(['/heroes/list']);

            this.hero = hero;
            return;
            }
        )
    )
  }



}
