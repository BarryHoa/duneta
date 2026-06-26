import { DunetaHome } from '@duneta/client/layouts';

export function meta() {
  return [
    { title: 'Duneta — ship your TypeScript stack' },
    {
      name: 'description',
      content: 'A portable TypeScript toolkit for React Router and Hono.',
    },
  ];
}

export default function HomePage() {
  return <DunetaHome />;
}
