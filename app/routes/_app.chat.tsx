import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

const Index = () => {
  return <div>chat</div>;
};

export default Index;
