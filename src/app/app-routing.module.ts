import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full'
  },
  {
    path: 'sagas',
    loadChildren: () => import('./pages/sagas/list-sagas/list-sagas.module').then( m => m.ListSagasPageModule)
  },
  {
    path: 'sagas/:id',
    loadChildren: () => import('./pages/sagas/view-saga/view-saga.module').then( m => m.ViewSagaPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/list-news/list-news.module').then( m => m.ListNewsPageModule)
  },
  {
    path: 'news/:id',
    loadChildren: () => import('./pages/news/view-news/view-news.module').then( m => m.ViewNewsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'sync',
    loadChildren: () => import('./pages/admin/sync/sync.module').then( m => m.SyncPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
