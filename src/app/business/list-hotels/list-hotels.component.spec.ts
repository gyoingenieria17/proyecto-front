import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHotelsComponent } from './list-hotels.component';

describe('ListHotelsComponent', () => {
  let component: ListHotelsComponent;
  let fixture: ComponentFixture<ListHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHotelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
