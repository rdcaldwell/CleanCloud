import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-janitor',
  templateUrl: './janitor.component.html',
  styleUrls: ['./janitor.component.css']
})
export class JanitorComponent implements OnInit {

  janitorConfig: JanitorProperties = {
    region: '',
    defaultEmail: '',
    summaryEmail: '',
    sourceEmail: '',
    isMonkeyTime: true,
    port: 8080
  };

  public ports: Array<number> = [];

  public janitors: Array<any> = [];

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

  constructor(private amazonWebService: AmazonWebService) { }

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

  runJanitor() {
    this.amazonWebService.runJanitor(this.janitorConfig).subscribe(data => {
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
