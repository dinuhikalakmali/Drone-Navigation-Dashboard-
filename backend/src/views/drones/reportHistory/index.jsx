import { Container } from "react-bootstrap";
import AssetsPage from "@/views/drones/reportHistory/components/ReportsPage";
import PageBreadcrumb from "@/components/PageBreadcrumb";
const Index = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Report History" subtitle="reports" />
      <AssetsPage />
    </Container>
  );
};
export default Index;
