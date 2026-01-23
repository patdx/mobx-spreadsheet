import { Table } from '../../components/table';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function Page() {
  return <Table />;
}
