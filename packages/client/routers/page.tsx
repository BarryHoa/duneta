import { DunetaHome } from '@duneta/client/layouts';

export function meta() {
  return [
    { title: 'Duneta — one Worker, full stack' },
    {
      name: 'description',
      content: 'React Router + Hono on a single Cloudflare Worker. Web and /api on one domain.',
    },
  ];
}

export default function HomePage() {
  return <DunetaHome />;
}
