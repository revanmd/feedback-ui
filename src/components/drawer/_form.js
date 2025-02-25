import { useForm } from "react-hook-form"
export const FormComponent = ({
    callbackSubmit
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()


    const onSubmit = () => {
        console.log('Submitted form')
        callbackSubmit()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue="test" {...register("example")} />
            <input {...register("exampleRequired", { required: true })} />

            {errors.exampleRequired && <span>This field is required</span>}

            <input type="submit" />
        </form>
    )
}