import { Routes } from '@angular/router';
import { AuthGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full'
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
    path: 'sagas',
    loadChildren: () => import('./pages/sagas/list-sagas/list-sagas.module').then(m => m.ListSagasPageModule)
  },
  {
    path: 'sagas/:id',
    loadChildren: () => import('./pages/sagas/view-saga/view-saga.module').then(m => m.ViewSagaPageModule)
  },
  {
    path: 'sagas/:id/edit',
    loadChildren: () => import('./pages/sagas/edit-saga/edit-saga.module').then( m => m.EditSagaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sagas/:sagaId/seasons/:seasonId',
    loadChildren: () => import('./pages/episodes/list-episodes/list-episodes.module').then( m => m.ListEpisodesPageModule)
  },
  {
    path: 'sagas/:sagaId/seasons/:seasonId/edit',
    loadChildren: () => import('./pages/sagas/edit-season/edit-season.module').then( m => m.EditSeasonPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sagas/:saga/episode/:episode',
    loadChildren: () => import('./pages/episodes/play-episode/play-episode.module').then( m => m.PlayEpisodePageModule)
  },
  {
    path: 'sagas/:saga/episode/:episode/edit',
    loadChildren: () => import('./pages/episodes/edit-episode/edit-episode.module').then( m => m.EditEpisodePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'admin/sync',
    loadChildren: () => import('./pages/admin/sync/sync.module').then(m => m.SyncPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin/users/list-users/list-users.page').then( m => m.ListUsersPage),
    canActivate: [AuthGuard]
  },


];