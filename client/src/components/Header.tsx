const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#2ecc71",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src="/favicon.svg"
        alt="Logo"
        style={{
          height: "32px",
          width: "32px",
          marginRight: "12px",
        }}
      />
      <h1
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "white",
          margin: 0,
        }}
      >
        Adult Day Experiences
      </h1>
    </header>
  );
};

export default Header;
