import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { VotesComponent } from './components/votes/votes.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'vote', component: VotesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
