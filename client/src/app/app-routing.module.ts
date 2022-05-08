import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { ExpandwidthComponent } from './layouts/expandwidth/expandwidth.component';
import { HomeComponent } from './modules/home/home.component';
import { CourseListComponent } from './modules/courses/course-list/course-list.component';
import { ExamListComponent } from './modules/exams/exam-list/exam-list.component';
import { AuthGuard } from './auth/guard';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { CreateCourseComponent } from './modules/courses/create-course/create-course.component';
import { CreateExamComponent } from './modules/exams/create-exam/create-exam.component';
import { MyCourseListComponent } from './modules/courses/my-course-list/my-course-list.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { ProfileComponent } from './modules/profile/profile.component';

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
      path:'mycourses',
      component:MyCourseListComponent
    },
    {
      path:'course/new',
      component:CreateCourseComponent
    },
    {
      path:'exams',
      component:ExamListComponent
    },
    {
      path:'exam/new',
      component:CreateExamComponent
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
  },
  {
    path:'',
    component:ExpandwidthComponent,
    children:[{
      path:'signup',
      component:SignupComponent
    }]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
