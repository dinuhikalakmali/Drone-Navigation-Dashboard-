import { Card, CardBody } from "react-bootstrap";
import CountUp from "react-countup";

const StatCard = ({ item }) => {
  const {
    title,
    iconBg = "primary", // fallback color
    icon: Icon,
    prefix = "",
    suffix = "",
    value = 0,
    gradient = "blue", // NEW: choose gradient theme: "blue", "purple", "green", "orange", "pink", "teal"
  } = item;

  // Define vibrant gradients
  const gradients = {
    blue: "linear-gradient(135deg, #6f66eaff 0%, #000000ff 100%)",
    purple: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    green: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    pink: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    teal: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    rainbow: "linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c, #4ffe95ff, #00f2fe)",
  };

  const selectedGradient = gradients[gradient] || gradients.blue;

  // Matching icon colors
  const iconColors = {
    blue: "text-white",
    purple: "text-white",
    green: "text-white",
    orange: "text-white",
    pink: "text-white",
    teal: "text-white",
    rainbow: "text-white",
  };

  return (
    <Card
      className="h-100 border-0 shadow-lg overflow-hidden position-relative"
      style={{
        borderRadius: "20px",
        background: selectedGradient,
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
      }}
    >
      {/* Optional subtle overlay for better text readability */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />

      <CardBody className="d-flex align-items-center justify-content-between p-4 position-relative">
        {/* Icon Section - Glowing Circle */}
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle shadow-lg ${iconColors[gradient]}`}
          style={{
            width: "70px",
            height: "70px",
            fontSize: "2rem",
            flexShrink: 0,
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Icon />
        </div>

        {/* Text Section */}
        <div className="text-end flex-grow-1 ms-4">
          <h2 className="fw-bold mb-1 text-white" style={{ fontSize: "2.2rem", textShadow: "2px 2px 8px rgba(0,0,0,0.3)" }}>
            <CountUp
              end={value}
              duration={2}
              separator=","
              prefix={prefix}
              suffix={suffix}
            />
          </h2>
          <p className="text-white mb-0 fs-5 fw-medium opacity-90">{title}</p>
        </div>
      </CardBody>

      {/* Optional glowing bottom border effect */}
      <div
        className="position-absolute bottom-0 start-0 w-100"
        style={{
          height: "4px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        }}
      />
    </Card>
  );
};

export default StatCard;