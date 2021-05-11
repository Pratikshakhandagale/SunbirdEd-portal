import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageService } from '../../services/manage/manage.service';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { UserManageService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() close = new EventEmitter<any>();
  @Input() formFieldData: any;
  submitted = false;
  userDetailForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private manageService: ManageService,
    private toasterService: ToasterService,
    private resourceService: ResourceService,
    private userManageService: UserManageService
  ) {
    this.userDetailForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
        });

  }

  ngOnInit() {
    console.log(this.formFieldData);
    this.userDetailForm = this.formBuilder.group({
      firstName: [this.formFieldData.name, Validators.required],
      lastName: [this.formFieldData.username, Validators.required],
      email: [this.formFieldData.email, [Validators.required, Validators.email]],
      password: [this.formFieldData.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.formFieldData.confirmPassword, Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userDetailForm.invalid) {
      return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userDetailForm.value, null, 4));
  }

  closeModal() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

  ngOnDestroy() {
    this.modal.deny();
  }

  SaveUserData() {

   
    const requestBody = {
      request: {
        event: this.userDetailForm.value
      }
    };

    const option = {
       url: '',
      data: requestBody,
      header: { 'Content-Type' : 'application/json'}
    };

    this.userManageService.save(option).subscribe((res)=>{
      this.toasterService.success(this.resourceService.messages.smsg.m0049);

    })
  
    console.log('this.userDetailForm = ' +  this.userDetailForm.value);
    this.toasterService.success(this.resourceService.messages.smsg.m0049);

  }

}
