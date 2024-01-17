import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./ContactForm.scss";
import dataForm from "../../data/dataForm";
import axios from "axios";
import Swal from "sweetalert2";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Muy corto!")
    .max(50, "Muy Largo!")
    .required("Obligatorio"),
  lastName: Yup.string()
    .min(2, "Muy corto!")
    .max(50, "Muy Largo!")
    .required("Obligatorio"),
  cellPhone: Yup.string()
    .matches(/^[0-9]+$/, "Sólo números")
    .min(10, "Muy corto!")
    .max(10, "Muy Largo!")
    .required("Obligatorio"),
  email: Yup.string().email("Email inválido").required("Obligatorio"),
  message: Yup.string().min(2, "Muy corto!").required("Obligatorio"),
});

const ContactForm = () => {
  let disabled = false;
  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          cellPhone: "",
          email: "",
          message: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          disabled = true;
          const response = await axios.post(
            "https://backend-nodemailer.onrender.com/sendEmail",
            values
          );
          const { data } = response;
          if (data.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Mensaje enviado correctamente",
              showConfirmButton: true,
              customClass: {
                container: "custom-swal-container", // Clase personalizada para la alerta
              },
            }).then(() => {
              window.location.reload();
              disabled = false;
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Error al enviar el mensaje",
              showConfirmButton: true,
              customClass: {
                container: "custom-swal-container", // Clase personalizada para la alerta
              },
            }).then(() => {
              window.location.reload();
              disabled = false;
            });
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="form">
            {dataForm.map((data) => (
              <div className="form__group" key={data.id}>
                <label htmlFor={data.name} className="form__label">
                  {data.label}
                </label>
                <Field
                  name={data.name}
                  type={data.type}
                  as={data.name === "message" ? "textarea" : "input"}
                  placeholder={data.placeholder}
                  className={
                    data.name === "message" ? "form__textarea" : "form__input"
                  }
                />
                {errors[data.name] && touched[data.name] ? (
                  <div className="form__error">{errors[data.name]}</div>
                ) : null}
              </div>
            ))}
            <button type="submit" className="form__submit" disabled={disabled}>
              Enviar
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ContactForm;
