import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div>
      <h1>Home page</h1>
      <div>
        <h2>Button</h2>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div>
        <h2>Disabled Button</h2>
        <Button variant="primary" disabled>
          Primary
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="danger" disabled>
          Danger
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
