import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReportService } from "../../services/report-service";


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  // daily report
  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    title: {
      display: true,
      text: 'Daily sale'
    }
  };
  public barChartLabels: string[] = ['Daily sale'];
  public barChartType: string = 'line';
  public barChartLegend: boolean = false;
  public barChartData: any[] = [
    {data: []}
  ];

  // report by items
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'pie';
  public pieChartOptions: any = {
    title: {
      display: true,
      text: 'Popular items'
    }
  }

  // other reports
  public today: number;
  public thisMonth: number;
  public thisYear: number;
  public pending: number = 0;
  public serving: number = 0;
  public complete: number = 0;
  public cancelled: number = 0;
  public avg: number;
  public total: number;

  constructor(public nav: NavController, public reportService: ReportService) {
    // get report from firebase
    reportService.getAll().subscribe(snapshot => {
      let byDate = reportService.getLastDays(snapshot, 7);

      this.barChartLabels = Object.keys(byDate).reverse();
      this.barChartData[0] = {data: Object.keys(byDate).map(val => byDate[val]).reverse()};

      // most sale items
      reportService.getByItems(snapshot, itemReports => {
        let pieData = [];
        let pieLabel = [];
        let maxItemShow = 3; // show top 3 items, other item will be sum as other
        let other = 0;
        let count = 0;

        // add first {maxItemShow} items to the pie chart
        itemReports.forEach(itemReport => {
          if (count < maxItemShow) {
            pieLabel.push(itemReport.name);
            pieData.push(itemReport.total);
          } else {
            other += itemReport.total;
          }
          count++;
        });

        // add sum of other items to chart
        pieLabel.push('Other');
        pieData.push(other);
        this.pieChartLabels = pieLabel;
        this.pieChartData = pieData;
      });

      this.today = reportService.getTotalToday(snapshot).total;
      this.thisMonth = reportService.getTotalThisMonth(snapshot).total;
      this.thisYear = reportService.getTotalThisYear(snapshot).total;

      // check if report is not empty
      if (snapshot && snapshot.order) {
        this.pending = snapshot.order.pending ? snapshot.order.pending : 0;
        this.serving = snapshot.order.serving ? snapshot.order.serving : 0;
        this.complete = snapshot.order.complete ? snapshot.order.complete : 0;
        this.cancelled = snapshot.order.cancelled ? snapshot.order.cancelled : 0;
      }

      this.total = (snapshot && snapshot.sale && snapshot.sale.total) ? snapshot.sale.total : 0;
      this.avg = Math.round(this.total / this.complete);
    });
  }
}
