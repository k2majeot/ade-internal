import { contactSchema } from "@shared/validation";

const form = document.getElementById("contact-form") as HTMLFormElement;

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const raw = {
    fname: formData.get("firstName"),
    lname: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    console.error("Validation failed", result.error.flatten());
    return;
  }

  try {
    const res = await fetch("https://api.adexperiences.com/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    if (!res.ok) throw new Error("Request failed");
    alert("Message sent successfully!");
    form.reset();
  } catch (err) {
    console.error("Error sending message", err);
    alert("Something went wrong.");
  }
});
