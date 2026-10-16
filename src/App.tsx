import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Index from "./pages/IndexMinimal";
import Products from "./pages/Products";
import RiddoffERP from "./pages/RiddoffERP";
import Solutions from "./pages/Solutions";
import Infrastructure from "./pages/Infrastructure";
import Industries from "./pages/Industries";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ResponsiveEngine from "./pages/ResponsiveEngine";
import Sales from "./pages/erp/Sales";
import CRM from "./pages/erp/CRM";
import Procurement from "./pages/erp/Procurement";
import Inventory from "./pages/erp/Inventory";
import ManufacturingModule from "./pages/erp/ManufacturingModule";
import Accounts from "./pages/erp/Accounts";
import Reports from "./pages/erp/Reports";
import HRPayroll from "./pages/erp/HRPayroll";
import Task from "./pages/erp/Task";
import Careers from "./pages/Careers";
import CourseDetail from "./pages/CourseDetail";
import Masterclass from "./pages/Masterclass";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/riddoff-erp" element={<RiddoffERP />} />
            <Route path="/products/riddoff-erp/sales" element={<Sales />} />
            <Route path="/products/riddoff-erp/crm" element={<CRM />} />
            <Route path="/products/riddoff-erp/procurement" element={<Procurement />} />
            <Route path="/products/riddoff-erp/inventory" element={<Inventory />} />
            <Route path="/products/riddoff-erp/manufacturing" element={<ManufacturingModule />} />
            <Route path="/products/riddoff-erp/accounts" element={<Accounts />} />
            <Route path="/products/riddoff-erp/reports" element={<Reports />} />
            <Route path="/products/riddoff-erp/hr-payroll" element={<HRPayroll />} />
            <Route path="/products/riddoff-erp/task" element={<Task />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/platforms" element={<Infrastructure />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/company" element={<Company />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/masterclass" element={<Masterclass />} />
            <Route path="/responsive-engine" element={<ResponsiveEngine />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
