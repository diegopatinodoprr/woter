import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array' | 'arrayOf' | 'object' | 'objectId';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  enumValues?: Array<string | number | boolean>;
  readonly?: boolean;
}

@Component({
  selector: 'app-user-admin-formedit',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './user-admin-formedit.component.html',
  styleUrl: './user-admin-formedit.component.css'
})
export class UserAdminFormeditComponent {
  @Input() title = '';
  @Input() form!: FormGroup;
  @Input() fields: FieldConfig[] = [];
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isSaving = false;

  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}
