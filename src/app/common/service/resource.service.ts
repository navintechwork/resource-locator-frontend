import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public getResourceData = new BehaviorSubject<any>(null);

  constructor() { }
}
