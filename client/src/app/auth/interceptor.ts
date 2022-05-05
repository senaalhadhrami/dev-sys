import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private authService:AuthService){}

    intercept(req: HttpRequest<any>, next:HttpHandler){
        const authToken = this.authService.getToken();
        // copy request and edit it's headers to include the token, 'authoriization' is the key to match also on backend when parsing the request.
        const authRequest = req.clone({
            headers:req.headers.set('Authorization', 'Bearer ' + authToken)
        });
        return next.handle(authRequest)
    }

}
