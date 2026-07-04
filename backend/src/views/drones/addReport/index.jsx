import { Container } from 'react-bootstrap';
import AssetsList from '@/views/drones/addReport/all-assets/AssetsList';
import PageBreadcrumb from '@/components/PageBreadcrumb';
const Index = () => {
  return <Container fluid>
      <PageBreadcrumb title="Add Reports" subtitle="reports" />
      <AssetsList/>
    </Container>;
};
export default Index;