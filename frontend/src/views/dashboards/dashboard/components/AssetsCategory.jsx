import axios from "axios";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { LuSearch } from "react-icons/lu";

const AssetsCategory = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const API_BASE = "http://localhost/ASSET-API";

  // Category list
  const categories = [
    "Desktop Computer",
    "Laptop",
    "Monitor",
    "Pocket Router",
    "Server",
    "Network Switch",
    "Router",
    "Firewall",
    "Switches",
    "Wifi Access Point",
    "Printer",
    "Scanner",
    "Projector",
    "Keyboard",
    "Mouse",
    "External Hard Drive",
    "USB Flash Drive",
    "UPS",
    "Tablet",
    "Smartphone",
    "Ap's",
    "Other",
  ];

  // Statuses and ownerships
  const statuses = ["active", "inactive"];
  const ownerships = ["company own", "rented"];

  // Fetch counts for each category (status + ownership)
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const counts = {};

            // Fetch counts by status
            for (const status of statuses) {
              try {
                const res = await axios.get(
                  `${API_BASE}/asset/status/${encodeURIComponent(
                    status
                  )}/${encodeURIComponent(category)}`
                );
                counts[status] = res.data.count || 0;
              } catch {
                counts[status] = 0;
              }
            }

            // Fetch counts by ownership
            for (const own of ownerships) {
              try {
                const res = await axios.get(
                  `${API_BASE}/asset/owner/${encodeURIComponent(
                    own
                  )}/${encodeURIComponent(category)}`
                );

                counts[own] = res.data.count || 0;
              } catch {
                counts[own] = 0;
              }
            }

            // Total count
            const total = Object.values(counts).reduce(
              (sum, val) => sum + (val || 0),
              0
            );

            return { category, ...counts, total };
          })
        );

        setCategoryStats(results);
      } catch (error) {
        console.error("Error fetching category stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  //  Filter by search or status
  const filteredStats = categoryStats.filter((cat) => {
    const matchesSearch =
      globalFilter.trim() === "" ||
      cat.category.toLowerCase().includes(globalFilter.toLowerCase());

    if (selectedStatus === "all") return matchesSearch;

    return matchesSearch && (cat[selectedStatus] || 0) > 0;
  });

  return (
    <Row>
      <Col xs={12}>
        <Card className="mb-4 shadow-sm">
          <CardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            {/*  Search */}
            <div className="app-search d-flex align-items-center">
              <input
                type="search"
                className="form-control"
                placeholder="Search categories..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <LuSearch className="app-search-icon text-muted ms-2" />
            </div>

            {/*  Status Filter */}
            <Form.Select
              style={{ width: "200px" }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </Form.Select>
          </CardHeader>

          <CardBody>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : filteredStats.length === 0 ? (
              <div className="text-center text-muted py-4">
                No categories found
              </div>
            ) : (
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Category</th>
                    <th className="text-center">Active</th>
                    <th className="text-center">Inactive</th>
                    <th className="text-center">Company Own</th>
                    <th className="text-center">Rented</th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.map((cat) => (
                    <tr key={cat.category}>
                      <td>{cat.category}</td>
                      <td className="text-center text-success">{cat.active}</td>
                      <td className="text-center text-danger">
                        {cat.inactive}
                      </td>

                      <td className="text-center">{cat["company own"]}</td>
                      <td className="text-center">{cat.rented}</td>
                      <td className="text-center fw-bold">{cat.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AssetsCategory;
