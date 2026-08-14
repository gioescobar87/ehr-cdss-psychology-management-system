import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormContainer from "../../shared/components/forms/FormContainer";
import FormSection from "../../shared/components/forms/FormSection";
import FormTextField from "../../shared/components/forms/FormTextField";
import FormSelect from "../../shared/components/forms/FormSelect";
import FormDateField from "../../shared/components/forms/FormDateField";
import FormActions from "../../shared/components/forms/FormActions";

const schema = z.object({
  name: z.string().min(1, "Name is required"),

  status: z.string().min(1, "Status is required"),

  birthDate: z.string().min(1, "Birth date is required"),
});

type TestFormData = z.infer<typeof schema>;

export default function FormArchitectureTest() {
  const { control, handleSubmit } = useForm<TestFormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",

      status: "",

      birthDate: "",
    },
  });

  const onSubmit = (data: TestFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Basic Information"
        description="Test of the generic form architecture."
      >
        <Stack spacing={3}>
          <FormTextField<TestFormData>
            name="name"
            control={control}
            label="Name"
          />

          <FormSelect<TestFormData>
            name="status"
            control={control}
            label="Status"
            options={[
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
            ]}
          />

          <FormDateField<TestFormData>
            name="birthDate"
            control={control}
            label="Birth date"
          />
        </Stack>
      </FormSection>

      <FormActions />
    </FormContainer>
  );
}
