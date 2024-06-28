import { Component, OnInit } from '@angular/core';

import { Hero, Publisher } from '../../interfaces/hero.interface';

import { FormControl, FormGroup } from '@angular/forms';

import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  public publishers = {
     DCComics: "DC Comics",
    MarvelComics: "Marvel Comics"
  }

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', {nonNullable:true}),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:         new FormControl('')
  })

  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbar:MatSnackBar,
    private dialog:MatDialog){}

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params.pipe(
      switchMap( ({id})=> this.heroesService.getHeroById(id))
    ).subscribe(hero=>{

      if(!hero) return this.router.navigateByUrl('/');
      this.heroForm.reset(hero);
      return;
    })

//     switchMap toma el valor emitido por el observable anterior (en este caso, los parámetros de la ruta) 
// y lo mapea a un nuevo observable (el observable devuelto por this.heroesService.getHeroById(id)).

// switchMap(({ id }) => this.heroesService.getHeroById(id)): 
// Aquí se está desestructurando el objeto de parámetros para extraer el id y luego se llama a getHeroById del servicio heroesService, 
// que devuelve un observable que emite el héroe correspondiente al id.
  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void{
    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe( hero=> {
        this.showSnackbar(`${hero.superhero} ha sido actualizado.`)
      });
      return;
    } else {
      this.heroesService.addHero(this.currentHero)
      .subscribe(hero=> {
        this.showSnackbar(`${hero.superhero} ha sido creado.`);
        this.router.navigateByUrl(`/heroes/edit/${hero.id}`)
      });
      return;
    }
  }

  onDeleteHero(){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(!result) return;
        console.log('heroe eliminado');
        

          this.heroesService.deleteHeroById(this.currentHero.id)
          .subscribe( wasDeleted => {
            if (wasDeleted) this.router.navigate(['/heroes']);
          })

      });
  }


  showSnackbar(message:string):void{
    this.snackbar.open(message, 'OK',{
      duration:2500
    })
  }

}
