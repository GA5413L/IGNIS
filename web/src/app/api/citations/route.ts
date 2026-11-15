import snapshot from '../../../data/citation-metadata.json';
export function GET() { return Response.json(snapshot, { headers: { 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } }); }
