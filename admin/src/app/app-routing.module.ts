import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { ExpandwidthComponent } from './layouts/expandwidth/expandwidth.component';
import { HomeComponent } from './modules/home/home.component';
import { CourseListComponent } from './modules/courses/course-list/course-list.component';
import { AuthGuard } from './auth/guard';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { UserListComponent } from './modules/users/user-list/user-list.component';

const routes: Routes = [
  {
  path:"",
  component: DefaultComponent,  canActivate: [AuthGuard],
  children:[{
    path:"",
    component:HomeComponent
    },
    {
      path:'courses',
      component:CourseListComponent
    },
    {
      path:'users',
      component:UserListComponent
    },
    {
      path:'profile',
      component:ProfileComponent
    }
  ]
   },
   {
    path:'',
    component:ExpandwidthComponent,
    children:[{
      path:'unauthorized',
      component:UnauthorizedComponent
    }]
  },
  {
    path:'',
    component:ExpandwidthComponent,
    children:[{
      path:'login',
      component:LoginComponent
    }]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
