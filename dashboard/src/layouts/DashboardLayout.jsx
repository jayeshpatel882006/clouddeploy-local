import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
