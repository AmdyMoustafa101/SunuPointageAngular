import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  template: `
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmation</h5>
            <button type="button" class="close" aria-label="Close" (click)="close()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir archiver cette cohorte ?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">Annuler</button>
            <button type="button" class="btn btn-danger" (click)="confirm()">Archiver</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal { display: block; }
  `]
})
export class ConfirmationModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    this.close();
  }

  close() {
    this.closed.emit();
  }
}