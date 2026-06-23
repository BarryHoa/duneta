import { TenoraHome } from '@tenora/client/layouts';

export function meta() {
  return [
    { title: 'Tenora — ship your TypeScript stack' },
    {
      name: 'description',
      content: 'A portable TypeScript toolkit for React Router and Hono.',
    },
  ];
}

export default function HomePage() {
  return <TenoraHome />;
}
