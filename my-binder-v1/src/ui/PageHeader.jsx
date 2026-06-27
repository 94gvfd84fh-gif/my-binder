function PageHeader({ label, title, description, action }) {
  return (
    <header className="page-header">
      <div>
        {label && <p className="page-label">{label}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}

export default PageHeader;