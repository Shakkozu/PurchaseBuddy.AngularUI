import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  TemplateRef,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {

} from '@angular/core';


@Component({
  selector: 'app-generic-dialog',
  templateUrl: 'generic-dialog.component.html',
  styleUrls: ['generic-dialog.component.scss'],
})
export class GenericDialogComponent implements OnInit {
  title!: string;
  contentTemplate!: TemplateRef<any>;

  @ViewChild('contentContainer', { read: ViewContainerRef, static: true })
  contentContainer!: ViewContainerRef;

  constructor (
    public dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { component: any, title: string },
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.loadDynamicComponent();
  }

  ngOnDestroy() {
    this.contentContainer.clear();
  }

  loadDynamicComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.data.component
    );
    this.title = this.data.title;
    this.contentContainer.clear();
    const componentRef = this.contentContainer.createComponent(componentFactory);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveAndCloseDialog(): void {
    this.dialogRef.close();
  }
}



