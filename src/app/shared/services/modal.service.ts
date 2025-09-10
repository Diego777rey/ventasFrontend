import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalState {
  isOpen: boolean;
  modalId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalStates = new Map<string, BehaviorSubject<ModalState>>();

  constructor() { }

  /**
   * Abre un modal específico
   * @param modalId Identificador único del modal
   */
  openModal(modalId: string): void {
    this.getModalState(modalId).next({ isOpen: true, modalId });
  }

  /**
   * Cierra un modal específico
   * @param modalId Identificador único del modal
   */
  closeModal(modalId: string): void {
    this.getModalState(modalId).next({ isOpen: false, modalId });
  }

  /**
   * Toggle del estado de un modal
   * @param modalId Identificador único del modal
   */
  toggleModal(modalId: string): void {
    const currentState = this.getModalState(modalId).value;
    this.getModalState(modalId).next({ 
      isOpen: !currentState.isOpen, 
      modalId 
    });
  }

  /**
   * Obtiene el estado actual de un modal
   * @param modalId Identificador único del modal
   * @returns Observable del estado del modal
   */
  getModalState(modalId: string): BehaviorSubject<ModalState> {
    if (!this.modalStates.has(modalId)) {
      this.modalStates.set(modalId, new BehaviorSubject<ModalState>({ 
        isOpen: false, 
        modalId 
      }));
    }
    return this.modalStates.get(modalId)!;
  }

  /**
   * Obtiene un observable del estado de un modal
   * @param modalId Identificador único del modal
   * @returns Observable del estado del modal
   */
  getModalState$(modalId: string): Observable<ModalState> {
    return this.getModalState(modalId).asObservable();
  }

  /**
   * Verifica si un modal está abierto
   * @param modalId Identificador único del modal
   * @returns true si el modal está abierto
   */
  isModalOpen(modalId: string): boolean {
    return this.getModalState(modalId).value.isOpen;
  }

  /**
   * Cierra todos los modales
   */
  closeAllModals(): void {
    this.modalStates.forEach((state, modalId) => {
      state.next({ isOpen: false, modalId });
    });
  }

  /**
   * Limpia el estado de un modal específico
   * @param modalId Identificador único del modal
   */
  clearModalState(modalId: string): void {
    this.modalStates.delete(modalId);
  }

  /**
   * Limpia todos los estados de modales
   */
  clearAllModalStates(): void {
    this.modalStates.clear();
  }
}
