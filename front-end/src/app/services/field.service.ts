import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs";
import {FieldUser} from "../model/model.field-user";

@Injectable()
export class FieldService {
  constructor(public http: Http) { }

  getFieldList(id:number):Observable<any> {
    return this.http.get(AppComponent.API_URL+`/account/field/${id}`);
  }


  //Todo: change with question and answer

  createField(fieldUser:FieldUser){
    return this.http.post(AppComponent.API_URL+'/account/field/create',fieldUser).map(resp=>resp.json());
  }


}
