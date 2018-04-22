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

  /**
   * Gets all janitors and check if janitor is running on component intialization.
   */
  ngOnInit() {
    this.getJanitors();
    this.isJanitorRunning();
  }

  /**
   * Gets all janitors.
   */
  getJanitors() {
    this.janitors = [];
    this.janitorService.getJanitors().subscribe(janitors => {
      for (const janitor of janitors) {
        this.janitors.push(janitor);
      }
      this.loading = false;
    });
  }

  /**
   * Open janitor configuration modal.
   */
  createJanitor() {
    const janitorDialog = this.dialog.open(JanitorDialogComponent, {
      width: '40%'
    });

    janitorDialog.afterClosed().subscribe(result => {
      this.getJanitors();
      this.isJanitorRunning();
    });
  }

  /**
   * Destroys janitor instance by id.
   * @param {string} id - The janitor id.
   */
  destroyJanitor(id) {
    this.janitorService.destroyJanitor(id).subscribe(data => {
      this.getJanitors();
      this.isJanitorRunning();
      alert(data);
    });

  }

  /**
   * Checks state of the janitor.
   */
  isJanitorRunning() {
    this.janitorService.isJanitorRunning().subscribe(running => {
      this.janitorRunning = running;
    });
  }
}
