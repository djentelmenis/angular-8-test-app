import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';

import { Issue, Category } from '../models/issues';
import { findCategoryName } from '../utils/utils';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  categories: Array<Category>;
  issueForm: FormGroup;
  submitted = false;
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {
    this.issueForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', Validators.email],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.httpService
      .getCategories()
      .subscribe((categories: Array<Category>) => {
        this.categories = categories;
      });
  }

  getCategoryName(id: string) {
    return findCategoryName(this.categories, id);
  }

  onSubmit() {
    this.submitted = true;

    if (this.issueForm.invalid) {
      return;
    }

    this.success = true;

    const { title, description, email, categoryId } = this.issueForm.controls;
    const issue: Issue = {
      title: title.value,
      description: description.value,
      email: email.value,
      categoryId: categoryId.value,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.httpService.postIssue(issue).subscribe();
  }
}
