import { RegisterForm } from "@/components/auth/auth-forms";
import { Container } from "@/components/ui/container";

export default function RegisterPage() {
  return (
    <Container className="py-20">
      <RegisterForm />
    </Container>
  );
}
