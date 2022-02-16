import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, map, Observable, tap, throwError } from "rxjs";

export interface Todo {
  completed: boolean,
  title: string,
  id?: number
}

@Injectable({
    providedIn: 'root'
})
export class TodosService {
    constructor(private http: HttpClient) { }

    addTodo(todo: Todo): Observable<Todo> {
        return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo)
    }

    fetchTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?', {
            params: new HttpParams().set('_limit', '5')
        })
            .pipe(
                delay(500), 
                catchError(error => {
                    console.log('error', error.message)
                    return throwError(() => new Error(error))
            }));
    }

    removeTodo(id: number): Observable<any> {
        return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            observe: 'events'
        }).pipe(
            tap(event => {
                console.log(event)
                if (event.type === HttpEventType.Sent) {
                    console.log('Sent', event)
                }

                if (event.type === HttpEventType.Response) {
                    console.log('Response', event)
                }
            })
        )
    }

    completeTodo(id:number): Observable<Todo> {
        return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            completed: true
        })
    }
}