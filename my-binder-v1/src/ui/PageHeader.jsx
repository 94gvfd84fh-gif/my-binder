function PageHeader({ label, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <p className="page-label">{label}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {action}
    </div>
  );
}

export default PageHeader;