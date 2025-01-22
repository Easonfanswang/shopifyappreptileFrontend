import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

const Index = () => {
  return <div>user</div>;
};

export default Index;
