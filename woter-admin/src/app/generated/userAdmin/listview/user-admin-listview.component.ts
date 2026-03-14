import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-admin-listview',
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './user-admin-listview.component.html',
  styleUrl: './user-admin-listview.component.css'
})
export class UserAdminListviewComponent {
  @Input() title = '';
  @Input() items: Record<string, unknown>[] = [];
  @Input() isLoading = false;
  @Input() getItemName: (item: Record<string, unknown>) => string = () => '';
  @Input() getItemId: (item: Record<string, unknown>) => string = () => '';

  @Output() createNew = new EventEmitter<void>();
  @Output() editItem = new EventEmitter<Record<string, unknown>>();
}
