import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
import { DetailComponent } from './components/detail/detail.component';


const routes: Routes = [
  {path : 'presupuestos', component: MasterComponent, data: {table: 'Presupuesto'}},
  {path : 'items', component: MasterComponent, data: {table: 'Item'}},
  // {path : 'item/:id', component: TreeComponent},
  {path : 'subitems', component: MasterComponent, data: {table: 'SubItem'}},
  // {path : 'subitem/:id', component: IssueListComponent, data: {table: 'subitems'}},
  {path : 'tree', component: DetailComponent, data: {}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
