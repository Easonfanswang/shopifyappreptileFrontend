import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

const Index = () => {
  return <div>home</div>;
};

export default Index;
