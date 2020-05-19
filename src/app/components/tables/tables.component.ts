import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  constructor(   private route: ActivatedRoute, private location: Location) { }

  fk: string;
  table: string;

  ngOnInit(): void {
    this.table = this.route.snapshot.paramMap.get('table');
    this.fk = this.route.snapshot.paramMap.get('fk');

    console.log(`onInit() table -> ${this.table} fk -> ${this.fk}`);
  }



}
