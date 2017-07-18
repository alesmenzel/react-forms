import React from 'react'
import { Field, Form } from 'hoc/form'
import { isRequired, minLength, isEmail, toUpperCase } from 'helper/form'

import { Card } from 'react-toolbox/lib/card'
import { Input, Submit, Reset } from 'components/material-ui'

const submit = (values, onError, onErrors) => {
  console.log('hello!', values)
	//
	// console.log('FORM SUBMITTED', values);
	// // Do whatever with the data
	//
	// setTimeout(() => {
	// 	console.log('FORM FINISHED');
	// 	setErrors({
	// 		username: ['WTF', 'OMG'],
	// 		email: 'NOPE',
	// 		test: 'NOT OK :-)',
	// 	}, 'WTF');
	// }, 5000);
}

const SampleForm = () =>
  <Card style={{padding: '40px'}}>
    <Form onSubmit={submit}>
      <Field name='username' label='Jméno'
        value='Aleš Menzel'
        component={Input}
        format={(val) => val} // state -> input
        parse={(val) => val} // input -> state
        transform={toUpperCase} // input -> state
        validate={[isRequired, minLength(5)]}
        required
			/>
      <Field name='email' label='E-mail'
        value='test'
        validate={[isRequired, minLength(5), isEmail]}
			>
        <Input />
      </Field>
      <Field name='test' label='Test'
        value=''
        component={Input}
        validate={isRequired}
			/>
      <Field name='optional' label='Optional'
        value=''
        component={Input}
			/>
      <Submit label='Odeslat' primary raised />
    </Form>
  </Card>

export default SampleForm
