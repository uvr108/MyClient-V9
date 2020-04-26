import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// import { Tabla } from '../tabla';

export interface Hijo {
  nombre: string;
  monto: number;
}
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

GetByFk(table: string, id: number): Observable<[{}]> {

  return this.http.get<[{}]>(this.baseurl + '/api/' + table + '/fk/' + id)
  .pipe(
    retry(1),
    catchError(this.errorHandl)
  );
}

getList(table: string): Observable<Array<{}>> {

  return this.http.get<any>(this.baseurl + '/api/' + table)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    );
}

agregar(tabla: {}, table: string, fk: number): Observable<{}> {
  // console.log(tabla);
  return this.http.post<any>(this.baseurl + '/api/' + table + '/' + fk, tabla, this.httpOptions);
}

adds_hijo(padre: string, hijo: string, id: number,  hjo: Hijo): Observable<Hijo> {
  console.log('uli : ', this.baseurl + '/api/' + hijo + '/' + id);
  return this.http.post<Hijo>(this.baseurl + '/api/' + hijo + '/' + id , hjo , this.httpOptions);

}

// PUT
Update(id: number, tab: {}, table: string): Observable<{}> {
  return this.http.put<{}>(this.baseurl + '/api/' + table + '/' + id, tab, this.httpOptions);
}

// DELETE
Delete(id: number, table: string) {
  return this.http.delete<{}>(this.baseurl + '/api/'  + table + '/' + id, this.httpOptions);
  /*
  .pipe(
    retry(1),
    catchError(this.errorHandl)
  );
  */
}

// Error handling
errorHandl(error) {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent) {
     // Get client-side error
     errorMessage = error.error.message;
   } else {
     // Get server-side error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   console.log(errorMessage);
   return throwError(errorMessage);
}

}
