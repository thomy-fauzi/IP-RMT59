function Button(props) {
  const { onClick, type = "button", title, variant = "primary" } = props;

  const variantClass = `btn-${variant}`;

  return (
    <button onClick={onClick} type={type} className={`btn ${variantClass}`}>
      {title}
    </button>
  );
}

export default Button;
