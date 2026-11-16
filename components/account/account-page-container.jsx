export default function AccountPageContainer({ as: Element = "div", className = "", children, ...props }) {
  return (
    <Element className={`account-page-container ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}
