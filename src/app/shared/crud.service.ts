import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// import { Tabla } from '../tabla';

/*
export interface Hijo {
  nombre: string;
  monto: number;
}
*/

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  // Base url
  baseurl = 'http://localhost:3000';

 // Http Headers

httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

  constructor(private http: HttpClient) { }

  GetByPk(table: string, id: string): Observable<[{}]> {
    // console.log('GeByFk crud : ', this.baseurl + '/api/' + table + '/fk/' + id);
    return this.http.get<[{}]>(this.baseurl + '/api/' + table + '/pk/' + id)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    );
}

GetData(table: string, fk: string): Observable<[{}]> {

    if (+fk === 0) {
      // console.log('GeByFk crud : ', this.baseurl + '/api/' + table);
      return this.http.get<any>(this.baseurl + '/api/' + table)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }
    else {
      // console.log('GeByFk crud : ', this.baseurl + '/api/' + table + '/fk/' + fk);
      return this.http.get<[{}]>(this.baseurl + '/api/' + table + '/fk/' + fk)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
    }
}


agregar(tabla: {}, table: string, fk: number = null): Observable<{}> {

  let baseurl = this.baseurl + /api/ + table;

  if (fk) { baseurl += '/' + fk; }

  // console.log('agregar crud : ', baseurl, tabla);

  return this.http.post<any>(baseurl, tabla, this.httpOptions);
}

adds_hijo(padre: string, hijo: string, ref: string,  hjo: object): Observable<object> {
  // console.log('uli : ', this.baseurl + '/api/' + hijo + '/' + id);
  return this.http.post<object>(this.baseurl + '/api/' + hijo + '/' + ref , hjo , this.httpOptions);

}

// PUT
Update(id: string, tab: {}, table: string): Observable<{}> {
  // console.log(`crud Update() url -> ${this.baseurl} + '/api/' + ${table} + '/' + ${id}`);
  // console.log(`crud Update() tab -> ${JSON.stringify(tab)}`);
  return this.http.put<{}>(this.baseurl + '/api/' + table + '/' + id, tab, this.httpOptions);
}

// DELETE
Delete(id: string, table: string) {
  return this.http.delete<{}>(this.baseurl + '/api/'  + table + '/' + id, this.httpOptions)
  .pipe(
    retry(1),
    catchError(this.errorHandl)
  );

}

// Error handling
errorHandl(error) {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent) {
     // Get client-side error
     errorMessage = error.error.message;
   } else {
     // Get server-side error
     errorMessage = `Error Code: xxx ${error.status}\nMessage: ${error.message}`;
   }
   console.log(errorMessage);
   return throwError(errorMessage);
}

}
