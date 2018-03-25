import { Component, Inject, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import { MatDialog } from '@angular/material';
import { JanitorDialogComponent } from './janitordialog/janitordialog.component';

@Component({
  selector: 'app-janitor',
  templateUrl: './janitor.component.html',
  styleUrls: ['./janitor.component.css']
})
export class JanitorComponent implements OnInit {

  public ports: Array<number> = [];

  public janitors: Array<any> = [];

  constructor(private amazonWebService: AmazonWebService,
     public dialog: MatDialog) { }

  ngOnInit() {
    this.getJanitors();
  }

  getJanitors() {
    this.janitors = [];
    this.amazonWebService.getJanitors().subscribe(janitors => {
      for (const janitor of janitors) {
        const janitorData = {
          id: janitor._id,
          region: janitor.region,
          defaultEmail: janitor.defaultEmail,
          summaryEmail: janitor.summaryEmail,
          sourceEmail: janitor.sourceEmail,
          isMonkeyTime: janitor.isMonkeyTime,
          port: janitor.port,
          checked: false
        };
        this.janitors.push(janitorData);
        this.ports.push(janitorData.port);
      }
    });
  }

  createJanitor() {
    const janitorDialog = this.dialog.open(JanitorDialogComponent, {
      width: '40%'
    });

    janitorDialog.afterClosed().subscribe(result => {
      this.getJanitors();
    });
  }

  destroyJanitor() {
    for (const janitor of this.janitors) {
      if (janitor.checked) {
        this.amazonWebService.destroyJanitor(janitor.id).subscribe((data) => {
          this.getJanitors();
        });
      }
    }
  }

  isPortUsed(port) {
    return this.ports.includes(port);
  }
}
