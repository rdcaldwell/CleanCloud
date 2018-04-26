import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JanitorComponent } from '../janitor.component';
import { JanitorService } from '../../services/janitor.service';

@Component({
  selector: 'app-janitor-dialog',
  templateUrl: './janitordialog.component.html',
  styleUrls: ['./janitordialog.component.css']
})
export class JanitorDialogComponent {

  public frequencyUnits = ['MINUTES', 'HOURS'];
  public regions = ['us-east-1', 'ap-southeast-2'];
  public janitorConfig: JanitorProperties = {
    defaultEmail: '',
    summaryEmail: '',
    sourceEmail: '',
    isMonkeyTime: true,
    threshold: null,
    frequency: null,
    frequencyUnit: '',
    region: '',
  };

  constructor(public dialogRef: MatDialogRef<JanitorDialogComponent>,
    private janitorService: JanitorService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * Closes modal window.
   */
  close() {
    this.dialogRef.close();
  }
  /**
   * Runs the janitor instance.
   */
  runJanitor() {
    this.janitorService.runJanitor(this.janitorConfig).subscribe(data => {
      this.dialogRef.close();
    });
  }
}

export interface JanitorProperties {
  defaultEmail: string;
  summaryEmail: string;
  sourceEmail: string;
  isMonkeyTime: boolean;
  threshold: number;
  frequency: number;
  frequencyUnit: string;
  region: string;
}
