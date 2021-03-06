import { TelemetryModule } from '@sunbird/telemetry';
import { serverRes } from './desktop-app-update.component.spec.data';
import { of as observableOf, throwError } from 'rxjs';
import { AppUpdateService } from './../../services/app-update/app-update.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopAppUpdateComponent } from './desktop-app-update.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { CacheService } from 'ng2-cache-service';

describe('DesktopAppUpdateComponent', () => {
  let component: DesktopAppUpdateComponent;
  let fixture: ComponentFixture<DesktopAppUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopAppUpdateComponent ],
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule],
      providers: [ConfigService, ResourceService, CacheService, BrowserCacheTtlService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopAppUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should call checkForAppUpdate method', () => {
    spyOn(component, 'checkForAppUpdate');
    component.ngOnInit();
    expect(component.checkForAppUpdate).toHaveBeenCalled();
  });

  it ('should call app update service', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'checkForAppUpdate').and.returnValue(observableOf(serverRes.app_update));
    spyOn(component, 'setTelemetry');
    component.checkForAppUpdate();
    expect(component.appUpdateService.checkForAppUpdate).toHaveBeenCalled();
    expect(component.isUpdated).toBeTruthy();
    expect(component.downloadUrl).toBeDefined();
    expect(component.setTelemetry).toHaveBeenCalled();
  });

  it ('should call app update service', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'checkForAppUpdate').and.returnValue(observableOf(serverRes.app_not_update));
    component.checkForAppUpdate();
    expect(component.appUpdateService.checkForAppUpdate).toHaveBeenCalled();
    expect(component.isUpdated).toBeFalsy();
    expect(component.downloadUrl).toBeUndefined();
  });

  it('should throw error', () => {
    const appUpdateService = TestBed.get(AppUpdateService);
    spyOn(appUpdateService, 'checkForAppUpdate').and.returnValue(throwError(serverRes.error));
    component.checkForAppUpdate();
    expect(component.isUpdated).toBeFalsy();
  });


});
