import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BddAdminService } from '../../services/bdd-admin.service';
import { UserClientListviewComponent } from './listview/user-client-listview.component';
import { UserClientFormeditComponent } from './formedit/user-client-formedit.component';
import { UserClientFormnewComponent } from './formnew/user-client-formnew.component';

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
  selector: 'app-user-client-module',
  imports: [CommonModule, UserClientListviewComponent, UserClientFormeditComponent, UserClientFormnewComponent],
  templateUrl: './user-client.module.component.html',
  styleUrl: './user-client.module.component.css'
})
export class UserClientModuleComponent implements OnInit {
  protected readonly moduleKey = 'userClient';
  protected items: Item[] = [];
  protected selectedItem: Item | null = null;
  protected mode: 'list' | 'edit' | 'new' = 'list';
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
      "client",
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
    "key": "preferredWaterPoints",
    "label": "Preferred Water Points",
    "type": "array",
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
    private readonly bddService: BddAdminService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
    email: [''],
    role: [''],
    name: [''],
    preferredWaterPoints: [''],
    createdAt: [''],
    updatedAt: [''],
    lastConnectionDate: [''],
    });
    this.applyReadonlyState();
  }

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      const mode = this.route.snapshot.data['mode'] as 'list' | 'new' | 'edit' | undefined;
      this.mode = mode ?? 'list';
      const editId = this.route.snapshot.paramMap.get('id');
      this.errorMessage = '';
      this.successMessage = '';
      void this.loadItems(editId);
    });
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

  protected openEdit(item: Item): void {
    const itemId = this.getItemId(item);
    if (!itemId) {
      this.errorMessage = 'Impossible d ouvrir cet element';
      return;
    }
    void this.router.navigate(['/dashboard', this.moduleKey, 'edit', itemId]);
  }

  protected openNew(): void {
    void this.router.navigate(['/dashboard', this.moduleKey, 'new']);
  }

  protected goToList(): void {
    void this.router.navigate(['/dashboard', this.moduleKey, 'list']);
  }

  protected isListMode(): boolean {
    return this.mode === 'list';
  }

  protected isEditMode(): boolean {
    return this.mode === 'edit';
  }

  protected isNewMode(): boolean {
    return this.mode === 'new';
  }

  protected async save(): Promise<void> {
    if (!this.isEditMode() && !this.isNewMode()) {
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
      if (this.isNewMode()) {
        await this.bddService.createObject('userclients', payload);
        this.successMessage = 'Element cree';
      } else if (this.selectedItem) {
        const filter = { _id: this.selectedItem['_id'] };
        await this.bddService.updateObject('userclients', filter, payload);
        this.successMessage = 'Element mis a jour';
      }
      this.goToList();
    } catch {
      this.errorMessage = this.isNewMode() ? 'Echec de la creation' : 'Echec de la mise a jour';
    } finally {
      this.isSaving = false;
    }
  }

  private async loadItems(editId: string | null): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.items = await this.bddService.searchObjects('userclients');
      if (this.mode === 'new') {
        this.prepareNewForm();
        return;
      }

      if (this.mode === 'edit' && editId) {
        const item = this.items.find((candidate) => this.getItemId(candidate) === editId) ?? null;
        if (!item) {
          this.errorMessage = 'Element introuvable';
          this.goToList();
          return;
        }
        this.selectedItem = item;
        this.patchFormFromItem(item);
        return;
      }

      this.selectedItem = null;
      this.form.reset();
      this.applyReadonlyState();
    } catch {
      this.errorMessage = 'Impossible de charger les elements';
    } finally {
      this.isLoading = false;
    }
  }

  private patchFormFromItem(item: Item): void {
    const patch: Record<string, unknown> = {};
    for (const field of this.fields) {
      patch[field.key] = this.toFormValue(field, item[field.key]);
    }

    this.form.patchValue(patch);
    this.applyReadonlyState();
  }

  private prepareNewForm(): void {
    this.selectedItem = null;
    this.form.reset();
    this.applyReadonlyState();
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
