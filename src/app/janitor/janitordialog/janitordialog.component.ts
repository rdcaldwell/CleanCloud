import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AmazonWebService } from '../../services/amazonweb.service';
import { JanitorComponent } from '../janitor.component';

@Component({
  selector: 'app-janitor-dialog',
  templateUrl: './janitordialog.component.html',
  styleUrls: ['./janitordialog.component.css']
})
export class JanitorDialogComponent {

  public regions: Array<RegionProperties> = [
    {
      name: 'us-west-2',
      location: 'Oregon'
    },
    {
      name: 'us-east-1',
      location: 'North Virgina'
    },
    {
      name: 'us-east-2',
      location: 'Ohio'
    },
    {
      name: 'ap-south-1',
      location: 'Mumbai'
    },
  ];

  janitorConfig: JanitorProperties = {
    region: '',
    defaultEmail: '',
    summaryEmail: '',
    sourceEmail: '',
    isMonkeyTime: true,
    port: 8080
  };

  constructor(public dialogRef: MatDialogRef<JanitorDialogComponent>,
    private amazonWebService: AmazonWebService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close() {
    this.dialogRef.close();
  }

  runJanitor() {
    this.amazonWebService.runJanitor(this.janitorConfig).subscribe(data => {
      this.dialogRef.close();
    });
  }
}

interface RegionProperties {
  name: string;
  location: string;
}

interface JanitorProperties {
  region: string;
  defaultEmail: string;
  summaryEmail: string;
  sourceEmail: string;
  isMonkeyTime: boolean;
  port: number;
}
