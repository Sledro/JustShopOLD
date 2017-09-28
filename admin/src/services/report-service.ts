import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { ItemService } from "./item-service";
import { RestaurantService } from "./restaurant-service";
import 'rxjs/add/operator/map';

@Injectable()
export class ReportService {
  private report: FirebaseObjectObservable<any>;
  private today = new Date();

  constructor(public db: AngularFireDatabase, public itemService: ItemService, public restaurantService: RestaurantService) {
    const restId = restaurantService.getId();
    this.report = db.object('/reports/' + restId);
  }

  getAll() {
    return this.report;
  }

  // calculate report for last {number} days
  getLastDays(reportObject, number) {
    let year, month, day;
    let currentDate = new Date();
    let i = 0;
    let reports = {};

    while (i < number) {
      year = currentDate.getFullYear();
      month = currentDate.getMonth() + 1;
      day = currentDate.getDate();

      if (reportObject.sale
        && reportObject.sale[year]
        && reportObject.sale[year][month]
        && reportObject.sale[year][month][day]
      ) {
        reports[year + '/' + month + '/' + day] = reportObject.sale[year][month][day].total;
      } else {
        reports[year + '/' + month + '/' + day] = 0;
      }
      currentDate.setDate(currentDate.getDate() - 1);
      i++;
    }

    return reports;
  }

  /**
   * generate report data by items
   * Report structure:
   * sale
   * --items
   * ----item_id
   * ------index => quantity
   */

  getByItems(reportObject, callback) {
    let subscription = this.itemService.getAllAsObject().subscribe(snapshot => {
      subscription.unsubscribe();

      let items = [];
      let itemTotal;

      if (!reportObject || !reportObject.sale) {
        return items;
      }

      // calculate by each item
      Object.keys(reportObject.sale.items).forEach((itemId) => {
        itemTotal = 0;

        // sum from child record
        Object.keys(reportObject.sale.items[itemId]).map(index => {
          itemTotal += reportObject.sale.items[itemId][index];
        });

        items.push({
          id: itemId,
          name: snapshot[itemId].name,
          total: itemTotal
        })
      });

      items.sort((a, b) => {
        if (a.total > b.total) return -1;
        if (a.total < b.total) return 1;
      });

      callback(items);
    });
  }

  // get report for this year
  getTotalThisYear(reportObject) {
    return (reportObject.sale && reportObject.sale[this.today.getFullYear()]) ? reportObject.sale[this.today.getFullYear()] : {total: 0};
  }

  // get report for this month
  getTotalThisMonth(reportObject) {
    let thisYear = this.getTotalThisYear(reportObject);

    return thisYear[this.today.getMonth() + 1] ? thisYear[this.today.getMonth() + 1] : {total: 0};
  }

  // get report for today
  getTotalToday(reportObject) {
    let thisMonth = this.getTotalThisMonth(reportObject);
    return thisMonth[this.today.getDate()] ? thisMonth[this.today.getDate()] : {total: 0};
  }
}
