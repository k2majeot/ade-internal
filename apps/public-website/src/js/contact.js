document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-form-submit");
  const spinner = submitBtn?.querySelector(".submit-spinner");
  const submitText = submitBtn?.querySelector(".submit-text");

  function clearErrors() {
    const inputs = form.querySelectorAll(".form-control");
    inputs.forEach((input) => {
      input.classList.remove("is-invalid");
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "";
      }
    });
  }

  function showError(fieldName, message) {
    const input = form.querySelector(`[name="${fieldName}"]`);
    const feedback = input?.nextElementSibling;

    if (input && feedback && feedback.classList.contains("invalid-feedback")) {
      input.classList.add("is-invalid");
      feedback.textContent = message;
    }
  }

  function validateContact(contact) {
    const errors = {};

    if (!contact.firstName || contact.firstName.trim() === "") {
      errors.firstName = "First name is required";
    }

    if (!contact.lastName || contact.lastName.trim() === "") {
      errors.lastName = "Last name is required";
    }

    if (
      !contact.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
    ) {
      errors.email = "Valid email is required";
    }

    if (!contact.phone || contact.phone.trim() === "") {
      errors.phone = "Phone number is required";
    }

    if (!contact.message || contact.message.trim() === "") {
      errors.message = "Message is required";
    }

    return errors;
  }

  form?.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);

    const contact = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    const errors = validateContact(contact);

    if (Object.keys(errors).length > 0) {
      for (const [field, msg] of Object.entries(errors)) {
        showError(field, msg);
      }
      return;
    }

    submitBtn.disabled = true;
    spinner.style.display = "inline-block";
    submitText.style.display = "none";

    try {
      const response = await fetch(
        "https://api.adexperiences.com/public/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contact),
        }
      );

      if (!response.ok) {
        showError("message", "Something went wrong. Please try again.");
        return;
      }

      form.reset();
    } catch (err) {
      console.error("Error sending message:", err);
      showError("message", "Something went wrong. Please try again.");
    } finally {
      submitBtn.disabled = false;
      spinner.style.display = "none";
      submitText.style.display = "inline-block";
    }
  });
});
