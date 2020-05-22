import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../shared/crud.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  constructor(  private crudService: CrudService,
                private route: ActivatedRoute,
                private location: Location) { }

  fk: string;
  table: string;
  data: object;
  result = [];
  subres = [];
  p = 1;
  cabecera = [];

  flag = true; // flag para cabecera

  ngOnInit(): void {
    this.table = this.route.snapshot.paramMap.get('table');
    this.fk = this.route.snapshot.paramMap.get('fk');

    this.load();

    console.log(`onInit() table -> ${this.table} fk -> ${this.fk}`);
  }

  load(): void {
    // console.log(`load() Master : table ${this.table} fk : ${this.fk}`);


      this.crudService.GetData(this.table, this.fk)
      .subscribe(data => {

        data.forEach((f) => {
          const subresult = [];
          for (const [key, value] of Object.entries(f)) {
            if (this.flag) {this.cabecera.push(key);}
            subresult.push(value);
        }
          this.result.push(subresult);
          this.flag = false;
    });
        console.log(this.result);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
