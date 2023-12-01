import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const splitUrl = request.url.split('?')
  const queryString = splitUrl.length < 2 ? '' : splitUrl[1]

  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  requestHeaders.set('query-string', queryString)
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/products/:path'],
}