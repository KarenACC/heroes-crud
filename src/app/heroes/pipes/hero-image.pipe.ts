import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform(value: Hero): string {
    if(!value.id && !value.alt_img){
      return 'assets/no-image.png';
    }

    if(value.alt_img) return value.alt_img;

    return `assets/heroes/${value.id}.jpg`
  }

}
