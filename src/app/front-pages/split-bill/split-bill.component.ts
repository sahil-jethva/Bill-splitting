import { Component, OnInit } from '@angular/core';
import { FpNavbarComponent } from '../common/fp-navbar/fp-navbar.component';
import { GroupService } from '../../service/groups.service';
import { NgClass } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { FormsModule } from '@angular/forms';
interface GroupList {
    id: number;
    participants: string[];
    name: string;
    bgClass?: string;
    expenses?: Expense[];
}
interface Expense {
    expense?: number;
    contribution?: number[];
    participants?: string[];
    reason?: string;
}
@Component({
    selector: 'app-split-bill',
    standalone: true,
    imports: [FpNavbarComponent, FormsModule, NgClass],
    templateUrl: './split-bill.component.html',
    styleUrl: './split-bill.component.scss'
})
export class SplitBillComponent implements OnInit {

    groupDetail: GroupList[]
    openSection: string | null = null;
    toggleSection(groupId: number, expIndex: number): void {
        const key = `${groupId}-${expIndex}`;
        this.openSection = this.openSection === key ? null : key;
    }

    isSectionOpen(groupId: number, expIndex: number): boolean {
        const key = `${groupId}-${expIndex}`;
        return this.openSection === key;
    }
    isToggled = false;
    constructor(private groupService: GroupService, public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit() {
        this.groupService.getGroup().subscribe(
            (result: GroupList[]) => {
                if (result && result.length > 0) {
                    this.groupDetail = result;
                }
            }
        )
    }

    isOpenPayment = false;
    openCode() {
        this.isOpenPayment = !this.isOpenPayment;
    }

    codeArray: string[] = ['', '', '', ''];
    isPasswordVisible: boolean = true;
    onInput(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        if (value.length > 1) {
            input.value = value.slice(0, 1);
        }

        if (input.value && index < this.codeArray.length - 1) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    }

    onKeyDown(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;
        if (event.key === 'Backspace' && !input.value && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    }
}
