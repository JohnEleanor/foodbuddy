import { NextResponse } from "next/server";


export function middleware(reqest : Request, response : Response) {

    return NextResponse.next();
    
}

export const config = {
    matcher : ["/dashboard/:path*",]
}