import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class GoogleSheetsService {
    constructor(
        private http: HttpClient
    ) {}

    getSheetsData(): Observable<any> {
        return this.http.get<any>
        ('https://spreadsheets.google.com/feeds/cells/1V_dQGGDXnfUnRkOv2GaRfDL7KluZKOZybS9wIWtiRQ8/od6/public/basic?alt=json');
    }
}
