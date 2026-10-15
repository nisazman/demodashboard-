// Vercel Edge Middleware — HTTP Basic Auth
// Credentials can be overridden via environment variables in Vercel project settings:
//   BASIC_AUTH_USER  (default: hellodashboard)
//   BASIC_AUTH_PASS  (default: 987654321)

const USERNAME = process.env.BASIC_AUTH_USER || 'hellodashboard';
const PASSWORD = process.env.BASIC_AUTH_PASS || '987654321';

export default function middleware(request) {
  const authorization = request.headers.get('Authorization');

  if (authorization) {
    const [scheme, encoded] = authorization.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded);
        const colonIdx = decoded.indexOf(':');
        const user = decoded.substring(0, colonIdx);
        const pass = decoded.substring(colonIdx + 1);
        if (user === USERNAME && pass === PASSWORD) {
          return; // authenticated — pass request through
        }
      } catch (_) {
        // malformed credentials — fall through to 401
      }
    }
  }

  return new Response('Access denied. Please enter valid credentials.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Outlet Performance Dashboard", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}

export const config = {
  matcher: '/:path*', // protect every route
};
