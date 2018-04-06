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

  public janitors: Array<any> = [];
  public janitorRunning: boolean;

  constructor(private amazonWebService: AmazonWebService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getJanitors();
    this.isJanitorRunning();
  }

  getJanitors() {
    this.janitors = [];
    this.amazonWebService.getJanitors().subscribe(janitors => {
      for (const janitor of janitors) {
        const janitorData = {
          id: janitor._id,
          defaultEmail: janitor.defaultEmail,
          summaryEmail: janitor.summaryEmail,
          sourceEmail: janitor.sourceEmail,
          isMonkeyTime: janitor.isMonkeyTime,
          port: janitor.port,
          checked: false
        };
        this.janitors.push(janitorData);
      }
    });
  }

  createJanitor() {
    const janitorDialog = this.dialog.open(JanitorDialogComponent, {
      width: '40%'
    });

    janitorDialog.afterClosed().subscribe(result => {
      this.getJanitors();
      this.isJanitorRunning();
    });
  }

  destroyJanitor() {
    for (const janitor of this.janitors) {
      if (janitor.checked) {
        this.amazonWebService.destroyJanitor(janitor.id).subscribe((data) => {
          this.getJanitors();
          this.isJanitorRunning();
        });
      }
    }
  }

  isJanitorRunning() {
    this.amazonWebService.isJanitorRunning().subscribe((running) => {
      this.janitorRunning = running;
    });
  }
}
