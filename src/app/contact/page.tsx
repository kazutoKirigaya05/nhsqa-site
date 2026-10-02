import { SimpleForm } from "@/components/SimpleForm";

export const metadata = { title: "Contact" };

export default function Page() {
  return (
    <section className="page-head">
      <div className="wrap split">
        <div className="stack">
          <h1 className="long">Contact us</h1>
          <p className="lede">Questions from students, parents, teachers and firms are all welcome.</p>
        </div>
        <SimpleForm id="contact" submit="Send message" notReady="Not sent. The contact form opens when the site launches."
          fields={[
            { name: "name", label: "Your name", required: true, half: true, autoComplete: "name" },
            { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
            { name: "who", label: "I am a", type: "select", required: true, options: ["Student", "Parent or guardian", "Teacher", "Potential sponsor", "Potential mentor", "Someone else"] },
            { name: "message", label: "Message", type: "textarea", required: true },
          ]} />
      </div>
    </section>
  );
}
