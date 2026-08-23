import { useEffect, useState } from "react";
import { Container, Table, Card, Badge } from "react-bootstrap"; // Added Badge
import axios from "axios";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const DefectsList = () => {
    const [defects, setDefects] = useState([]);

    useEffect(() => {
        const fetchDefects = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/defects");
                if (response.data.success) {
                    setDefects(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching defect details:", error);
            }
        };

        fetchDefects();
    }, []);

    // Helper function to assign colors based on severity level
    const getSeverityBadge = (severity) => {
        if (!severity) return "secondary"; // Gray for N/A

        switch (severity.toLowerCase()) {
            // case "critical":
            //     return "danger"; // Red
            case "high":
                return "danger"; // Yellow/Orange
            case "medium":
                return "info"; // Blue/Teal
            case "low":
                return "success"; // Green
            default:
                return "primary";
        }
    };

    return (
        <Container fluid>
            <PageBreadcrumb title="Defect Details" />

            <Card className="mt-4 shadow-sm">
                <Card.Body>
                    <Table striped bordered hover responsive className="align-middle text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Camera ID</th>
                                <th>Defect Type</th>
                                <th>Confidence</th>
                                <th>Severity</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defects.length > 0 ? (
                                defects.map((defect) => (
                                    <tr key={defect._id}>
                                        <td className="fw-bold text-muted">{defect.camera_id || "N/A"}</td>

                                        <td className="text-capitalize">
                                            {/* Replaces underscores with spaces (e.g., vertical_crack -> vertical crack) */}
                                            {(defect.crack_type || defect.defect_type || "Unknown").replace(/_/g, ' ')}
                                        </td>

                                        <td>
                                            {/* Converts 0.4010 to 40.1% */}
                                            {defect.confidence ? `${(defect.confidence * 100).toFixed(1)}%` : "N/A"}
                                        </td>

                                        <td>
                                            {/* Colorful Badge for Severity */}
                                            <Badge bg={getSeverityBadge(defect.severity)} className="px-3 py-2">
                                                {defect.severity ? defect.severity.toUpperCase() : "N/A"}
                                            </Badge>
                                        </td>

                                        <td>
                                            {/* Shows a cleaner timestamp */}
                                            {defect.timestamp || defect.detected_time || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        Loading defects or no data found...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DefectsList;