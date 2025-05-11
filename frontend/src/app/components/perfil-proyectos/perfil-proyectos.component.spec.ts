import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProyectosComponent } from './perfil-proyectos.component';

describe('PerfilProyectosComponent', () => {
  let component: PerfilProyectosComponent;
  let fixture: ComponentFixture<PerfilProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilProyectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
