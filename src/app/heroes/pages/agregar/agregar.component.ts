import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from "rxjs/operators";

import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'CD Comics',
      desc: 'CD - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    }
  ];

  heroe: Heroe = {
    superhero : '',
    alter_ego : '',
    characters : '',
    first_appearance : '',
    publisher : Publisher.DCComics,
    alt_image: ''
  };

  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private _snackBar: MatSnackBar,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {

    if (!this.router.url.includes("editar")) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroePorId(id) )
      )
      .subscribe( heroe => this.heroe = heroe );

  }

  guardar() {
    if( this.heroe.superhero.trim().length == 0) {
      return;
    } 
    if (this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe( heroe => {
          this.mostrarSnakbar('Registro actualizado');
        });
    } else {
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe( heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.mostrarSnakbar('Registro creado');
        });
    }
  }

  borrarHeroe() {

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.borrarHeroe(this.heroe.id!)
          .subscribe( resp => {
            this.router.navigate(['/heroes'])
          });
      }
    });
  }

  mostrarSnakbar( mensaje: string ) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 2500
    });
  }

}
