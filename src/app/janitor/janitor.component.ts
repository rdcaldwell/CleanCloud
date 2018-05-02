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

  public janitor: any = {};
  public janitorRunning: boolean;
  public thresholdUnit = 'minutes';
  public loading = true;

  constructor(private janitorService: JanitorService,
    public dialog: MatDialog) { }

  /**
   * Gets all janitors and check if janitor is running on component intialization.
   */
  ngOnInit() {
    this.isJanitorRunning();
    this.getJanitor();
  }

  /**
   * Gets all janitors.
   */
  getJanitor() {
    this.janitorService.getJanitor().subscribe(janitor => {
      if (janitor !== 'Janitor is not running') {
        this.janitor = janitor;
      }
      console.log(`janitor: ${janitor}`);
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
      this.isJanitorRunning();
      this.getJanitor();
    });
  }

  /**
   * Destroys janitor instance by id.
   * @param {string} id - The janitor id.
   */
  destroyJanitor() {
    this.janitorService.destroyJanitor().subscribe(data => {
      this.isJanitorRunning();
      this.getJanitor();
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
