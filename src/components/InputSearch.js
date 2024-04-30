import { Button, Input } from "@nextui-org/react";
import { Form, Formik } from "formik";


import { IoSearch } from "react-icons/io5";


function InputSearch({ name, label, loading, onSubmit, default_values }) {

    const initialValues = { ...default_values }
    initialValues[name] = initialValues[name] || false

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {({ handleChange, handleReset, values }) => (
                <Form className="flex" >
                    <Input
                        type='number'
                        name={name}
                        label={label}
                        className="w-36 h-12 rounded-e-none"
                        classNames={{
                            inputWrapper: 'rounded-e-none'
                        }}
                        defaultValue={values[name] ? values[name] : ''}
                        onChange={handleChange}

                        isClearable
                        onClear={handleReset}
                    />

                    <Button
                        type="submit"
                        isIconOnly
                        className="rounded-s-none h-12"
                        isDisabled={loading}
                    >
                        <IoSearch size={28} />
                    </Button>
                </Form>
            )}
        </Formik>
    );
}

export default InputSearch;
