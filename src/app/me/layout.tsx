import Sidebar from "./nav-sidebar";
import Navbar from "./navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      <Sidebar />
      <Navbar />
      <main className="pl-18 pt-16 h-full">{children}</main>
    </div>
  );
}
