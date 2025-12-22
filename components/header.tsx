type HeaderTypes = {
  title: string;
  description: string;
};

const Header = ({ title, description }: HeaderTypes) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Header;
