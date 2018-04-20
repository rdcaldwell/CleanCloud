import { Component, Inject, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import { MatDialog } from '@angular/material';
import { JanitorDialogComponent } from './janitordialog/janitordialog.component';
import { JanitorService } from '../services/janitor.service';

@Component({
  selector: 'app-janitor',
  templateUrl: './janitor.component.html',
  styleUrls: ['./janitor.component.css']
})
export class JanitorComponent implements OnInit {

  public janitors: Array<any> = [];
  public janitorRunning: boolean;
  public thresholdUnit = 'minutes';
  public loading = true;

  constructor(private janitorService: JanitorService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getJanitors();
    this.isJanitorRunning();
  }

  getJanitors() {
    this.janitors = [];
    this.janitorService.getJanitors().subscribe(janitors => {
      for (const janitor of janitors) {
        this.janitors.push(janitor);
      }
      this.loading = false;
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
      this.janitorService.destroyJanitor(janitor._id).subscribe(data => {
        this.getJanitors();
        this.isJanitorRunning();
        alert(data);
      });
    }
  }

  isJanitorRunning() {
    this.janitorService.isJanitorRunning().subscribe(running => {
      this.janitorRunning = running;
    });
  }
}
