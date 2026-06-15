export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'App is alive and deployed on Vercel',
    timestamp: new Date().toISOString()
  });
}