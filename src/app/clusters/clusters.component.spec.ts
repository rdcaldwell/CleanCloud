import { TestBed, ComponentFixture, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { ClustersComponent } from './clusters.component';
import { ClusterComponent } from './cluster/cluster.component';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('ClustersComponent', () => {
  let component: ClustersComponent;
  let fixture: ComponentFixture<ClustersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClustersComponent,
        ClusterComponent
      ],
      providers: [
        MockBackend,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get context names', fakeAsync(inject([XHRBackend], (mockBackend: MockBackend) => {
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

    component.getContextNames();

    expect(component.context).toEqual(mockResponse);
  })));
});
