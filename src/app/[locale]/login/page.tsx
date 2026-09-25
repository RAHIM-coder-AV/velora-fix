import { LoginForm } from "@/components/auth/auth-forms";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  return (
    <Container className="py-20">
      <LoginForm />
    </Container>
  );
}
