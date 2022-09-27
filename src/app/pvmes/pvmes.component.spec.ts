import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PvmesComponent } from './pvmes.component';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Pvmes } from '../models/pvmes.model';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('PvmesComponent', () => {
  let component: PvmesComponent;
  let fixture: ComponentFixture<PvmesComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      declarations: [ PvmesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PvmesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    expect(component).toBeTruthy();
  });

  it('should have a valid h1 title tag ', () => {
    expect(component.pageTitle).toBe('PVMES');
    const h1Title = de.nativeElement.querySelector('#PvmesTitle');
    expect(h1Title.textContent).toEqual('PVMES');
  });

  it('should be able to add a solar panel ', () => {
    expect(component.SolarPanels.length).toEqual(0);
    expect(component.OnAddPanel());
    expect(component.SolarPanels.length).toEqual(1);
  });

  //TODO: test the post query body
  /*it('should send a post query on save', () => {
    expect(component.OnSubmit());
  });*/

});