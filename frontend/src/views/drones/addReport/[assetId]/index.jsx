import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Spinner,
} from "react-bootstrap";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { TbPencil, TbTrash } from "react-icons/tb";
import AssetDisplay from "./components/AssetDisplay";
import AssetDetails from "./components/AssetDetails";

const Index = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Asset Details" subtitle="Asset Management" />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <AssetDetails />
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Index;
