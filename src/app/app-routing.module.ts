import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
// import { DetailComponent } from './components/detail/detail.component';
import { TablesComponent } from './components/tables/tables.component';

const routes: Routes = [
  {path : 'master', component: MasterComponent, data: {table: 'Presupuesto'}},
  {path : ':table/:fk', component: TablesComponent},
  { path: '',   redirectTo: '/master', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
