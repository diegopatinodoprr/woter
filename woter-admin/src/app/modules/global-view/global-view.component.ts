import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import type { IBddPrevieCollectionInfo } from '@diegopatinodoprr/woter-library';
import { GENERATED_MODULES } from '../../generated/registry';
import { BddAdminService } from '../../services/bdd-admin.service';

@Component({
  selector: 'app-global-view',
  imports: [CommonModule],
  templateUrl: './global-view.component.html',
  styleUrl: './global-view.component.css'
})
export class GlobalViewComponent implements OnInit {
  protected infos: IBddPrevieCollectionInfo[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  constructor(private readonly bddService: BddAdminService) {}

  ngOnInit(): void {
    void this.loadPreview();
  }

  private async loadPreview(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const schemaNames = GENERATED_MODULES.map((module) => module.label);
      const response = await this.bddService.previe(schemaNames);
      this.infos = response.collections;
    } catch {
      this.errorMessage = 'Impossible de charger les statistiques';
    } finally {
      this.isLoading = false;
    }
  }
}
