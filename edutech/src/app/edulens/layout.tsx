import { EdulensShell } from "@/components/edulens/EdulensShell";

export default function EdulensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EdulensShell>{children}</EdulensShell>;
}
