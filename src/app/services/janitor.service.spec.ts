import { FormsModule } from '@angular/forms';
import { TestBed, async, inject, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { JanitorService } from './janitor.service';

describe('JanitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        JanitorService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
    });
  });

  it('should be created', inject([JanitorService], (service: JanitorService) => {
    expect(service).toBeTruthy();
  }));

  it('should get all janitors', inject([JanitorService, XHRBackend], (janitorService: JanitorService, mockBackend: MockBackend) => {
    const mockResponse = [
      {
        '_id': '5aa59136ae0df1dbc214c7bd',
        'region': 'us-west-2',
        'defaultEmail': 'cloudianapp@gmail.com',
        'summaryEmail': 'cloudianapp@gmail.com',
        'sourceEmail': 'rdcaldwell5705@eagle.fgcu.edu',
        'isMonkeyTime': true,
        'port': 3333,
        '__v': 0
      },
      {
        '_id': '5aa591a8ae0df1dbc214c7be',
        'region': 'us-east-1',
        'defaultEmail': 'cloudianapp@gmail.com',
        'summaryEmail': 'cloudianapp@gmail.com',
        'sourceEmail': 'rdcaldwell5705@eagle.fgcu.edu',
        'isMonkeyTime': true,
        'port': 4444,
        '__v': 0
      }
    ];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    janitorService.getJanitors().subscribe(janitors => {
      expect(janitors.length).toBe(2);
      expect(janitors[0].region).toEqual('us-west-2');
      expect(janitors[0].port).toBe(3333);
      expect(janitors[1].region).toEqual('us-east-1');
      expect(janitors[1].port).toBe(4444);
    });
  }));

});