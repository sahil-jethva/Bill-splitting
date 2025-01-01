import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-multi-select-dropdown',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './multi-select-dropdown.component.html',
    styleUrl: './multi-select-dropdown.component.scss'
})
export class MultiSelectDropdownComponent  {
    @Input() options: { label: string, value: number }[] = [];
    @Input() controlName: string = '';
    @Input() selectedValues: any[] = [];
    @Input() placeholder: string = 'Select options';
    @Output() selectionChange = new EventEmitter<any>();
    isOpen = false;
    get selectedText(): string {
        if (this.selectedValues.length === 0) {
            return '';
        }
        const selectedLabels = this.options
            .filter(option => this.selectedValues.includes(option.value))
            .map(option => option.label);
        if (selectedLabels.length > 2) {
            return `${selectedLabels.slice(0,2).join(',')} (+${selectedLabels.length -2} other)`
        }
        return selectedLabels.join(', ');
    }
    toggleDropdown() {
        this.isOpen = !this.isOpen;
    }

    isSelected(value: any): boolean {
        return this.selectedValues.includes(value);
    }
    selectAll() {
        this.selectedValues = this.options.map(option => option.value);
        this.selectionChange.emit(this.selectedValues);
    }

    deselectAll() {
        this.selectedValues = [];
        this.selectionChange.emit(this.selectedValues);
    }
    toggleSelectAll(event: any) {
        if (event.target.checked) {
            this.selectAll();
        } else {
            this.deselectAll();
        }
    }

    isAllSelected(): boolean {
        return this.selectedValues.length === this.options.length;
    }
    toggleSelection(value: any) {
        if (this.isSelected(value)) {
            this.selectedValues = this.selectedValues.filter(item => item !== value);
        } else {
            this.selectedValues.push(value);
        }
        this.selectionChange.emit(this.selectedValues);
    }

}
