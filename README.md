# react-forms

`react-forms` provides a [higher order component](https://facebook.github.io/react/docs/higher-order-components.html) for managing form state in [React](https://github.com/facebook/react).

## Motivation

* Do you need to interact with your form data globally from your application?
* Do you use Redux time travel features to record user interaction?

If your answers are `No, I don´t.` to both of those questions, then [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) to handle your form state.

## Instalation

```bash
npm install --save @alesmenzel/react-forms
```

Peer dependencies:

```bash
npm install --save react react-dom
```

## Examples

This example shows a simple form:
First we need to define how are the inputs displayed (i.e. [twitter bootstrap](http://getbootstrap.com/css/#forms), [material-ui](https://github.com/callemall/material-ui)/[react-toolbox](https://github.com/react-toolbox/react-toolbox) or your custom components)
Let´s define a simple input that only displays a given value and that handles value change (without validation or error messages)

```jsx
const MyInput = (props) => (
  <input
    type={props.type}
    value={props.field.value}
    onChange={(e) => props.onChange(e.target.value)}
    onBlur={props.onBlur}
  />
)
```

Here we define the actual form component, the only thing we need to pass in is a way of handling the submitting. In our case `onSubmit` is a simple action that performs an remote API call to our backend.

```jsx
import { Form, Field } from '@alesmenzel/react-forms'

const MyForm = (props) => {
  onSubmit = (values, state) => {
      // Call backend with your favourite request library
      return axios.post('/api/login', values)
      .then((res) => {
        // ...handle result
      }, (err) => {
        // ...handle errors, i.e.
        // you can set form errors by rejecting the promise and returning {fields: { [field]: [errors] }}
        return Promise.reject({
          fields: {
            username: ['Login credentials are not valid']
          }
        })
      })
    };

  return (
    <Form onSubmit={onSubmit}>
      <Field name="username" label="Jméno" value="JohnDoe">
        <MyInput type="text"/>
      </Field>
      <Field name="password" label="Jméno" value="SecretPassword123">
        <MyInput type="password"/>
      </Field>

      <input type="submit" value={"Submit"}/>
    </Form>
  )
}
```

### Using Redux to handle your submit actions

You can of course use Redux and a side effect library of your choice (thunk, saga, ...) to handle your API calls if you want.
Here is a sample:

```jsx
// container component
import { connect } from 'react-redux'
import { submitMyForm } from './actions'
import MyForm from './MyForm'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: values => dispatch(submitMyForm(values))
  }
}

const MyConnectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyForm)

export default MyConnectedForm
```

And the actions

```jsx
export const request = (payload) => ({
  type: 'REQUEST_INIT',
  payload
});

export const success = (payload) => ({
  type: 'REQUEST_SUCCESS',
  payload
});

export const failure = (payload) => ({
  type: 'REQUEST_FAILURE',
  payload
});

// Thunk
export const submitMyForm = (values) => {
  return (dispatch, getState) => {
    // Initialize the request
    dispatch(request(values))
    // Do the requesting with {insert your favorite library here}
    axios.post('/api/login', values)
    .then((res) => {
      // handle data
      dispatch(success(res.data))
    }, (err) => {
      // handle errors
      dispatch(failure(err.response.data))
    })
  }
}
```

### API

#### Field

Each Field component is passed these props.

Field handlers:

Key | Description | Signature
--- | --- | ---
`onChange` | Handles input changes, accepts the new input value | `onChange(value)`
`onFocus` | Focus event handler | `onFocus(event)`
`onBlur` | Blurring event handler, upon blurring the field is marked as touched | `onBlur(event)`
`onReset` | Resets the field to its initial value | `onReset()`

Field values:

Key | Type | Description
--- | --- | ---
`value` | * | Current field value
`initialValue` | * | Initial value
`meta` | Object |
`meta.key` | string | Field name
`meta.label` | string | Field label (is passed to the validation functions)
`meta.pristine` | boolean | User has NOT interacted with the field yet
`meta.dirty` | boolean | User has interacted with the field
`meta.touched` | boolean | Field has lost focus
`meta.untouched` | boolean | Field has NOT yet lost focus
`meta.valid` | boolean | All validation rules passes
`meta.invalid` | boolean | Some of the validation rules are not met
`meta.validating` | boolean | Validation in progress
`functions` | Object |
`functions.parse` | function | Parsing function (i.e. `(value) => moment(value)`)
`functions.transform` | function | Transformating function (i.e. `(value) => value.toUpperCase()`)
`functions.format` | function | Formatting function (i.e. `(value) => moment.format('YYYY-MM-DD')`)
`functions.validate` | Array\<function\> | Array of validation functions
`errors` | Array\<string\> | Array of error messages from validation rules

### Value lifecycle

`onChange(value)` -> `parse(value)` -> `transform(value)` -> { state } -> `format(value)`

#### Form

Key | Description | Signature
--- | --- | ---
`onSubmit` | Will be fired only when the form is valid. Returning a rejected promise can be used to set errors on fields. | `onSubmit(values, state)`

### Validation

#### Using the default validation functions

Notice we are using different syntax for inputs, instead of passing children we are giving the component as a prop (`component`)
and we pass other props from the Field component (`type="text"`).

```jsx
import { isEmail, isRequired } from '@alesmenzel/react-forms'

// Pass in a message
const email = isEmail('Invalid email address')
// Pass in a function that returns a message
const required = isRequired((field) => `Field ${field.meta.label} is required`)

const MyForm = ({onSubmit}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Field name="email" label="Email" validate={email} component={MyInput} type="text"/>
      <Field name="another_email" label="Required email" validate={[required, email]} component={MyInput} type="text"/>
      <input type="submit" value={"Submit"}/>
    </Form>
  )
}
```

As you can see the validate prop accepts both functions and an array of functions. In case of array, all rules must be met.

#### Built in validators

Numbers:
Name | Description | Signutare
--- | --- | ---
`minimum` | Check whether the value is at least `min` | minimum(msg, min)
`maximum` | Check whether the value is at most `max` | maximum(msg, max)
`range` | Check whether the value is at least `min` and at most `max` | range(msg, min, max)
`isNumber` | Check whether the value is a finite number | isNumber(msg)
`isInteger` | Check wheteher the value is an integer (a whole number) | isInteger(msg)
`isFloat` | Checks whether the value is a float | isFloat(msg)

String:

Name | Description | Signutare
--- | --- | ---
`minimumLength` | Checks if value has at least `min` length | `minimumLength(msg, min)`
`maximumLength` | Checks if value has at most `max` length | `maximumLength(msg, max)`
`length` | Checks if value is at least `min` and at most `max` length | `length = (msg, min, max)`
`isEqual` | Checks whether the value is equal to `comparison` | `isEqual(msg, comparison)`
`isNotEqual` | Checks whether the value is **not** equal to `comparison` | `isNotEqual(msg, comparison)`
`isIn` | Checks whether the value equals to one of `comparisons` | `isIn(msg, comparisons)`
`isNotIn` | Checks whether the value does **not** equal to any of `comparisons` | `isNotIn(msg, comparisons)`
`pattern` | Checks whether the value matches `pattern`, flags are optional (and can be passed with the pattern `/[A-Z]+/gi`) | | `pattern(msg, pattern, flags)`

Required:

Name | Description | Signutare
--- | --- | ---
`isRequired` | Checks whether a value is set | `isRequired(msg)`

Email:

Name | Description | Signutare
--- | --- | ---
`isEmail` | Checks for a valid email address (uses [isemail](https://github.com/hapijs/isemail) module) | `isEmail(msg)`

#### Using custom validation functions

You can also create a custom validator function. Here is a sample:

Validation functions should return error message if the rule is not met othervise return undefined.

```jsx
import { getMessage } from '@alesmenzel/react-forms'

export const isNumberEight = msg => {
  // enable passing a message or a function that returns a message
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value !== 8) {
      return getMessage(field)
    }
}
```

### Contributing

The main goal of this repository is to make working with react forms easy without forcing to use other technologies, like Redux.

### [Code of Conduct](./CODE_OF_CONDUCT.md)

We adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### License

This project is licensed under the terms of the [MIT license](./LICENCE).
