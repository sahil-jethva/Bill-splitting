import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { GroupService } from '../../service/groups.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { GroupList } from '../../modals/modal';
import { Expense } from '../../modals/modal';
import { UserLoginDetail } from '../../modals/modal';
import { PerHead } from '../../modals/modal';

@Component({
    selector: 'app-show-group',
    standalone: true,
    imports: [FormsModule, NgClass,RouterLink, DecimalPipe, FormsModule, CurrencyPipe],
    templateUrl: './show-group.component.html',
    styleUrls: ['./show-group.component.scss'],
})
export class ShowGroupComponent implements OnInit {
    groups: number;
    expenses: number
    groupDetail: GroupList | null | undefined = null;
    contributions: number[] = [];
    percentages: number[] = [];
    changedIndex: number | null = null;
    reason: string = '';
    exp: Expense | null | undefined = null;
    userDetails: string
    isToggled = false;
    openSplitPopUp1 = false;
    paid: boolean = false;
    shares: number[]
    constructor(private route: ActivatedRoute,
        private groupService: GroupService,
        private httpClient: HttpClient,

        public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.route.params.subscribe((data: Params) => {
            this.groups = Number(data['id']);
        });
        const url = 'http://localhost:3000/me'
        this.httpClient.get<{ user: UserLoginDetail }>(url).subscribe(
            (response) => {
                this.userDetails = response.user.name
            })
    }

    openSplitPopUp() {
        this.openSplitPopUp1 = !this.openSplitPopUp1
    }
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
        this.onExpenseChange();
    }

    ngOnInit() {
        this.refreshGroups()
    }

    isOpenPayment = false;
    openCode() {
        this.openRequest = false
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


    payment() {
        const url = `http://localhost:3000/groups/${this.groups}`
        const perHead = this.exp?.perHead?.map((ph:PerHead) => ({
            name: ph.name,
            amount:ph.amount,
            isPaid:ph.name===this.userDetails?true:ph.isPaid
        }))
        const updatedExp = this.groupDetail?.expenses?.map((expe: Expense) => {
            if (this.exp?.reason === expe.reason) {
                return {
                    "reason": expe.reason,
                    "expense": expe.expense,
                    "perHead": perHead
                }
            }
            return expe
        })
        this.httpClient.patch(url, { expenses: updatedExp }).subscribe(
            (res) => {
                this.refreshGroups();
                this.isOpenPayment =false
            }
        )
    }

    openread(para: string) {
        this.openRequest = true
        this.groupDetail?.expenses?.forEach((ele) => {
            if (ele.reason === para) {
                this.exp = ele;
            }
        });
    }



    sendRequest() {
        const url = `http://localhost:3000/groups/${this.groups}`
        this.httpClient.get<GroupList>(url).subscribe(
            (res: GroupList) => {
                const perHeadArray = this.groupDetail?.participants.map((participant: string, index: number) => ({
                    name: participant,
                    amount: this.contributions[index],
                    isPaid: this.paid
                }));
                const reqbody = {
                    expense: this.expenses,
                    perHead: perHeadArray,
                    reason: this.reason
                }
                const exp = [...(res.expenses || []), reqbody]
                this.httpClient.patch(url, { expenses: exp }).subscribe(
                    (res) => {
                        this.openSplitPopUp()
                        this.refreshGroups()
                    }
                )
            }
        )
    }
    refreshGroups() {
        this.groupService.getGroup().subscribe((res: GroupList[]) => {
            const matchingGroup = res.find((group) => group.id === this.groups);
            if (matchingGroup) {
                this.groupDetail = matchingGroup
            }
        });
    }


    onExpenseChange() {
        switch (this.currentTab) {
            case 'tab1':
                this.contributions = []
                this.calculateEvenSplit();
                break;
            case 'tab2':
                this.contributions = []
                this.calculateByAmounts();
                break;
            case 'tab3':
                this.contributions = []
                this.shares = new Array(this.groupDetail?.participants.length).fill(1); // Default shares
                this.calculateByShares(this.shares)
                break;
            case 'tab4':
                this.contributions = []
                if (this.changedIndex !== null) {
                    this.calculateByPercentage(this.changedIndex); // Pass the tracked index
                }
                break;
            default:
                break;
        }
    }

    calculateEvenSplit() {
        const total = this.expenses || 0;
        const participantsCount = this.groupDetail?.participants.length || 0;

        if (participantsCount > 0) {
            const amountPerPerson = total / participantsCount;
            this.contributions = new Array(participantsCount).fill(amountPerPerson);
        }
    }

    calculateByAmounts() {
        const total = this.expenses || 0;
        const participants = this.groupDetail?.participants || [];
        const enteredAmounts = [...this.contributions];
        const sumEntered = enteredAmounts.reduce((a, b) => a + b, 0);
        if (sumEntered > total) {
            const scaleFactor = total / sumEntered;
            for (let i = 0; i < enteredAmounts.length; i++) {
                enteredAmounts[i] = enteredAmounts[i] * scaleFactor;
            }
        } else {
            const remainingAmount = total - sumEntered;
            const zeroContributionIndices = enteredAmounts
                .map((amount, index) => (amount === 0 ? index : -1))
                .filter(index => index !== -1);

            if (remainingAmount > 0 && zeroContributionIndices.length > 0) {
                const amountPerPerson = remainingAmount / zeroContributionIndices.length;

                for (const index of zeroContributionIndices) {
                    enteredAmounts[index] = amountPerPerson;
                }
            }
        }
        this.contributions = enteredAmounts;
    }



    calculateByShares(shares: number[]) {
        const total = this.expenses || 0;
        const totalShares = shares.reduce((a, b) => a + b, 0);
        if (totalShares > 0) {
            this.contributions = shares.map(share => (share / totalShares) * total);
        }
    }

    calculateByPercentage(changedIndex: number) {
        const total = this.expenses || 0;
        let totalEntered = 0;
        this.percentages.forEach((percentage, index) => {
            if (index !== changedIndex && percentage > 0) {
                totalEntered += percentage;
            }
        });
        if (this.percentages[changedIndex] > 100 - totalEntered) {
            this.percentages[changedIndex] = 100 - totalEntered;
        }
        const remainingPercentage = 100 - totalEntered - this.percentages[changedIndex];
        const remainingUsers = this.percentages.filter((_, index) => index !== changedIndex && !this.percentages[index]);
        if (remainingUsers.length > 0) {
            const share = remainingPercentage / remainingUsers.length;
            this.percentages.forEach((_, index) => {
                if (index !== changedIndex && !this.percentages[index]) {
                    this.percentages[index] = share;
                }
            });
        }
        this.updateContributions();
    }


    updateContributions() {
        const total = this.expenses || 0;
        this.percentages.forEach((percentage, index) => {
            if (percentage > 0) {
                this.contributions[index] = (percentage / 100) * total;
            } else {
                this.contributions[index] = 0;
            }
        });
    }
    isInputDisabled(index: number): boolean {
        const remainingUsers = this.percentages.filter(p => p === 0);
        return remainingUsers.length === 1 && this.percentages[index] === 0;
    }

    openRequest = false;
    openRequested() {
        this.openRequest = !this.openRequest
    }

    openSection: string | null = null;
    toggleSection(groupId: number, expIndex: number): void {
        const key = `${groupId}-${expIndex}`;
        this.openSection = this.openSection === key ? null : key;
    }

    isSectionOpen(groupId: number, expIndex: number): boolean {
        const key = `${groupId}-${expIndex}`;
        return this.openSection === key;
    }
}
