import { useState } from "react";
import { Button, Col, Pagination, Row } from "react-bootstrap";
import {
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuLayoutGrid,
  LuList,
  LuMenu,
  LuPlus,
} from "react-icons/lu";
import Assets from "./Assets";
const AssetsPage = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  return (
    <>
      <Row className="mb-2">
        <Col lg={12}>
          <div className="bg-light-subtle rounded border p-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              {/* Left side — menu button */}
              <div className="d-lg-none">
                <Button
                  variant="light"
                  className="btn-icon"
                  onClick={() => setIsOffcanvasOpen(true)}
                >
                  <LuMenu className="fs-lg" />
                </Button>
              </div>

              {/* Right side — grid/list/add buttons */}
              <div className="ms-auto d-flex gap-1">
                <Button
                  href="#"
                  variant="primary"
                  className="btn-primary btn-icon"
                >
                  <LuLayoutGrid className="fs-lg" />
                </Button>
                <Button
                  href="/add-report"
                  variant="primary"
                  className="btn-soft-primary btn-icon"
                >
                  <LuList className="fs-lg" />
                </Button>
                <Button href="/add-asset" variant="danger" className="ms-1">
                  <LuPlus className="fs-sm me-2" /> Add New Report
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-2">
        <Col xl={12}>
          <Assets />

          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <Pagination className="pagination-boxed justify-content-center mb-0">
              <Pagination.Prev disabled>
                <LuChevronLeft />
              </Pagination.Prev>
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Item>{4}</Pagination.Item>
              <Pagination.Item>{5}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>{20}</Pagination.Item>
              <Pagination.Next>
                <LuChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default AssetsPage;
