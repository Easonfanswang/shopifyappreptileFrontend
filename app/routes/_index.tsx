import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/home");
};

export default function Index() {
  return null;
} 