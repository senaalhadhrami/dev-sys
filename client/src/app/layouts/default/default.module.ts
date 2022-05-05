import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatConfirmDialogComponent } from 'src/app/modules/mat-confirm-dialog/mat-confirm-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { CourseListComponent } from 'src/app/modules/courses/course-list/course-list.component';
import { UpdateCourseComponent } from 'src/app/modules/courses/update-course/update-course.component';
import { CourseDetailsComponent } from 'src/app/modules/courses/course-details/course-details.component';
import { CreateCourseComponent } from 'src/app/modules/courses/create-course/create-course.component';
import { ExamListComponent } from 'src/app/modules/exams/exam-list/exam-list.component';
import { CreateExamComponent } from 'src/app/modules/exams/create-exam/create-exam.component';
import { UpdateExamComponent } from 'src/app/modules/exams/update-exam/update-exam.component';
import { MyCourseListComponent } from 'src/app/modules/courses/my-course-list/my-course-list.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';



@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    ProfileComponent,
    CourseListComponent,
    MyCourseListComponent,
    CreateCourseComponent,
    UpdateCourseComponent,
    CourseDetailsComponent,
    ExamListComponent,
    CreateExamComponent,
    UpdateExamComponent,
    ExamListComponent,
    MatConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ]
})
export class DefaultModule { }
