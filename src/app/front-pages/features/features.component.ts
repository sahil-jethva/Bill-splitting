import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../service/groups.service';
import { FpNavbarComponent } from "../common/fp-navbar/fp-navbar.component";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MultiSelectDropdownComponent } from '../../shared/multi-select-dropdown/multi-select-dropdown.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GroupList } from '../../modals/modal';
import { User } from '../../modals/modal';
import { UserLoginDetail } from '../../modals/modal';
@Component({
    selector: 'app-features',
    standalone: true,
    imports: [FpNavbarComponent, FormsModule, RouterLink, NgClass, MultiSelectDropdownComponent],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
})
export class FeaturesComponent implements OnInit {
    groups: GroupList[] = []
    users: User[] = []
    groupName: string = ''
    dropdownOptions: { label: string, value: number }[] = [];
    selectedParticipants: string[] = []
    isToggled = false;
    selectedGroupId: number | null = null;
    userDetails: string
    backgroundClasses: string[] = [
        'bg-purple-100',
        'bg-secondary-100',
        'bg-success-100',
        'bg-orange-100',
        'bg-primary-100',
        'bg-danger-100'
    ];
    constructor(private groupListService: GroupService, private httpClient: HttpClient, public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.groupListService.getUsers().subscribe(
            (result: User[]) => {
                this.users = result
                this.dropdownOptions = result.map((user: User) => ({
                    label: user.name,
                    value: user.id
                }))
            }
        )

    }

    onSelectionChange(selected: Number) {
        const selectedArray = Array.isArray(selected) ? selected : [selected];
        this.selectedParticipants = this.dropdownOptions
            .filter(user => selectedArray.includes(user.value))
            .map(user => user.label);
    }
    selectedDropdownValues: (number | undefined)[];
    updateSelectedDropdownValues() {
        this.selectedDropdownValues = this.selectedParticipants
            .map(name => this.dropdownOptions.find(option => option.label === name)?.value)
            .filter(value => value !== undefined);
    }

    ngOnInit() {
        const url = 'http://localhost:3000/me'
        this.httpClient.get<{ user: UserLoginDetail }>(url).subscribe(
            (response) => {
                this.userDetails = response.user.name
                this.selectedParticipants = [this.userDetails];
                console.log(this.selectedParticipants);

                this.groupListService.getGroup().subscribe(
                    (res) => {
                        res.forEach((grp) => {
                            const found = grp.participants.find(user => user === this.userDetails)
                            if (found) {
                                this.groups.push(grp)
                            }
                        })
                        if (response.user.role === 'admin') {
                            this.groups = res
                        }
                    }
                )
            })
        this.groupListService.getUsers().subscribe((result: User[]) => {
            this.users = result;
            this.dropdownOptions = result.map((user: User) => ({
                label: user.name,
                value: user.id
            }));
            this.updateSelectedDropdownValues();
        })
    }
    addGroup() {
        const url = 'http://localhost:3000/groups'
        const randomBgClass = this.backgroundClasses[Math.floor(Math.random() * this.backgroundClasses.length)];
        const requestbody = {
            name: this.groupName,
            participants: Array.from(new Set([...this.selectedParticipants, this.userDetails])),
            bgClass: randomBgClass,
            expenses: []
        }
        if (!requestbody.name || !requestbody.participants) {
            return;
        }
        this.httpClient.post(url, requestbody).subscribe(
            () => {
                this.groupName = ''
                this.selectedParticipants = []
                this.openDialog()
                this.refreshGroups()
            }
        )
    }
    deleteGroup() {
        if (this.selectedGroupId === null) {
            console.error("No group selected for deletion.");
            return;
        }
        const url = `http://localhost:3000/groups/${this.selectedGroupId}`;
        this.httpClient.delete(url).subscribe(
            () => {
                ;
                this.confirmationToast();
                this.openConfirmation();
                this.refreshGroups();
            },
            (error) => {
                console.error("Error deleting group:", error);
            }
        );
    }
    gi(para: string) {
        const img = `https://avatar.iran.liara.run/public/boy?username=${para}`
        return img
    }
    refreshGroups() {
        this.groups = []
        this.groupListService.getGroup().subscribe(
            (res) => {
                res.forEach((grp) => {
                    const found = grp.participants.find(user => user === this.userDetails)
                    if (found) {
                        this.groups.push(grp)
                    }
                })
            }
        );
    }
    openDialog1 = false;
    openDialog() {
        this.openDialog1 = !this.openDialog1;
    }
    confirmationToast1 = false;
    confirmationToast() {
        this.confirmationToast1 = !this.confirmationToast1;
    }
    openConfirmation1 = false;
    openConfirmation(id: number | null = null) {
        this.selectedGroupId = id;
        this.openConfirmation1 = !this.openConfirmation1;
    }
}
