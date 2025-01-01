import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { FpNavbarComponent } from '../fp-navbar/fp-navbar.component';
import { HttpClient } from '@angular/common/http';
import { ApexTitleSubtitle, ApexAxisChartSeries, ApexDataLabels, ApexTooltip, ApexStroke, ApexLegend, ApexChart, ApexXAxis, ApexYAxis, ApexGrid, ApexFill, NgApexchartsModule } from 'ng-apexcharts';
import { GroupService } from '../../../service/groups.service';

import { UserLoginDetail } from '../../../modals/modal';
type ChartOptions = {
    subtitle: ApexTitleSubtitle;
    series: ApexAxisChartSeries;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    labels: string[];
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string[];
    grid: ApexGrid;
    fill: ApexFill;
};
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
    selector: 'app-fp-cta',
    standalone: true,
    imports: [FpNavbarComponent, NgApexchartsModule],
    templateUrl: './fp-cta.component.html',
    styleUrl: './fp-cta.component.scss'
})
export class FpCtaComponent implements OnInit {

    // isToggled
    isToggled = false;
    groupDetail: GroupList[]
    constructor(
        public themeService: CustomizerSettingsService,
        private httpClient: HttpClient,
        private getGroupsService: GroupService
    ) {
        this.getGroupsService.getGroup().subscribe(
            (res) => {
                this.groupDetail = res
            }
        )
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.chartOptions = {
            series: [
                {
                    name: "Current Sale",
                    data: [35, 50, 55, 60, 50, 60, 55, 60, 78, 40, 95, 80]
                },
                {
                    name: "Last Year Sale",
                    data: [70, 50, 40, 40, 62, 52, 80, 40, 60, 53, 70, 70]
                }
            ],
            chart: {
                type: "area",
                height: 363,
                zoom: {
                    enabled: false
                }
            },
            colors: [
                "#605DFF", "#DDE4FF"
            ],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: [2, 2, 0],
                dashArray: [0, 6, 0]
            },
            grid: {
                show: false,
                borderColor: "#ECEEF2"
            },
            fill: {
                type: 'gradient',
                gradient: {
                    stops: [0, 90, 100],
                    shadeIntensity: 1,
                    opacityFrom: 0,
                    opacityTo: 0.5
                }
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
                axisTicks: {
                    show: false,
                    color: '#ECEEF2'
                },
                axisBorder: {
                    show: false,
                    color: '#ECEEF2'
                },
                labels: {
                    show: true,
                    style: {
                        colors: "#8695AA",
                        fontSize: "12px"
                    }
                }
            },
            yaxis: {
                tickAmount: 5,
                max: 100,
                min: 0,
                labels: {
                    formatter: (val) => {
                        return '$' + val + 'K'
                    },
                    style: {
                        colors: "#64748B",
                        fontSize: "12px"
                    }
                },
                axisBorder: {
                    show: false,
                    color: '#ECEEF2'
                },
                axisTicks: {
                    show: false,
                    color: '#ECEEF2'
                }
            },
            legend: {
                show: true,
                position: 'top',
                fontSize: '12px',
                horizontalAlign: 'left',
                itemMargin: {
                    horizontal: 8,
                    vertical: 0
                },
                labels: {
                    colors: '#64748B'
                },
                markers: {
                    width: 9,
                    height: 9,
                    offsetX: -2,
                    offsetY: -.5,
                    radius: 2
                }
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$" + val + "k";
                    }
                }
            }
        };


    }

    greeting: string = '';

    ngOnInit(): void {
        this.greeting = this.getGreeting();
        this.userLoggedInDetail()
    }
    details: UserLoginDetail | null | undefined = null;
    userLoggedInDetail() {
        const url = 'http://localhost:3000/me'
        this.httpClient.get<{user:UserLoginDetail}>(url).subscribe(
            (res) => {
                this.details = res.user
            }
        )
    }
    getGreeting(): string {
        const currentHour = new Date().getHours(); // Get current hour based on local timezone

        if (currentHour >= 5 && currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Night';
        }
    }
    isCardHeaderOpen = false;
    toggleCardHeaderMenu() {
        this.isCardHeaderOpen = !this.isCardHeaderOpen;
    }

    chartOptions: Partial<ChartOptions>;
}
