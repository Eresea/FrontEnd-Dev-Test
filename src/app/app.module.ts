import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbDateAdapter,
  NgbDateNativeUTCAdapter,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { PvmesComponent } from './pvmes/pvmes.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'pvmes', component: PvmesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    PvmesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: NgbDateAdapter,
      useClass: NgbDateNativeUTCAdapter,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
