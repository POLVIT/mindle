import React, { useEffect } from 'react';

import { firstObjValue } from '../utils/firstObjValue';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../context/Loading';
import Router from 'next/router';
import { useValidationSchemas } from '../context/ValidationSchemas';
import { useFormik } from 'formik';
import { schemaToInitialValues } from '../utils/schemaToInitialValues';
import Position from '../components/Position/Position';
import Input from '../components/Input/Input';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import StyledIllustration from '../components/StyledIllustration';
import Checkbox from '../components/Checkbox/Checkbox';
import Button, { ButtonRoles } from '../components/Button/Button';
import Link from 'next/link';
import { withPage } from '../components/withPage';
import { Routes } from '../Routes';
import { capitalizeFirst } from '../utils/capitalizeFirst';

const CreateAccountPage: React.FC = () => {
    const { CreateAccountSchema } = useValidationSchemas();
    const { createAccount, error: authError, loading, success } = useAuth();
    const { active, setActive } = useLoading();
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        setFieldValue,
    } = useFormik({
        initialValues: schemaToInitialValues(CreateAccountSchema)({
            newsletter: true,
            terms: false,
            privacy: false,
        }),
        validationSchema: CreateAccountSchema,
        validateOnChange: false,
        onSubmit: ({ email, password }) => createAccount({ email, password }),
    });

    const onChange = handleChange as any;
    const onSubmit = handleSubmit as any;

    useEffect(() => {
        if (success) Router.replace(Routes.SignIn);
    }, [success]);

    useEffect(() => {
        if (authError) console.error(authError);
    }, [authError]);

    useEffect(() => {
        loading !== active && setActive(loading);
    }, [active, loading, setActive]);

    return (
        <>
            <Position>
                <Input
                    value={values.email}
                    onChange={onChange('email')}
                    type="email"
                    label="Email"
                    error={!!errors.email}
                />
                <Input
                    value={values.password}
                    onChange={onChange('password')}
                    type="password"
                    label="Password"
                    error={!!errors.password}
                />
                <Input
                    value={values.confirmPassword}
                    onChange={onChange('confirmPassword')}
                    type="password"
                    label="Confirm Password"
                    error={!!errors.confirmPassword}
                />
                {(firstObjValue(errors) || authError?.message) && (
                    <Position justify="flex-start" align="flex-start">
                        <ErrorMessage>
                            {firstObjValue(errors) ||
                                capitalizeFirst(authError!.message!)}
                        </ErrorMessage>
                    </Position>
                )}
            </Position>
            <Position>
                <StyledIllustration src="/create-account.svg" alt="Welcome" />
            </Position>
            <Position>
                <Checkbox
                    currentValue={values.newsletter}
                    onValueChange={(_e, newVal) =>
                        setFieldValue('newsletter', newVal)
                    }
                    error={!!errors.newsletter}
                >
                    I wish to recieve newsletter from mindle
                </Checkbox>
                <Checkbox
                    currentValue={values.terms}
                    onValueChange={(_e, newVal) =>
                        setFieldValue('terms', newVal, false)
                    }
                    error={!!errors.terms}
                >
                    I agree with Terms and Conditions
                </Checkbox>
                <Checkbox
                    currentValue={values.privacy}
                    onValueChange={(_e, newVal) =>
                        setFieldValue('privacy', newVal, false)
                    }
                    error={!!errors.privacy}
                >
                    I agree with Privacy Policy
                </Checkbox>
            </Position>
            <Position justify="flex-end">
                <Button role={ButtonRoles.Primary} onClick={onSubmit}>
                    Create Account
                </Button>

                <Link href={Routes.SignIn}>
                    <Button role={ButtonRoles.Secondary}>Sign In</Button>
                </Link>
            </Position>
        </>
    );
};

export default withPage(CreateAccountPage);
