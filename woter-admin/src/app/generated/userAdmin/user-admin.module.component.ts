import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BddAdminService } from '../../services/bdd-admin.service';

type Item = Record<string, unknown>;

type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array' | 'arrayOf' | 'object' | 'objectId';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  enumValues?: Array<string | number | boolean>;
  readonly?: boolean;
}

@Component({
  selector: 'app-user-admin-module',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './user-admin.module.component.html',
  styleUrl: './user-admin.module.component.css'
})
export class UserAdminModuleComponent implements OnInit {
  protected items: Item[] = [];
  protected selectedItem: Item | null = null;
  protected isCreating = false;
  protected isLoading = false;
  protected isSaving = false;
  protected errorMessage = '';
  protected successMessage = '';

  protected readonly fields: FieldConfig[] = [
  {
    "key": "email",
    "label": "Email",
    "type": "string",
    "enumValues": [],
    "readonly": false
  },
  {
    "key": "role",
    "label": "Role",
    "type": "enum",
    "enumValues": [
      "admin"
    ],
    "readonly": false
  },
  {
    "key": "name",
    "label": "Name",
    "type": "string",
    "enumValues": [],
    "readonly": false
  },
  {
    "key": "createdAt",
    "label": "Created At",
    "type": "date",
    "enumValues": [],
    "readonly": true
  },
  {
    "key": "updatedAt",
    "label": "Updated At",
    "type": "date",
    "enumValues": [],
    "readonly": true
  },
  {
    "key": "lastConnectionDate",
    "label": "Last Connection Date",
    "type": "date",
    "enumValues": [],
    "readonly": false
  }
];
  private readonly readonlyKeys = new Set(['createdAt', 'updatedAt']);

  protected readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly bddService: BddAdminService
  ) {
    this.form = this.fb.group({
    email: [''],
    role: [''],
    name: [''],
    createdAt: [''],
    updatedAt: [''],
    lastConnectionDate: [''],
    });
    this.applyReadonlyState();
  }

  ngOnInit(): void {
    void this.loadItems();
  }

  protected getItemName(item: Item): string {
    const value = item['name'];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    return 'Sans nom';
  }

  protected getItemId(item: Item): string {
    const value = item['_id'];
    if (typeof value === 'string') {
      return value;
    }

    if (value && typeof value === 'object' && '$oid' in value) {
      const oid = (value as { $oid?: unknown }).$oid;
      return typeof oid === 'string' ? oid : '';
    }

    return '';
  }

  protected selectItem(item: Item): void {
    this.isCreating = false;
    this.selectedItem = item;
    this.errorMessage = '';
    this.successMessage = '';

    const patch: Record<string, unknown> = {};
    for (const field of this.fields) {
      patch[field.key] = this.toFormValue(field, item[field.key]);
    }

    this.form.patchValue(patch);
    this.applyReadonlyState();
  }

  protected createNew(): void {
    this.isCreating = true;
    this.selectedItem = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset();
    this.applyReadonlyState();
  }

  protected async save(): Promise<void> {
    if (!this.selectedItem && !this.isCreating) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const raw = this.form.getRawValue() as Record<string, unknown>;
    const payload: Record<string, unknown> = {};

    try {
      for (const field of this.fields) {
        if (this.readonlyKeys.has(field.key)) {
          continue;
        }
        payload[field.key] = this.toDbValue(field, raw[field.key]);
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Formulaire invalide';
      return;
    }

    this.isSaving = true;

    try {
      if (this.isCreating) {
        await this.bddService.createObject('useradmins', payload);
        this.successMessage = 'Element cree';
        this.isCreating = false;
      } else if (this.selectedItem) {
        const filter = { _id: this.selectedItem['_id'] };
        await this.bddService.updateObject('useradmins', filter, payload);
        this.successMessage = 'Element mis a jour';
      }
      await this.loadItems();
    } catch {
      this.errorMessage = this.isCreating ? 'Echec de la creation' : 'Echec de la mise a jour';
    } finally {
      this.isSaving = false;
    }
  }

  private async loadItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.items = await this.bddService.searchObjects('useradmins');
    } catch {
      this.errorMessage = 'Impossible de charger les elements';
    } finally {
      this.isLoading = false;
    }
  }

  private applyReadonlyState(): void {
    for (const field of this.fields) {
      const control = this.form.get(field.key);
      if (!control) {
        continue;
      }

      if (this.readonlyKeys.has(field.key)) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
    }
  }

  private toFormValue(field: FieldConfig, value: unknown): unknown {
    if (value === undefined || value === null) {
      if (field.type === 'boolean') return false;
      if (field.type === 'number') return 0;
      return '';
    }

    if (field.type === 'date') {
      const asString = String(value);
      const date = new Date(asString);
      if (Number.isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().slice(0, 16);
    }

    if (field.type === 'object' || field.type === 'array' || field.type === 'arrayOf') {
      return JSON.stringify(value, null, 2);
    }

    if (field.type === 'boolean') {
      return Boolean(value);
    }

    if (field.type === 'number') {
      return Number(value);
    }

    return String(value);
  }

  private toDbValue(field: FieldConfig, value: unknown): unknown {
    if (field.type === 'number') {
      return Number(value ?? 0);
    }

    if (field.type === 'boolean') {
      return Boolean(value);
    }

    if (field.type === 'date') {
      if (!value) {
        return null;
      }
      const parsed = new Date(String(value));
      if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Date invalide pour ${field.label}`);
      }
      return parsed.toISOString();
    }

    if (field.type === 'object' || field.type === 'array' || field.type === 'arrayOf') {
      if (!value || String(value).trim() === '') {
        return field.type === 'object' ? {} : [];
      }
      try {
        return JSON.parse(String(value));
      } catch {
        throw new Error(`JSON invalide pour ${field.label}`);
      }
    }

    return value;
  }
}
