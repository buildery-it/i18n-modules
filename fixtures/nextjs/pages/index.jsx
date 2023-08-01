import Link from 'next/link';
import ComponentA from '../components/component_a';

const Page = () => (
  <div>
    IndexPage
    <ComponentA />
    <Link href="/extra">Second Page</Link>
  </div>
);

export default Page;
