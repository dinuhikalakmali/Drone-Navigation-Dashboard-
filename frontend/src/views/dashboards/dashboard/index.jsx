import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Badge, Card, Col, Container, ListGroup, ProgressBar, Row } from "react-bootstrap";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import SalesCharts from "@/views/dashboards/dashboard/components/SalesCharts";
import DashbordAssetsList from "./components/DashbordAssetList";
import StatCard from "./components/StatCard";
import {
  BsWrenchAdjustable,
  BsCameraVideo,
  BsCpu,
  BsBoundingBox,
  BsFileEarmarkBarGraph,
  BsArrowRight,
  BsCheckCircleFill,
  BsExclamationTriangle,
  BsLightbulb,
} from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";
import AssetsCategory from "./components/AssetsCategory";
import { Link } from "react-router";

const Index = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [activeAssets, setActiveAssets] = useState(0);
  const [inactiveAssets, setInactiveAssets] = useState(0);
  const [totalDefect, setTotalDefect] = useState(0);

  useEffect(() => {
    const fetchTotalAssetsCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ASSET-API/asset/all-count"
        );
        const total = response.data?.status ? response.data.count : 0;
        setTotalAssets(total);
      } catch (error) {
        console.error("Error fetching total assets count:", error);
      }
    };

    const fetchActiveAssetsCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ASSET-API/asset/active-count"
        );
        const active = response.data?.status ? response.data.count : 0;
        setActiveAssets(active);
      } catch (error) {
        console.error("Error fetching active assets count:", error);
      }
    };

    const fetchInactiveAssetCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ASSET-API/asset/inactive-count"
        );
        const inactive = response.data?.status ? response.data.count : 0;
        setInactiveAssets(inactive);
      } catch (error) {
        console.error("Error fetching inactive assets count:", error);
      }
    };

    const fetchTotalDefectCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/defects/count"
        );
        const count = response.data?.success ? response.data.count : 0;
        setTotalDefect(count);
      } catch (error) {
        console.error("Error fetching total defects count:", error);
      }
    };

    fetchTotalDefectCount();
    // fetchTotalAssetsCount();
    // fetchActiveAssetsCount();
    // fetchInactiveAssetCount();
  }, []);

  // Core pipeline stages of the system (Chapter 4/5 of the dissertation)
  const pipelineStages = [
    { label: "Drone Capture", icon: BsCameraVideo },
    { label: "Image Pre-processing", icon: BsCpu },
    { label: "YOLOv11 Defect Detection", icon: BsBoundingBox },
    { label: "Defect Classification", icon: BsWrenchAdjustable },
    { label: "Dashboard & Report", icon: BsFileEarmarkBarGraph },
  ];

  // Four core modules mapped to project objectives (Chapter 1 / 7.2)
  const coreModules = [
    {
      title: "Autonomous Drone Navigation",
      desc: "Waypoint-based flight with live telemetry (battery, altitude, speed, GPS).",
    },
    {
      title: "Real-Time Defect Detection",
      desc: "YOLOv11-based computer vision pipeline for cracks and surface defects.",
    },
    {
      title: "Centralized Web Dashboard",
      desc: "Role-based views for Engineers, QA Officers, and Administrators.",
    },
    {
      title: "Automated Reporting & Analytics",
      desc: "Defect logging with location, severity, and exportable inspection reports.",
    },
  ];

  // Headline evaluation results (Chapter 6 test results)
  const performanceMetrics = [
    { label: "Overall Defect Detection Accuracy", value: 92.3, variant: "success" },
    { label: "Bright Daylight Accuracy", value: 95.2, variant: "success" },
    { label: "Overcast / Low-Light Accuracy", value: 83.4, variant: "warning" },
    { label: "Unit Test Pass Rate", value: 100, variant: "info" },
    { label: "Integration Test Pass Rate", value: 100, variant: "info" },
  ];

  const techStack = [
    "React", "React-Bootstrap", "Axios", "MongoDB",
    "YOLOv11", "OpenCV", "Streamlit", "Node.js / Express",
  ];

  return (
    <Container fluid>
      <PageBreadcrumb title="Dashboard" />

      {/* Project introduction — for anyone unfamiliar with the project */}
      <Row>
        <Col xs={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">About This Project</h5>
            </Card.Header>
            <Card.Body>
              <p>
                Construction quality checks are still mostly done by hand — engineers
                physically climb scaffolding and walk through unfinished buildings to
                look for cracks, spalling, and other structural defects. It's slow,
                depends heavily on the individual inspector's experience, and puts
                people at risk of falls, one of the leading causes of injury on
                construction sites. Defects that go unnoticed often only surface after
                handover, when fixing them is far more expensive and disruptive.
              </p>
              <p className="mb-4">
                This project explores whether that process can be automated. A drone
                fitted with a camera flies a set inspection path over a construction
                site, capturing footage as it goes. A YOLOv11-based computer vision
                model analyzes that footage in real time to detect cracks and other
                surface defects, and every detection — with its location, confidence
                score, and severity — is logged and pushed to this web dashboard,
                where Engineers, QA Officers, and Administrators can review it and
                generate inspection reports.
              </p>

              <Row className="g-4">
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-start gap-2">
                    <BsExclamationTriangle size={22} className="text-danger mt-1 flex-shrink-0" />
                    <div>
                      <div className="fw-semibold">The Problem</div>
                      <div className="text-muted small">
                        Manual inspections are slow, inconsistent between inspectors,
                        unsafe at height, and leave no centralized record — defects
                        end up scattered across paper notes and spreadsheets instead
                        of one searchable system.
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-start gap-2">
                    <BsLightbulb size={22} className="text-warning mt-1 flex-shrink-0" />
                    <div>
                      <div className="fw-semibold">The Approach</div>
                      <div className="text-muted small">
                        Combine autonomous drone navigation with deep learning-based
                        defect detection and a real-time dashboard, so inspections
                        happen faster, more often, and with a consistent standard
                        every time.
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top row — 6 stat cards, unchanged layout */}
      <Row>
        <Col xs={12} className="mb-4">
          <Row lg={3} md={2} sm={1} className="g-4">
            <Col>
              <Link to="/defects-list" style={{ textDecoration: "none" }}>
                <StatCard
                  item={{
                    title: "Total Defect Summary",
                    iconBg: "success",
                    icon: BsWrenchAdjustable,
                    value: totalDefect,
                  }}
                />
              </Link>
            </Col>
            <Col>
              <StatCard
                item={{
                  title: "Active Inspection Count",
                  iconBg: "info",
                  icon: BsWrenchAdjustable,
                  value: activeAssets,
                }}
              />
            </Col>
            <Col>
              <Link to="https://drone-navigation-system-gvyv3qizhq44bzhzkt8w6m.streamlit.app/">
                <StatCard
                  item={{
                    title: "Drone Controller",
                    iconBg: "warning",
                    icon: BsWrenchAdjustable,
                    value: 1,
                  }}
                />
              </Link>
            </Col>
            <Col>
              <StatCard
                item={{
                  title: "Defect Report Download",
                  iconBg: "primary",
                  icon: BsWrenchAdjustable,
                  value: 0,
                }}
              />
            </Col>
            <Col>
              <StatCard
                item={{
                  title: "Recent Activity Feed",
                  iconBg: "danger",
                  icon: BsWrenchAdjustable,
                  value: 0,
                }}
              />
            </Col>
            <Col>
              <StatCard
                item={{
                  title: "Critical Alerts Notifications",
                  iconBg: "secondary",
                  icon: BsWrenchAdjustable,
                  value: 0,
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* System pipeline — the end-to-end flow of the project */}
      <Row>
        <Col xs={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Pipeline</h5>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-center text-center g-3">
                {pipelineStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  return (
                    <Col key={stage.label} xs={12} md={true}>
                      <Row className="align-items-center">
                        <Col>
                          <Icon size={28} className="text-primary mb-2" />
                          <div className="fw-semibold small">{stage.label}</div>
                        </Col>
                        {idx < pipelineStages.length - 1 && (
                          <Col xs="auto" className="d-none d-md-block">
                            <BsArrowRight size={22} className="text-muted" />
                          </Col>
                        )}
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Core modules + performance metrics side by side */}
      <Row>
        <Col xs={12} lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Core System Modules</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {coreModules.map((mod) => (
                <ListGroup.Item key={mod.title} className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">{mod.title}</div>
                    <div className="text-muted small">{mod.desc}</div>
                  </div>
                  <Badge bg="success" className="d-flex align-items-center gap-1">
                    <BsCheckCircleFill /> Achieved
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col xs={12} lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Model & Testing Performance</h5>
            </Card.Header>
            <Card.Body>
              {performanceMetrics.map((m) => (
                <div key={m.label} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{m.label}</span>
                    <span className="fw-semibold">{m.value}%</span>
                  </div>
                  <ProgressBar now={m.value} variant={m.variant} />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Technology stack */}
      <Row>
        <Col xs={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Technology Stack</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} bg="light" text="dark" className="border px-3 py-2">
                  {tech}
                </Badge>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Optional Charts Section */}
      {/* <Row>
        <Col xs={12}>
          <SalesCharts />
        </Col>
      </Row> */}

      {/* <Row>
        <Col xs={12}>
          <AssetsCategory />
        </Col>
      </Row> */}

      {/* <Row>
        <Col xs={12}>
          <DashbordAssetsList />
        </Col>
      </Row> */}
    </Container>
  );
};

export default Index;