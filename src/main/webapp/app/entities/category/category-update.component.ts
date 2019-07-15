import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ICategory, Category } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';

@Component({
  selector: 'jhi-category-update',
  templateUrl: './category-update.component.html'
})
export class CategoryUpdateComponent implements OnInit {
  isSaving: boolean;
  creationDateDp: any;
  updateDateDp: any;

  editForm = this.fb.group({
    id: [],
    name: [],
    creationDate: [],
    updateDate: []
  });

  constructor(protected categoryService: CategoryService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ category }) => {
      this.updateForm(category);
    });
  }

  updateForm(category: ICategory) {
    this.editForm.patchValue({
      id: category.id,
      name: category.name,
      creationDate: category.creationDate,
      updateDate: category.updateDate
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const category = this.createFromForm();
    if (category.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryService.update(category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(category));
    }
  }

  private createFromForm(): ICategory {
    return {
      ...new Category(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      creationDate: this.editForm.get(['creationDate']).value,
      updateDate: this.editForm.get(['updateDate']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
