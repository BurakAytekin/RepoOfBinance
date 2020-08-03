import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoDashBoardComponent } from './pages/demo-dash-board/demo-dash-board.component';


const routes: Routes = [

  {
    path: 'demo-dash-board',
    component: DemoDashBoardComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
